import { boolean, decimal, numeric, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const restaurants = pgTable("restaurants", {
    id: uuid().defaultRandom().primaryKey(),
    name: text().notNull().unique(),
    isOpen: boolean().default(false),
    image: text(),
    rating: numeric({precision: 2, scale:1}),
    createdAt: timestamp("created_at").defaultNow(),
})