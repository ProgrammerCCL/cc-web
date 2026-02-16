import * as z from "zod";

export const CreateSaleSchema = z.object({
  machineId: z.string(),
  amount: z.number(),
  remarks: z.string().optional(),
});

export const CancelSaleSchema = z.object({
  saleId: z.number(),
  reqId: z.string(),
  cancelRequest: z.boolean(),
});
