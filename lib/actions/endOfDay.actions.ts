"use server";

import db from "@/db";
import env from "@/env";
import { auth } from "@/auth";
import { eq } from "drizzle-orm";
import { users } from "@/db/schema";

export async function createFinishEndOfDay(
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
        `${env.API_URL}/api/endofday/${wipId}/finish`, // Pass mc in the searchParams
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
          error: `Cannot fetch API Create Finish EndOfDay Server: ${error.message || error}`,
        };
      }
    });

    return apiResponse;
  } catch (error: any) {
    console.error("Error createFinishEndOfDay:", error);
    return {
      success: false,
      error: `Error createFinishEndOfDay: ${error.message || error}`,
    };
  }
}
