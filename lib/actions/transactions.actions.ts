"use server";

import moment from "moment";
import db from "@/db";
import env from "@/env";
import { auth } from "@/auth";
import { eq, between } from "drizzle-orm";
import { transaction } from "@/db/schema";
import {
  IMachineApiData,
  ITransaction,
  // ITransactionReport,
  ITrxReport,
  TStatus,
} from "@/types/model";
import { cwtPrefixMap } from "@/constants";
import { apiDenomSafeParse } from "../utils";

export async function getTrxReportByDate({
  date,
}: {
  date: string;
}): Promise<ITrxReport[]> {
  try {
    const session = await auth();
    if (!session?.user) {
      return [];
    }

    const searchDate = moment(date) || undefined;
    if (!searchDate) return [];

    // TODO : log ดูว่ามีครบไหม
    // Fetch transactions from REST API
    // Some transaction might come from other client or POS.
    const apiTrxData = await (async (): Promise<IMachineApiData[]> => {
      try {
        const res = await fetch(
          `${env.API_URL}/api/history?date=${searchDate.format("YYYY-MM-DD")}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              apikey: env.API_KEY,
              apisecret: env.API_SECRET,
            },
          }
        );

        const { data } = await res.json();

        return data || [];
      } catch (err: any) {
        console.error("[ERROR] getTrxReportByDate : Fetch CWTAPI failed.");
        console.error("[ERROR]", err.message);
        return [];
      }
    })();

    // Transaction from CCWEB
    const pgTrxData = await (async () => {
      try {
        const trxs = await db
          .select()
          .from(transaction)
          .where(
            between(
              transaction.createAt,
              searchDate.startOf("day").toDate(),
              searchDate.endOf("day").toDate()
            )
          )
          .execute();
        return trxs || [];
      } catch (err: any) {
        console.error("[ERROR] getTrxReportByDate : Fetch Pg Data failed.");
        console.error("[ERROR]", err.message);
        return [];
      }
    })();

    // Merge data from CCWEB & CWTAPI
    // data from CCWEB is subset of CWTAPI
    const trxMerged = [] as ITrxReport[];

    for (const apiData of apiTrxData) {
      if (apiData.reqID.startsWith("RST")) {
        // Exclude Reset Transaction from report
        continue;
      }

      const [prefix, clientReqId] = apiData.reqID.split("_");
      const ccIdx = pgTrxData.findIndex((pgdt) => pgdt.id === clientReqId);

      const mapIdx = cwtPrefixMap.findIndex((p) => p.prefix === prefix);
      const denoms =
        typeof apiData.denom === "string"
          ? apiDenomSafeParse(apiData.denom)
          : apiData.denom;

      const cashIn = denoms.filter((d: any) => d.iscashin === "true");
      const cashOut = denoms.filter((d: any) => d.iscashin !== "true");

      if (ccIdx < 0) {
        trxMerged.push({
          seq: apiData.id.toString(),
          source: "api",
          status: apiData.status,
          clientReqId,
          trxType: mapIdx >= 0 ? cwtPrefixMap[mapIdx].reqType : "unknown",
          amount: apiData.amount,
          trxFee: null,
          cashIn: cashIn.map((d: any) => ({
            key: d.denom,
            value: Number(d.denom),
            qty: Number(d.qty),
          })),
          cashOut: cashOut.map((d: any) => ({
            key: d.denom,
            value: Number(d.denom),
            qty: Number(d.qty),
          })),
          ccwUser: `POS:${apiData.posID}`,
          posId: apiData.posID,
          remarks: "",
          createdAt: moment(apiData.dateTimeReq).toDate(),
          is_error: false,
          erp_messege: "",
        });
      } else {
        trxMerged.push({
          seq: apiData.id.toString(),
          source: "ccw",
          status: apiData.status,
          clientReqId,
          trxType: mapIdx >= 0 ? cwtPrefixMap[mapIdx].reqType : "unknown",
          amount: apiData.amount,
          trxFee: Number(pgTrxData[ccIdx].fee),
          cashIn: cashIn.map((d: any) => ({
            key: d.denom,
            value: Number(d.denom),
            qty: Number(d.qty),
          })),
          cashOut: cashOut.map((d: any) => ({
            key: d.denom,
            value: Number(d.denom),
            qty: Number(d.qty),
          })),
          ccwUser: pgTrxData[ccIdx].userName,
          posId: apiData.posID,
          remarks: pgTrxData[ccIdx].remarks || "",
          createdAt: moment(apiData.dateTimeReq).toDate(),
          is_error: false,
          erp_messege: "",
        });
      }
    }

    return trxMerged.sort((a, b) => (a.createdAt < b.createdAt ? -1 : 1));
  } catch (error) {
    console.error("[ERROR] getTrxReportByDate :", error);
    return [];
  }
}

export async function getTransactionByStatus(
  trStatus: TStatus
): Promise<ITransaction[]> {
  try {
    const trans = await db
      .select()
      .from(transaction)
      .where(eq(transaction.status, trStatus))
      .orderBy(transaction.createAt)
      .execute();

    const returnVal = trans.map((tr) => ({
      ...tr,
      amount: Number(tr.amount),
      cashIn: JSON.parse((tr.cashIn as string) || "[]"),
      cashOut: JSON.parse((tr.cashOut as string) || "[]"),
    }));
    return returnVal || [];
  } catch (err: any) {
    console.error("[ERROR]", err.message);
    return [];
  }
}
