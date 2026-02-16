"use server";

import * as z from "zod";
import { auth } from "@/auth";
import { transaction, users } from "@/db/schema";
import { IMachineApiData } from "@/types/model";
import db from "@/db";
import env from "@/env";
import { eq } from "drizzle-orm";
import { CreateSaleSchema } from "../validations/wmSale.validation";
import { DEFAULT_POS } from "@/constants";

export async function posWmSale(
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
          isError: true,
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
