import { config } from "dotenv";
import { expand } from "dotenv-expand";
import * as z from "zod";
import { ZodError } from "zod";

// ลบ \ จากตัวแปร  ก่อนที่จะตรวจสอบผ่าน Zod
const envVars = [
  "WM_USER_CHECK",
  "WM_PASS_CHECK",
  "WM_USER_SEND",
  "WM_PASS_SEND",
];

// วนลูปและทำการแทนที่เครื่องหมาย \ ในค่าของตัวแปรแต่ละตัว
envVars.forEach((key) => {
  if (process.env[key]) {
    process.env[key] = process.env[key]
      .replace(/\\#/g, "") // แทนที่ \# ด้วย #
      .replace(/\\\$/g, ""); // แทนที่ \$ ด้วย $
  }
});

const EnvSchema = z.object({
  // DB_NAME: z.string(),
  // DB_USER: z.string(),
  // DB_PASSWORD: z.string(),
  // DB_PORT: z.string(),
  // DB_HOST: z.string(),
  DB_URI: z.string(),
  KIT_DB_URI: z.string(),
  DB_MIGRATING: z.string(),
  DB_SEEDING: z.string(),
  PRINT_API_URL: z.string(),
  API_URL: z.string(),
  API_KEY: z.string(),
  API_SECRET: z.string(),
  POS_ID: z.string().optional(),
  EXC_FEE: z
    .string()
    .optional()
    .refine((val) => val === undefined || /^\d+$/.test(val), {
      message: "Invalid exchange fee.",
    }),

  // World Market
  WM_MODE: z.string(),
});

export type TEnv = z.infer<typeof EnvSchema>;

expand(config({ path: ".env.local" }));

try {
  EnvSchema.parse(process.env);
} catch (error: any) {
  if (error instanceof ZodError) {
    let message = "Missing required values in .env:\n";
    error.issues.forEach((issue) => {
      message += issue.path[0] + "\n";
    });
    const e = new Error(message);
    e.stack = "";
    throw e;
  } else {
    console.error(error);
  }
}

export default EnvSchema.parse(process.env);
