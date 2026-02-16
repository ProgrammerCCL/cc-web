import * as z from "zod";

export const PrintApiSchema = z.object({
  date: z.string(),
  totalSale: z.string(),
  totalFee: z.string(),
  totalRefill: z.string(),
  totalDeposit: z.string(),
  totalDispense: z.string(),
  totalRelease: z.string(),
  thisRelease: z.string(),
  thisRemaining: z.string(),
});
