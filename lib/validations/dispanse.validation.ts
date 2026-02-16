import * as z from "zod";

const DenomTypeSchema = z.object({
  denom: z.string(),
  qty: z.number(),
});

export const CreateDispanseSchema = z.object({
  machineId: z.string(),
  amount: z.number(),
  denominations: z.array(DenomTypeSchema),
});

export const CancelDispanseSchema = z.object({
  saleId: z.number(),
  reqId: z.string(),
  cancelRequest: z.boolean(),
});
