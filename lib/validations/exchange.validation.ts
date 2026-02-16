import * as z from "zod";

const DenomTypeSchema = z.object({
  denom: z.string(),
  qty: z.number(),
});

export const CreateExchangeSaleSchema = z.object({
  // posId: z.string(),
  machineId: z.string(),
  amount: z.number(),
  denominations: z.array(DenomTypeSchema),
});

export const CreateExchangeDispenseSchema = z.object({
  transId: z.string(),
  // posId: z.string(),
  machineId: z.string(),
  amount: z.number(),
  denominations: z.array(DenomTypeSchema),
});
