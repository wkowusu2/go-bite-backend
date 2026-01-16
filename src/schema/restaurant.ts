import { boolean, decimal, numeric, pgTable, text, timestamp, uuid, varchar } from "drizzle-orm/pg-core";

export const restaurants = pgTable("restaurants", {
    id: uuid().defaultRandom().primaryKey(),
    name: text().notNull().unique(),
    isOpen: boolean().default(false),
    logoUrl: text('logo_url'),
    rating: numeric({precision: 2, scale:1}).default('0.00'),
    owner: uuid(),
    email: text(),
    phone: varchar({length: 10}),
    vendorId: uuid("vendor_id"),
    password: text(),
    image: text(),
    isActive: boolean("is_active").default(false),
    createdAt: timestamp("created_at").defaultNow(),
})