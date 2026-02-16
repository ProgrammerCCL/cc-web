import { TTransType } from "./transaction.type";

export interface TDateReport {
  key: string;
  iconURL: string;
  label: string;
  disable?: boolean;
  hidden?: boolean;
  transType: TTransType;
}

export interface MockupDateReport {
  transaction: number;
  amount: number;
  User_ID: string;
  status: string;
  date: string;
  time: string;
}
