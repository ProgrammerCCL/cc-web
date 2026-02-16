import { z } from "zod";

export const DenomTypeSchemaRemove = z.object({
  denom: z.string().regex(/^\d+(\.\d{2})?$/, {
    message:
      "Denom must be a string representing a number with exactly two decimal points",
  }),
  qty: z.number(),
});

export const CreateRemoveSchema = z.object({
  machineId: z.string(),
  // denominations: z.array(DenomTypeSchemaRemove),
});

export const CreateRemoveCassette = z.object({
  mc: z.enum(["coin", "note"]),
});
