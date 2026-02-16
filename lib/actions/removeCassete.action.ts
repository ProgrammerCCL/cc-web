"use server";
import {
  CreateRemoveCassette,
  CreateRemoveSchema,
} from "../validations/removeCassete.vaildation";
import db from "@/db";
import env from "@/env";
import { z } from "zod";
import { auth } from "@/auth";
import { eq } from "drizzle-orm";
import { users, transaction } from "@/db/schema";
import { TStatus, TTransType, IMachineApiData } from "@/types/model";
import { DEFAULT_POS } from "@/constants";

export async function createRemoveCassete(
  params: z.infer<typeof CreateRemoveSchema>,
  amount: number
): Promise<{ success: boolean; id?: string; wipId?: number; error?: string }> {
  try {
    const posId = env.POS_ID || DEFAULT_POS;
    const validData = CreateRemoveSchema.safeParse(params);

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
        throw new Error("Unauthorized");
        // return {
        //   success: false,
        //   error: "Unauthorized",
        // };
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

      const res = await fetch(`${env.API_URL}/api/v2/remove-cassette`, {
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

      if (success) {
        const { id } = data as IMachineApiData;
        return { success, wipId: id, id: newTrans.id };
      } else {
        // tx.rollback();
        // return {
        //   success: false,
        //   error: "Cannot fetch API RemoveCassette.",
        // };
        throw new Error(error || "Cannot fetch API RemoveCassette");
      }
    });

    return apiResponse;
  } catch (error: any) {
    console.error("Error createRemoveCassete:", error);
    return {
      success: false,
      error: `Error createRemoveCassete: ${error.message}`,
    };
  }
}

export async function createFinishRemoveCassete(
  wipId: number
): Promise<{ success: boolean; wipId?: number; error?: string }> {
  try {
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
        throw Error("Unauthorized");
      }
      const res = await fetch(
        `${env.API_URL}/api/v2/remove-cassette/${wipId}/finish`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            apikey: env.API_KEY,
            apisecret: env.API_SECRET,
          },
        }
      );

      const { success, error } = await res.json();

      if (success) {
        return { success };
      } else {
        console.error("[ERROR]", error);
        return {
          success: false,
          error: `Cannot fetch API Create Finish Remove-Cassette Server: ${error.message || error}`,
        };
      }
    });

    return apiResponse;
  } catch (error: any) {
    console.error("Error createFinishRemove-Cassette:", error);
    return {
      success: false,
      error: `Error createFinishRemove-Cassette: ${error.message || error}`,
    };
  }
}

export async function createRemoveUnlockCasset(
  wipId: number,
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

      const endpoint = `${env.API_URL}/api/v2/remove-cassette/${wipId}/remove?mc=${validData.data.mc}`;

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
