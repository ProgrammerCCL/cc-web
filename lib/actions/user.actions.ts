"use server";

import db from "@/db";
import { eq } from "drizzle-orm";
import { users } from "@/db/schema";

export async function getUserbyId(id: string) {
  try {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, id))
      .execute();

    return user;
  } catch (error: any) {
    console.error("Error get by ID:", error);
  }
}
