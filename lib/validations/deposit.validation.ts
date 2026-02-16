import * as z from "zod";

export const CreateDepositSchema = z.object({
  remarks: z.string(),
  machineId: z.string(),
});

export const CancelDepositSchema = z.object({
  saleId: z.number(),
  reqId: z.string(),
  cancelRequest: z.boolean(),
});
