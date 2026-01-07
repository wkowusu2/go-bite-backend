import { boolean, decimal, numeric, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const restaurants = pgTable("restaurants", {
    id: uuid().defaultRandom().primaryKey(),
    name: text().notNull().unique(),
    isOpen: boolean().default(false),
    logoUrl: text('logo_url'),
    rating: numeric({precision: 2, scale:1}).default('0.00'),
    createdAt: timestamp("created_at").defaultNow(),
})