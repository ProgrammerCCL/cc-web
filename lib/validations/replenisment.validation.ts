import * as z from "zod";

export const CreateRefillSchema = z.object({
  // posId: z.string(),
  machineId: z.string(),
});

export const CancelRefillSchema = z.object({
  saleId: z.number(),
  reqId: z.string(),
  cancelRequest: z.boolean(),
});
