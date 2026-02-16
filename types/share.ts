import { TTransType } from "./model/transaction.type";

export interface ReportBarItem {
  key: string;
  imgURL: string;
  route: string;
  en: string;
  th: string;
  disable: boolean;
}

export interface INavbarItem {
  key: string;
  imgURL: string;
  route: string;
  en: string;
  th: string;
  sub?: ReportBarItem[];
  disable: boolean;
  permission: string;
  adminMain?: boolean;
  isDanger?: boolean;
}

export interface ISumaryReport {
  total: number;
  transType: TTransType;
}

export interface UserToken {
  id: string;
  name: string;
}

export interface IDataForReport {
  id: string;
  machineId: string;
  amount: number;
  createdAt: Date;
  denom: string;
  qty: number;
  iscashin: string;
}

export interface IPrintReportData {
  date: string; // YYYY-MM-DD
  totalSale: string;
  totalFee: string;
  totalRefill: string;
  totalDeposit: string;
  totalDispense: string;
  totalRelease: string;
  thisRelease: string;
  thisRemaining: string;
}

export type TStatusPageCJ =
  | "standby"
  | "start"
  | "remark"
  | "wip"
  | "end"
  | "confrim"
  | "fetch"
  | "warning"
  | "finished"
  | "canceled"
  | "error";
