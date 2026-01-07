import { integer, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { restaurants } from "./restaurant.js";

export const menuCategories = pgTable('menu_categories', {
    id: uuid().defaultRandom().primaryKey(),
    name: text().notNull(),
    restaurantId: uuid('restaurant_id').notNull().references(() => restaurants.id,{
        onDelete: "cascade",
        onUpdate: "cascade"
    }),
    orderIndex: integer("order_index").notNull(),
    createdAt: timestamp('created_at').defaultNow()
})