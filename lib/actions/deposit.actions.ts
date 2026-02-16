"use server";

import db from "@/db";
import env from "@/env";
import { auth } from "@/auth";
import { eq } from "drizzle-orm";
import { transaction, users } from "@/db/schema";
import { NextResponse } from "next/server";
import { IDenomination, IMachineApiData } from "@/types/model";
import { DEFAULT_POS } from "@/constants";
import { CreateDepositSchema } from "../validations/deposit.validation";

export async function endDeposit(procId: number) {
  try {
    const res = await fetch(`${env.API_URL}/api/pos/deposit/${procId}/end`, {
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
        error: "Cannot End deposit.",
      };
    }
  } catch (error) {
    console.error("Error endDeposit:", error);
    return NextResponse.json({
      success: false,
      error: `Error endDeposit: ${error}`,
      user: null,
    });
  }
}

export async function postDeposit(
  machineId: string,
  remarks: string
): Promise<{ success: boolean; id?: string; wipId?: number; error?: string }> {
  try {
    const validData = CreateDepositSchema.safeParse({ machineId, remarks });

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
          type: "deposit",
          cashIn: JSON.stringify([]),
          cashOut: JSON.stringify([]),
          amount: "0.00",
          createAt: new Date(),
          status: "wip",
          remarks,
        })
        .returning();

      const res = await fetch(`${env.API_URL}/api/pos/deposit`, {
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

export async function finishDeposit(
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
