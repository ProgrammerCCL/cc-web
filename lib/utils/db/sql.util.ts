"use server";

import postgres from "postgres";

const DB_USER = process.env.DB_USER || "";
const DB_PASS = process.env.DB_PASSWORD || "";
const DB_NAME = process.env.DB_NAME || "";
const DB_HOST = process.env.DB_HOST || "";
const DB_PORT = Number(process.env.DB_PORT) || 5432;

export async function getSqlConn() {
  if (
    DB_USER.length === 0 ||
    DB_PASS.length === 0 ||
    DB_NAME.length === 0 ||
    DB_HOST.length === 0 ||
    !DB_PORT
  ) {
    throw new Error(
      "Missing required DB configuration. Check environment variables."
    );
  }

  try {
    const dbConfig = {
      host: DB_HOST,
      port: DB_PORT,
      db: DB_NAME,
      user: DB_USER,
      pass: DB_PASS,
    };

    const conn = postgres(dbConfig);

    return conn;
  } catch (err: any) {
    console.error("[ERROR] SQLDB Connection Error:", err.message);
    throw err;
  }
}
