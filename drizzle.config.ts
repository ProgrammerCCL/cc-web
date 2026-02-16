import { defineConfig } from 'drizzle-kit'
import env from '@/env';

export default defineConfig({
    schema: "./db/schema/index.ts",
    out: "./db/migrations",
    dialect: "postgresql",
    dbCredentials: {
        url: env.KIT_DB_URI,
    },
    verbose: true,
    strict: true,

});