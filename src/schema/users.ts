import { pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core";
import { roleEnum } from "./enums.js";


export const users = pgTable('users', { 
    id: uuid().defaultRandom().primaryKey(),
    phone: varchar('phone_number',{length: 10}).notNull().unique(),
    role: roleEnum().default("CUSTOMER"),
    createdAt: timestamp('created_at').defaultNow(),
    lastLogin: timestamp('last_login').defaultNow()
});