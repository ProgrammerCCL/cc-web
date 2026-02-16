"use server";

import db from "@/db";
import { transaction } from "@/db/schema";
import { IDenomination } from "@/types/model";
import { eq } from "drizzle-orm";

export async function updateCashDetails(
  transactionId: string,
  cashIn: IDenomination[],
  cashOut: IDenomination[],
  total: number,
  status: "wip" | "finish" | "cancel" | "error"
): Promise<boolean> {
  try {
    const cashInJson = JSON.stringify(cashIn || []);
    const cashOutJson = JSON.stringify(cashOut || []);

    await db
      .update(transaction)
      .set({
        cashIn: cashInJson,
        cashOut: cashOutJson,
        amount: total.toFixed(2),
        status,
      })
      .where(eq(transaction.id, transactionId));

    return true; // คืนค่า true ถ้าอัปเดตสำเร็จ
  } catch (error) {
    console.error("Error updating cash details:", error);
    return false; // คืนค่า false ถ้ามีปัญหาในการอัปเดต
  }
}

export async function deleteTransaction(transId: string): Promise<boolean> {
  try {
    await db.delete(transaction).where(eq(transaction.id, transId));

    return true;
  } catch (err: any) {
    console.error("[ERROR]", err.message);
    return false;
  }
}
