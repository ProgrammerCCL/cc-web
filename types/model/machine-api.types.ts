export interface IDenomination {
  denom: string;
  qty: string;
  iscashin: string;
}

type IMachineApiStatus = "WIP" | "ERROR" | "CANCELED" | "Finished";

export interface IMachineApiData {
  id: number;
  reqID: string;
  clientReqID: string;
  posID: string;
  machineID: string;
  request: string;
  dateTimeReq: string;
  cancelRequest: boolean;
  amount: number;
  cashin: number | null;
  change: number | null;
  denom: IDenomination[];
  statusCoin: string | null;
  statusNote: string | null;
  errorURL: string | null;
  status: IMachineApiStatus;
  dateTimeFinish: string | null;
  syncStatus: boolean;
  printReceipt: boolean;
  invBefore: number;
  requester?: string;
  remarks?: string;
}

export interface IInventoryItem {
  denom: string;
  value: number;
  stackerMin: number | null;
  refillPoint: number;
  inventoryQty: number;
  inStacker: number;
  inCassette: number;
  label?: string;
  qty?: number;
  imgURL?: string;
  statusStacker?: number;
  statusCassette?: number;
  capStacker?: number;
  capCassette?: number;
  type?: number;
}
