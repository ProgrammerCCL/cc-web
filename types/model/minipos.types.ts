// export interface IDenomination {
//   denom: string;
//   qty: string;
//   iscashin: string;
// }

import { IDenomination } from "./machine-api.types";

type TSaleStatus = "WIP" | "ERROR" | "Finished";

export interface ISaleAPIResponse {
  amount: number;
  cancel_Request: boolean;
  cashin: number | null;
  change: number | null;
  dateTimeFinish: string;
  dateTimeReq: string;
  denom: IDenomination[];
  errorURL: string | null;
  id: number;
  machineId: string;
  posId: string;
  reqId: string;
  request: string;
  status: TSaleStatus;
  statusCoin: string | null;
  statusNote: string | null;
}
