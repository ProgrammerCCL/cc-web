"use server";

import moment from "moment";
import { getTrxReportByDate } from "./transactions.actions";
import { IPrintReportData } from "@/types/share";
import { getInventory } from "./inventory.actions";
import { env } from "process";
import { z } from "zod";
import { PrintApiSchema } from "../validations/api-print.validation";

const PRINT_API_METHOD = "POST";
const PRINT_API_ENDPOINT = "/api/report";

type TAggData = {
  date: string;
  totalSale: number;
  totalFee: number;
  totalRefill: number;
  totalDeposit: number;
  totalDispense: number;
  totalRelease: number;
  thisRelease: number;
  thisRemaining: number;
};

const CONCERN_TRX_TYPE = [
  "sale",
  "refill",
  "deposit",
  "dispense",
  "endofday",
  "exchange",
];

// Default structure to accumulate and return summary values
const INIT_AGG_DATA = {
  date: "",
  totalSale: 0,
  totalFee: 0,
  totalRefill: 0,
  totalDeposit: 0,
  totalDispense: 0,
  totalRelease: 0,
  thisRelease: 0,
  thisRemaining: 0,
} as TAggData;

// Format all numeric values to 2 decimal places with comma separators
const format = (val: number) =>
  val.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

const formatPrintReportData = (values: TAggData) => {
  return {
    ...values,
    totalSale: format(values.totalSale),
    totalFee: format(values.totalFee),
    totalRefill: format(values.totalRefill),
    totalDeposit: format(values.totalDeposit),
    totalDispense: format(values.totalDispense),
    totalRelease: format(values.totalRelease),
    thisRelease: format(values.thisRelease),
    thisRemaining: format(values.thisRemaining),
  };
};

/**
 * Server action to generate a printable daily transaction report summary
 *
 * @param allDay - if true, includes the whole day's data
 * @returns IPrintReportData | undefined
 */
export const getPrintReportData = async ({
  allDay,
  selectedDate, // เพิ่ม selectedDate
}: {
  allDay?: boolean;
  selectedDate: string; // รับ selectedDate เป็น string
}): Promise<IPrintReportData | undefined> => {
  const date = selectedDate || moment().format("YYYY-MM-DD"); // หากไม่ส่ง selectedDate ใช้วันที่ปัจจุบัน

  try {
    // calculate thisRemaining ( remain cash in the machine)
    let thisRemaining = 0;

    const { data: inventory } = await getInventory();
    if (inventory && inventory.length > 0) {
      thisRemaining = inventory.reduce(
        (prev, inv) => prev + inv.value * inv.inventoryQty,
        0
      );
    }

    // Fetch merged transaction report (from both API + DB)
    const trxRaw = await getTrxReportByDate({ date });

    // Sort transactions chronologically
    let trxReport = trxRaw
      .filter((row) => CONCERN_TRX_TYPE.includes(row.trxType))
      .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());

    if (trxReport.length === 0) {
      return formatPrintReportData({ ...INIT_AGG_DATA, date, thisRemaining });
    }

    let thisRelease = 0;
    const latestTrx = trxReport.at(trxReport.length - 1);

    // If the latest transaction is endofday, we treat it as thisRelease.
    // It's excluded from the reducer aggregation.
    if (latestTrx && latestTrx.trxType === "endofday") {
      thisRelease = latestTrx.amount;
      trxReport = trxReport.slice(0, -1);
    }

    // When not printing full day, only include transactions after the latest "endofday"
    if (!allDay) {
      const latestEODIndex = trxReport.findLastIndex(
        (t) => t.trxType === "endofday"
      );

      // If "endofday" is found
      if (latestEODIndex >= 0) {
        // Remove all transactions before and exclude the endofday (latestEODIndex)
        trxReport = trxReport.slice(latestEODIndex + 1);
      }
    }

    // Accumulate summary totals
    const data = trxReport.reduce(
      (acc, trx) => {
        const amount = trx.amount ?? 0;
        const fee = trx.trxFee ?? 0;

        switch (trx.trxType) {
          case "sale":
            acc.totalSale += amount;
            acc.totalFee += fee;
            break;
          case "refill":
            acc.totalRefill += amount;
            acc.totalFee += fee;
            break;
          case "deposit":
            acc.totalDeposit += amount;
            acc.totalFee += fee;
            break;
          case "dispense":
            acc.totalDispense += amount;
            acc.totalFee += fee;
            break;
          case "endofday":
            acc.totalRelease += amount;
            acc.totalFee += fee;
            break;
          case "exchange":
            acc.totalFee += fee;
            break;
        }

        return acc;
      },
      { ...INIT_AGG_DATA, date, thisRemaining }
    );

    // Set thisRelease captured earlier
    data.thisRelease = thisRelease;

    return formatPrintReportData(data);
  } catch (err: any) {
    console.error("[ERROR getPrintReportData]", err.message);
    return undefined;
  }
};

// เพิ่มการ export ฟังก์ชัน printTransaction
export async function printTransaction(
  params: z.infer<typeof PrintApiSchema>
): Promise<boolean | undefined> {
  const validData = PrintApiSchema.safeParse(params);
  if (!validData.success) {
    console.error("[ERROR] printTransaction Error", {
      errors: validData.error,
    });
    return;
  }

  try {
    const response = await fetch(`${env.PRINT_API_URL}${PRINT_API_ENDPOINT}`, {
      method: PRINT_API_METHOD,
      body: JSON.stringify(validData.data),
    });

    return response.ok;
  } catch (err: any) {
    console.error("[ERROR]", err.message);
  }
}
