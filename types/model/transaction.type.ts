import { IDenomQty } from "../withdraw";
import { IDenomination } from "./machine-api.types";

export interface IDetail {
  denom: string;
  qty: string;
  iscashin: string;
}

export type TStatus = "wip" | "finish" | "error" | "cancel";

export type TTransType =
  | "sale"
  | "refill"
  | "dispense"
  | "deposit"
  | "exchange"
  | "endofday";

export interface ITransaction {
  id: string;
  userId?: string | null;
  userName?: string;
  type: TTransType | unknown;
  cashIn: IDetail[];
  cashOut: IDetail[];
  amount: number;
  createAt: Date;
  status: TStatus;
  source?: string;
}

export interface IDetailAPI {
  denomination: number;
  quantity: number;
}

export interface ITransactionReport {
  apiId: string;
  clientId?: string;
  userId?: string | null;
  userName?: string | null;
  apiReqType: string;
  dispType?: TTransType;
  cashIn: IDenomination[];
  cashOut: IDenomination[];
  amount: number;
  createdAt?: Date;
  aipStatus: string;
  source: "Office" | "API";
}

export type TApiReportType =
  | "sale"
  | "refill"
  | "dispense"
  | "exchange"
  | "endofday"
  | "buy"
  | "receive"
  | "deposit"
  | "reset"
  | "unknown";

export type TApiPrefixMap = {
  prefix: string;
  reqType: TApiReportType;
};

export interface ITrxReport {
  seq: string;
  source: "api" | "ccw";
  status: string;
  clientReqId: string;
  trxType: TApiReportType;
  amount: number;
  trxFee?: number | null;
  cashIn: IDenomQty[];
  cashOut: IDenomQty[];
  ccwUser: string;
  posId: string;
  remarks: string;
  createdAt: Date;
  is_error: boolean;
  erp_messege: string;
}
