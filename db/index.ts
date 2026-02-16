import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "@/db/schema";
import env from "@/env";

export const connection = postgres(env.KIT_DB_URI, {
    max: 10,
    idle_timeout: 30,
    connect_timeout: 10,
})

export const db = drizzle(connection, {
    schema,
    logger: true,
})

export type Database = typeof db;
export default db;