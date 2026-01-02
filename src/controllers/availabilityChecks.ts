import { sql } from "drizzle-orm"
import { getDb } from "../config/db.config.js"
import { Request, Response } from "express"

export const home = (req: Request, res: Response) => {
    return res.json("Welcome to the custom backend for goBite")
}

export const health = (req: Request, res: Response) => {
    return res.json("Server is up and running successfully")
}

export const pingDb = async (req: Request, res: Response) => {
   try {
    const db = getDb(); 
    await db.execute(sql`SELECT 1`);
    console.log("Db ping successful"); 
    return res.status(200).send('DB ping successful')
   } catch (error) {
    console.log("Error from db ping: ", error)
    return res.status(500).send('Error poking DB');
   }
}