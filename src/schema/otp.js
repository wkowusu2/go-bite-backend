import { pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core";

export const otpTable = pgTable('otp_table',{
    id: uuid().defaultRandom().primaryKey(),
    phoneNumber: varchar('phone_number', {length: 10}).notNull(),
    otp: varchar({length: 6}).notNull(),
    createdAt: timestamp('created_at').defaultNow()
});