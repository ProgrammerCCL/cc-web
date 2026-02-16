"use server";

import db from "@/db";
import env from "@/env";
import { z } from "zod";
import { auth } from "@/auth";
import { eq } from "drizzle-orm";
import { transaction, users } from "@/db/schema";
import {
  IDenomination,
  TTransType,
  TStatus,
  IMachineApiData,
} from "@/types/model";
import {
  CreateExchangeDispenseSchema,
  CreateExchangeSaleSchema,
} from "../validations/exchange.validation";
import { DEFAULT_POS } from "@/constants";

export async function getExchangeFee() {
  try {
    return Number(env.EXC_FEE) || 0;
  } catch (err: any) {
    console.error("[ERROR] getExchange error");
    return 0;
  }
}

export async function createExchangeSale(
  params: z.infer<typeof CreateExchangeSaleSchema>
): Promise<{
  success: boolean;
  id?: string;
  wipId?: number;
  error?: string;
}> {
  try {
    const validData = CreateExchangeSaleSchema.safeParse(params);
    if (!validData.success) {
      return { success: false, error: "Invalid data." };
    }

    // Authenticate user session
    const session = await auth();
    if (!session?.user) {
      return { success: false, error: "Unauthorized." };
    }

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
          type: "exchange" as TTransType,
          cashIn: JSON.stringify([]),
          cashOut: JSON.stringify([]),
          amount: validData.data.amount.toString(),
          createAt: new Date(),
        })
        .returning();

      if (!newTrans) {
        throw new Error("[DB] Create failed.");
      }

      const res = await fetch(`${env.API_URL}/api/exchange/sale`, {
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
        throw new Error(error || "[API] Create exchange-sale error.");
      }

      return { transId: newTrans.id, wipId: data.id };
    });

    return {
      success: true,
      id: transId,
      wipId,
    };
  } catch (error: any) {
    console.error("Error createExchangeSale:", error.message);
    return {
      success: false,
      error: `Error createExchangeSale: ${error.message}`,
    };
  }
}

export async function createExchangeDispense(
  params: z.infer<typeof CreateExchangeDispenseSchema>
): Promise<{
  success: boolean;
  id?: string;
  wipId?: number;
  error?: string;
}> {
  try {
    const validData = CreateExchangeDispenseSchema.safeParse(params);
    if (!validData.success) {
      return { success: false, error: "Invalid data." };
    }

    const session = await auth();
    if (!session?.user) {
      return { success: false, error: "Unauthorized." };
    }

    const res = await fetch(`${env.API_URL}/api/exchange/dispense`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: env.API_KEY,
        apisecret: env.API_SECRET,
      },
      body: JSON.stringify({
        reqId: validData.data.transId,
        posId: env.POS_ID || DEFAULT_POS,
        ...validData.data,
      }),
    });

    const { success, data, error } = (await res.json()) as {
      success: boolean;
      data: IMachineApiData;
      error: string;
    };

    if (!success || error) {
      return {
        success: false,
        error: error || "Cannot fetch API Dispanse Exchange.",
      };
    }

    return { success: true, wipId: data.id, id: data.clientReqID };
  } catch (error: any) {
    console.error("Error createExchangeDispense:", error.message);
    return {
      success: false,
      error: `Error createExchangeDispense: ${error.message}`,
    };
  }
}

export async function updateExchangeDetails({
  transId,
  cashIn,
  cashOut,
  amount,
  fee,
}: {
  transId: string;
  cashOut: IDenomination[];
  cashIn: IDenomination[];
  amount: number;
  fee?: number;
}): Promise<boolean> {
  try {
    const cashOutJson = JSON.stringify(cashOut || []);
    const cashInJson = JSON.stringify(cashIn || []);
    const excFee = fee || 0;

    await db
      .update(transaction)
      .set({
        cashOut: cashOutJson,
        cashIn: cashInJson,
        amount: amount.toFixed(2),
        fee: excFee.toFixed(2),
        status: "finish",
      })
      .where(eq(transaction.id, transId));

    return true;
  } catch (error) {
    console.error("Error updating cash details:", error);
    return false;
  }
}
