import * as z from "zod";

export const LoginFormSchema = z.object({
  username: z.string().min(1, { message: "Usesrname is required" }),
  pin: z.string().min(1, { message: "Password is required" }),
});
