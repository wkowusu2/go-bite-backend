import { config } from 'dotenv';
import {defineConfig} from 'drizzle-kit';
config();

export default defineConfig({
    dialect: 'postgresql',
    out: './src/migration',
    schema:'./src/schema',
    dbCredentials:{
        url: process.env.DATABASE_URL
    }
})