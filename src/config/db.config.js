import { config } from "dotenv";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    max: 10,
    min: 2,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis:20000,
    keepAlive: true,
    ssl: { rejectUnauthorized: false },
})

export const dbConnect = async () => {
    const client = await pool.connect();
  try {
    await client.query("SELECT 1") ;       
    console.log("Database connected ✔");
    client.release();
  }
  catch (err) {
    console.error("Database connection failed (startup). Retrying...");
  }
}

export async function closeDb() {
  console.log("Closing DB pool...")
  await pool.end()
  console.log("Pool closed.")
}

export function getDb(){
    const db = drizzle(pool);
    return db;
}