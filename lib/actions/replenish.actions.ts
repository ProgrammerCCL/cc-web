"use server";

import db from "@/db";
import env from "@/env";
import { auth } from "@/auth";
import { eq } from "drizzle-orm";
import { transaction, users } from "@/db/schema";
import { NextResponse } from "next/server";
import { IDenomination, IMachineApiData } from "@/types/model";
import { DEFAULT_POS } from "@/constants";
import { CreateRefillSchema } from "../validations/replenisment.validation";

export async function endRefill(procId: number) {
  try {
    // Replenis_End
    const res = await fetch(`${env.API_URL}/api/pos/refill/${procId}/end`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        apikey: env.API_KEY,
        apisecret: env.API_SECRET,
      },
    });

    const { success, data } = await res.json();
    if (success) {
      return {
        success: true,
        data,
      };
    } else {
      return {
        success: false,
        error: "Cannot End refill.",
      };
    }
  } catch (error) {
    console.error("Error endRefill:", error);
    return NextResponse.json({
      success: false,
      error: `Error endRefill: ${error}`,
      user: null,
    });
  }
}

export async function getRefill(
  procId: number
): Promise<{ success: boolean; data?: IMachineApiData; error?: string }> {
  const session = await auth();
  if (!session || !session.user) {
    return { success: false, error: "Unauthorized." };
  }
  try {
    const res = await fetch(`${env.API_URL}/api/pos/refill/${procId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        apikey: env.API_KEY,
        apisecret: env.API_SECRET,
      },
    });

    const { success, data } = await res.json();
    if (success) {
      return { success, data: data as IMachineApiData };
    }

    return { success: false, error: "Incorrect refill" };
  } catch (err: any) {
    console.error("[ERROR]", err.message);
    return { success: false, error: "Something went wrong at server side." };
  }
}

export async function postRefill(
  machineId: string
): Promise<{ success: boolean; id?: string; wipId?: number; error?: string }> {
  try {
    const validData = CreateRefillSchema.safeParse({ machineId });

    if (!validData.success) {
      return { success: false, error: "Invalid data." };
    }

    const session = await auth();
    if (!session || !session.user) {
      return { success: false, error: "Unauthorized." };
    }

    // Handle database transaction and API call
    const apiResponse = await db.transaction(async (tx) => {
      const [requester] = await tx
        .select()
        .from(users)
        .where(eq(users.id, session.user.id || ""))
        .execute();

      if (!requester || !requester.id) {
        return {
          success: false,
          error: "Unauthorized",
        };
      }

      const [newTrans] = await tx
        .insert(transaction)
        .values({
          userId: requester.id,
          userName: requester.name || "-",
          type: "refill",
          cashIn: JSON.stringify([]),
          cashOut: JSON.stringify([]),
          amount: "0.00",
          createAt: new Date(),
          status: "wip",
        })
        .returning();

      const res = await fetch(`${env.API_URL}/api/pos/refill`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: env.API_KEY,
          apisecret: env.API_SECRET,
        },
        body: JSON.stringify({
          reqId: newTrans.id,
          posId: env.POS_ID || DEFAULT_POS,
          ...validData.data,
        }),
      });

      const { success, data, error } = await res.json();

      if (success) {
        const { id } = data as IMachineApiData;
        return { success, wipId: id, error, id: newTrans.id };
      } else {
        throw new Error(error || "CI Service error");
      }
    });

    return apiResponse;
  } catch (error) {
    return { success: false, error: `Error postRefill: ${error}` };
  }
}

export async function finishRefill(
  transId: string,
  cashIn: IDenomination[],
  amount: string
): Promise<boolean> {
  try {
    const cashInJson = JSON.stringify(cashIn || []);
    await db
      .update(transaction)
      .set({
        cashIn: cashInJson,
        amount,
        status: "finish",
      })
      .where(eq(transaction.id, transId));

    return true;
  } catch (err: any) {
    console.error("[ERROR]", err.message);
    return false;
  }
}
