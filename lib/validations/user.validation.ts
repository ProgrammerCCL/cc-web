import * as z from "zod";

export const CreateUserSchema = z.object({
  username: z.string().min(1, { message: "Username is required." }),
  pin: z.string().min(6, { message: "PIN must containe at least 6 digits" }),
  displayName: z.string().min(1, { message: "Display name is required." }),
  isManager: z.coerce.boolean().default(false),
  permissions: z
    .array(z.string())
    .min(1, { message: "Permission is required." }),
});
