export interface IwmTrxReportView {
  id: string;
  userId: string | null;
  userName: string;
  type: "sale" | "refill" | "dispense" | "exchange" | "endofday";
  cash_in: unknown;
  cash_out: unknown;
  status: "wip" | "finish" | "cancel" | "error";
  amount: string;
  create_at: Date;
  fee: string;
  remarks: string | null;
  httpStatus: number | null;
  is_error: boolean;
  erpMessege: string | null;
  erp_detail: string | null;
}
