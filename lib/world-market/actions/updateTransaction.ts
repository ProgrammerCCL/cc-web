"use server";

import db from "@/db";
import { transaction } from "@/db/schema";
import { IDenomination } from "@/types/model";
import { eq } from "drizzle-orm";

export async function updateCashDetailsWmSyncSucces(
  transactionId: string,
  cashIn: IDenomination[],
  cashOut: IDenomination[],
  status: "wip" | "finish" | "cancel" | "error",
  httpStatus: number,
  erpMessege: string,
  erpDetail: string
): Promise<boolean> {
  try {
    const cashInJson = JSON.stringify(cashIn || []);
    const cashOutJson = JSON.stringify(cashOut || []);

    await db
      .update(transaction)
      .set({
        cashIn: cashInJson,
        cashOut: cashOutJson,
        status,
        httpStatus,
        isError: false,
        erpMessege,
        erpDetail,
      })
      .where(eq(transaction.id, transactionId));

    return true; // คืนค่า true ถ้าอัปเดตสำเร็จ
  } catch (error) {
    console.error("Error updating cash details:", error);
    return false; // คืนค่า false ถ้ามีปัญหาในการอัปเดต
  }
}

export async function updateCashDetailsWmSyncfail(
  transactionId: string,
  cashIn: IDenomination[],
  cashOut: IDenomination[],
  status: "wip" | "finish" | "cancel" | "error",
  httpStatus: number,
  erpMessege: string,
  erpDetail: string
): Promise<boolean> {
  try {
    const cashInJson = JSON.stringify(cashIn || []);
    const cashOutJson = JSON.stringify(cashOut || []);

    await db
      .update(transaction)
      .set({
        cashIn: cashInJson,
        cashOut: cashOutJson,
        status,
        httpStatus,
        erpMessege,
        erpDetail,
      })
      .where(eq(transaction.id, transactionId));

    return true; // คืนค่า true ถ้าอัปเดตสำเร็จ
  } catch (error) {
    console.error("Error updating cash details:", error);
    return false; // คืนค่า false ถ้ามีปัญหาในการอัปเดต
  }
}

export async function updateCashDetailsWmCancelOrErr(
  transactionId: string,
  cashIn: IDenomination[],
  cashOut: IDenomination[],
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

export async function updateCashDetailsWmReSyncSucces(
  transactionId: string,

  httpStatus: number,
  erpMessege: string,
  erpDetail: string
): Promise<boolean> {
  try {
    await db
      .update(transaction)
      .set({
        httpStatus,
        isError: false,
        erpMessege,
        erpDetail,
      })
      .where(eq(transaction.id, transactionId));

    return true; // คืนค่า true ถ้าอัปเดตสำเร็จ
  } catch (error) {
    console.error("Error updating cash details:", error);
    return false; // คืนค่า false ถ้ามีปัญหาในการอัปเดต
  }
}

export async function updateCashDetailsWmReSyncError(
  transactionId: string,
  httpStatus: number,
  erpMessege: string,
  erpDetail: string
): Promise<boolean> {
  try {
    await db
      .update(transaction)
      .set({
        httpStatus,
        isError: true,
        erpMessege,
        erpDetail,
      })
      .where(eq(transaction.id, transactionId));

    return true; // คืนค่า true ถ้าอัปเดตสำเร็จ
  } catch (error) {
    console.error("Error updating cash details:", error);
    return false; // คืนค่า false ถ้ามีปัญหาในการอัปเดต
  }
}

export async function updateCashDetailsWmReSyncErrorclient(
  transactionId: string,
  status: "error"
): Promise<boolean> {
  try {
    await db
      .update(transaction)
      .set({
        status,
      })
      .where(eq(transaction.id, transactionId));

    return true; // คืนค่า true ถ้าอัปเดตสำเร็จ
  } catch (error) {
    console.error("Error updating cash details:", error);
    return false; // คืนค่า false ถ้ามีปัญหาในการอัปเดต
  }
}
