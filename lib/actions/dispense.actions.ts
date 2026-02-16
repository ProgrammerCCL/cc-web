"use server";

import db from "@/db";
import env from "@/env";
import { z } from "zod";
import { auth } from "@/auth";
import { eq } from "drizzle-orm";
import { transaction, users } from "@/db/schema";
import { CreateDispanseSchema } from "../validations/dispanse.validation";
import {
  IDenomination,
  IMachineApiData,
  TTransType,
  TStatus,
} from "@/types/model";
import { DEFAULT_POS } from "@/constants";

export async function createDispense(
  params: z.infer<typeof CreateDispanseSchema>
): Promise<{ success: boolean; id?: string; wipId?: number; error?: string }> {
  try {
    // Validate input data
    const validData = CreateDispanseSchema.safeParse(params);
    if (!validData.success) {
      return { success: false, error: "Invalid data." };
    }

    // Authenticate user session
    const session = await auth();
    if (!session?.user) {
      return { success: false, error: "Unauthorized." };
    }

    // Start transaction
    const { transId, wipId } = await db.transaction(async (tx) => {
      const [requester] = await tx
        .select()
        .from(users)
        .where(eq(users.id, session.user.id || ""))
        .execute();

      if (!requester || !requester.id) {
        throw Error("Unauthorized");
      }

      const [newTrans] = await tx
        .insert(transaction)
        .values({
          userId: requester.id,
          userName: requester.name || "-",
          status: "wip" as TStatus,
          type: "dispense" as TTransType,
          cashIn: JSON.stringify([]),
          cashOut: JSON.stringify([]),
          amount: validData.data.amount.toString(),
          createAt: new Date(),
        })
        .returning();

      if (!newTrans) {
        throw new Error("[DB] Create failed.");
      }

      // API request
      const res = await fetch(`${env.API_URL}/api/pos/dispense`, {
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

      if (!success) {
        throw new Error(error || "[API] Create dispense error.");
      }

      return { transId: newTrans.id, wipId: data.id };
    });

    return {
      success: true,
      id: transId,
      wipId,
    };
  } catch (error: any) {
    console.error("Error createDispense:", error);
    return {
      success: false,
      error: `Error createDispense: ${error.message}`,
    };
  }
}

// ! deprecate : change to getWIPv2ById
export async function getDispense(
  posId: number
): Promise<{ success: boolean; data?: IMachineApiData; error?: string }> {
  try {
    // Authenticate user session
    const session = await auth();
    if (!session?.user) {
      return { success: false, error: "Unauthorized." };
    }

    // API request
    const res = await fetch(`${env.API_URL}/api/pos/dispense/${posId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        apikey: env.API_KEY,
        apisecret: env.API_SECRET,
      },
    });

    const { success, data } = await res.json();
    if (!success) {
      return { success: false, error: "Cannot fetch API Get Dispense." };
    }

    return { success: true, data: data as IMachineApiData };
  } catch (error: any) {
    console.error("Error getDispense:", error);
    return {
      success: false,
      error: `Error getDispense: ${error.message || error}`,
    };
  }
}

export async function updateCashDetails(
  transId: string,
  cashOut: IDenomination[],
  amount: string
): Promise<boolean> {
  try {
    const cashOutJson = JSON.stringify(cashOut || []);

    await db
      .update(transaction)
      .set({
        cashOut: cashOutJson,
        amount,
        status: "finish",
      })
      .where(eq(transaction.id, transId));

    return true; // คืนค่า true ถ้าอัปเดตสำเร็จ
  } catch (error) {
    console.error("Error updating cash details:", error);
    return false; // คืนค่า false ถ้ามีปัญหาในการอัปเดต
  }
}
