"use server";

import { unstable_noStore as noStore } from "next/cache";
import moment from "moment";
import db from "@/db";
import { and, between } from "drizzle-orm";
import { transaction } from "@/db/schema";

interface IGetTrxReportParams {
  dateStr: string;
  fromStr?: string | null;
  showCancel?: boolean;
}

export async function getTrxReport({
  dateStr,
  fromStr,
  showCancel,
}: IGetTrxReportParams): Promise<any[]> {
  noStore();

  try {
    // แปลงวันที่จาก string เป็น moment
    const dateMoment = moment(dateStr);
    const fromMoment = moment(fromStr || dateStr);

    // console.log(
    //   "[DEBUG] dateStr:",
    //   dateStr,
    //   "dateMoment:",
    //   dateMoment.format()
    // );
    // console.log(
    //   "[DEBUG] fromStr:",
    //   fromStr,
    //   "fromMoment:",
    //   fromMoment.format()
    // );

    if (!dateMoment.isValid()) return [];

    const search = [
      between(
        transaction.createAt,
        fromMoment.startOf("day").toDate(),
        dateMoment.endOf("day").toDate()
      ),
    ];

    // ถ้าไม่ต้องการแสดงรายการที่ถูกยกเลิก
    // if (!showCancel) {
    //   search.push(ne(transaction.status, "cancel"));
    // }

    // ดึงข้อมูลจากฐานข้อมูล
    const data = await db
      .select()
      .from(transaction)
      .where(and(...search))
      .execute();

    return data || [];
  } catch (err: any) {
    console.error("[ERROR]", err.message);
    return [];
  }
}
