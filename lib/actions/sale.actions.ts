"use server";

import * as z from "zod";
import { auth } from "@/auth";
import { transaction, users } from "@/db/schema";
import { IMachineApiData } from "@/types/model";
import db from "@/db";
import env from "@/env";
import { eq } from "drizzle-orm";

import {
  CancelSaleSchema,
  CreateSaleSchema,
} from "@/lib/validations/sale.validation";
import { DEFAULT_POS } from "@/constants";

export async function posSale(
  params: z.infer<typeof CreateSaleSchema>
): Promise<{
  success: boolean;
  wipId?: number;
  transactionId?: string;
  error?: string;
}> {
  try {
    // Validate input data
    const posId = env.POS_ID || DEFAULT_POS;
    const validData = CreateSaleSchema.safeParse(params);

    if (!validData.success) {
      return { success: false, error: "Invalid request data." };
    }

    // Check user session
    const session = await auth();
    if (!session || !session.user) {
      return { success: false, error: "Unauthorized." };
    }

    const saleProcess = await db.transaction(async (tx) => {
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
          type: "sale",
          cashIn: JSON.stringify([]),
          cashOut: JSON.stringify([]),
          amount: validData.data.amount.toString(),
          createAt: new Date(),
          status: "wip",
          remarks: validData.data.remarks,
        })
        .returning();

      // Call external API with the transaction ID (newTrans.id)
      const res = await fetch(`${env.API_URL}/api/pos/sale`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: env.API_KEY,
          apisecret: env.API_SECRET,
        },
        body: JSON.stringify({
          ...validData.data,
          reqId: newTrans.id,
          posId,
        }),
      });

      const { success, data, error } = await res.json();

      if (success) {
        const { id } = data as IMachineApiData;
        return { success, wipId: id, transactionId: newTrans.id };
      } else {
        throw new Error(error || "CI Service error");
      }
    });

    return saleProcess;
  } catch (error: any) {
    const errMsg = error?.message || "Something went wrong at server side.";
    return {
      success: false,
      error: errMsg,
    };
  }
}

export async function getMachineSaleStatus(
  saleId: number
): Promise<{ success: boolean; data?: IMachineApiData; error?: string }> {
  const session = await auth();
  if (!session || !session.user) {
    return { success: false, error: "Unauthorized." };
  }
  try {
    const res = await fetch(`${env.API_URL}/api/pos/sale/${saleId}`, {
      method: "GET",
      headers: {
        apikey: env.API_KEY,
        apisecret: env.API_SECRET,
      },
    });

    const { success, data } = await res.json();

    if (success) {
      return { success, data: data as IMachineApiData };
    }

    return { success: false, error: "Incorrect saleId" };
  } catch (err: any) {
    console.error("[ERROR]", err.message);
    return { success: false, error: "Something went wrong at server side." };
  }
}

export async function cancelSale(
  params: z.infer<typeof CancelSaleSchema>
): Promise<{ success: boolean; message?: string; error?: string }> {
  const validData = CancelSaleSchema.safeParse(params);

  if (!validData.success) {
    return { success: false, error: "Invalid request data." };
  }

  const session = await auth();
  if (!session || !session.user) {
    return { success: false, error: "Unauthorized." };
  }

  try {
    const { saleId, reqId, cancelRequest } = validData.data;
    const res = await fetch(`${env.API_URL}/api/pos/sale/${saleId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        apikey: env.API_KEY,
        apisecret: env.API_SECRET,
      },
      body: JSON.stringify({
        reqId,
        cancelRequest,
      }),
    });

    const { success, error } = await res.json();

    if (success) {
      return {
        success,
        message: "Cancelling sale.",
      };
    } else {
      console.warn("[WARN]", error);
    }

    return {
      success: false,
      error: "Failed to cancel sale. API returned unsuccessful response.",
    };
  } catch (error) {
    if (error instanceof Error) {
      // ตรวจสอบว่า error เป็น Error object
      console.error("Error cancelSale:", error.message);
      return {
        success: false,
        error: `Error cancelSale: ${error.message}`,
      };
    } else {
      console.error("Unknown error:", error);
      return {
        success: false,
        error: "An unknown error occurred.",
      };
    }
  }
}
