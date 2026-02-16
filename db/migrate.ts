import { migrate } from 'drizzle-orm/postgres-js/migrator';
import { db, connection } from '@/db';
import env from '@/env';
import config from "@/drizzle.config"

if (!env.DB_MIGRATING === true) {
    throw new Error('You must set DB_MIGRATING to "true" when running migrations');
}

const StartMigation = async () => {
    try {
        await migrate(db, { migrationsFolder: config.out! });
        console.log("[INFO] Migration completed successfull");
    } catch (error) {
        console.log("[INFO] Migration fialed", error);
    } finally {
        await connection.end();
    }
}

StartMigation();
