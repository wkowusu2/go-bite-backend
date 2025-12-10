import { config } from "dotenv";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    max: 10,
    min: 2,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis:15000,
    keepAlive: true,
})

export const dbConnect = async () => {
    console.log("DB URL:", process.env.DATABASE_URL);
    const client = await pool.connect();
  try {
    await client.query("SELECT 1") ;       
    console.log("Database connected ✔");
  } finally {
    client.release();
  }
}

export async function closeDb() {
  console.log("Closing DB pool...")
  await pool.end()
  console.log("Pool closed.")
}

export const db = drizzle(pool);