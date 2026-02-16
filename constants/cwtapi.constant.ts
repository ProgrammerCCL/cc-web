import { TApiPrefixMap } from "@/types/model";

export const cwtPrefixMap = [
  {
    prefix: "SAL",
    reqType: "sale",
  },
  {
    prefix: "BUY",
    reqType: "buy",
  },
  {
    prefix: "RCV",
    reqType: "receive",
  },
  {
    prefix: "DSP",
    reqType: "dispense",
  },
  {
    prefix: "RFL",
    reqType: "refill",
  },
  {
    prefix: "DEP",
    reqType: "deposit",
  },
  {
    prefix: "RCS",
    reqType: "endofday",
  },
  {
    prefix: "RST",
    reqType: "reset",
  },
  {
    prefix: "EXC",
    reqType: "exchange",
  },
] as TApiPrefixMap[];
