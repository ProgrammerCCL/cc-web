export interface IBathItem {
  key: string;
  label: string;
  imgURL: string;
  stock?: number;
  needed?: number;
  cash?: number;
  disable?: boolean;
  hidden?: boolean;
  isNote?: boolean;
}

export interface IDispenseItem {
  label: string;
  denomination: string;
  imgURL: string;
  inStacker?: number;
  qty?: number;
  value?: number;
}