"use server";

import db from "@/db";
import { z } from "zod";
import env from "@/env";
import { auth } from "@/auth";
import { eq } from "drizzle-orm";
import {
  CreateCollectSchema,
  CreateRemoveCassette,
} from "../validations/collectCassete.validation";
import { users, transaction } from "@/db/schema";
import { IMachineApiData, TStatus, TTransType } from "@/types/model";
import { DEFAULT_POS } from "@/constants";

export async function createCollectCassete(
  params: z.infer<typeof CreateCollectSchema>,
  amount: number
): Promise<{ success: boolean; id?: string; wipId?: number; error?: string }> {
  try {
    const posId = env.POS_ID || DEFAULT_POS;
    const validData = CreateCollectSchema.safeParse(params);

    if (!validData.success) {
      return { success: false, error: "Invalid data." };
    }

    const session = await auth();
    if (!session?.user) {
      return { success: false, error: "Unauthorized." };
    }

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
          status: "wip" as TStatus,
          type: "endofday" as TTransType,
          cashIn: JSON.stringify([]),
          cashOut: JSON.stringify([]),
          amount: amount.toFixed(2),
          createAt: new Date(),
        })
        .returning();

      // API request
      const res = await fetch(`${env.API_URL}/api/endofday`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: env.API_KEY,
          apisecret: env.API_SECRET,
        },
        body: JSON.stringify({
          reqId: newTrans.id,
          posId,
          ...validData.data,
        }),
      });

      const { success, data, error } = await res.json();

      if (error) {
        console.warn("[WARN]", error);
      }

      if (success) {
        const { id } = data as IMachineApiData;
        return { success, wipId: id, id: newTrans.id };
      } else {
        throw new Error(error || "CI Service error");
      }
    });

    return apiResponse;
  } catch (error) {
    console.error("Error createCollectCassete:", error);
    return { success: false, error: `Error createCollectCassete: ${error}` };
  }
}

export async function createUnlockCasset(
  wipId: number,
  isUnlock: boolean,
  params: z.infer<typeof CreateRemoveCassette>
): Promise<{ success: boolean; error?: string }> {
  try {
    const validData = CreateRemoveCassette.safeParse(params);

    if (!validData.success) {
      return { success: false, error: "Invalid data." };
    }

    const session = await auth();
    if (!session?.user) {
      return { success: false, error: "Unauthorized." };
    }

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

      const endpoint = isUnlock
        ? `${env.API_URL}/api/endofday/${wipId}/remove?mc=${validData.data.mc}&force=true`
        : `${env.API_URL}/api/endofday/${wipId}/remove?mc=${validData.data.mc}`;

      const res = await fetch(endpoint, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          apikey: env.API_KEY,
          apisecret: env.API_SECRET,
        },
      });

      const { success, data, error } = await res.json();

      if (error) {
        console.warn("[WARN]", error);
      }

      if (success) {
        return { success, data };
      } else {
        return {
          success: false,
          error: `Cannot fetch API createUnlockCasset for ${params.mc}`,
        };
      }
    });

    return apiResponse;
  } catch (error) {
    console.error(`Error createUnlockCasset for ${params.mc}:`, error);
    return {
      success: false,
      error: `Error createUnlockCasset for ${params.mc}: ${error}`,
    };
  }
}

export async function getMachineStatusCollect(
  wipId: number
): Promise<{ success: boolean; data?: IMachineApiData; error?: string }> {
  const session = await auth();
  if (!session || !session.user) {
    return { success: false, error: "Unauthorized." };
  }
  try {
    const res = await fetch(`${env.API_URL}/api/pos/sale/${wipId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        apikey: env.API_KEY,
        apisecret: env.API_SECRET,
      },
    });

    const { success, data, error } = await res.json();

    if (error) {
      console.warn("[WARN]", error);
    }

    if (success) {
      return { success, data: data as IMachineApiData };
    }
    return { success: false, error: "Incorrect collectId" };
  } catch (error) {
    console.error("Error getMachineStatusCollect:", error);
    return { success: false, error: `Error getMachineStatusCollect: ${error}` };
  }
}

export async function createCollectRecheck(
  params: z.infer<typeof CreateCollectSchema>,
  transId: string,
  wipId: number
): Promise<{ success: boolean; id?: string; error?: string }> {
  try {
    const validData = CreateCollectSchema.safeParse(params);
    const posId = env.POS_ID || DEFAULT_POS;
    if (!validData.success) {
      return { success: false, error: "Invalid data." };
    }

    const session = await auth();
    if (!session?.user) {
      return { success: false, error: "Unauthorized." };
    }

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

      const res = await fetch(`${env.API_URL}/api/endofday/${wipId}/collect`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          apikey: env.API_KEY,
          apisecret: env.API_SECRET,
        },
        body: JSON.stringify({
          reqId: transId,
          posId,
          ...validData.data,
        }),
      });

      const { success, message, error } = await res.json();

      if (success) {
        return { success, message };
      } else {
        console.warn("[WARN]", error);
        return {
          success: false,
          error: error || "Cannot fetch API Re CollectCassete.",
        };
      }
    });

    return apiResponse;
  } catch (error) {
    console.error("Error create Re CollectCoin:", error);
    return { success: false, error: `Error Re createCollectCoin: ${error}` };
  }
}
