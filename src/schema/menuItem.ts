import { boolean, numeric, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { restaurants } from "./restaurant.js";
import { menuCategories } from "./menuCategory.js";

export const menuItems = pgTable("menu_items", {
    id: uuid().defaultRandom().primaryKey(), 
    name: text().notNull(),
    description: text(),
    price: numeric({precision: 10, scale: 2}),
    restaurantId: uuid("restaurant_id").notNull().references(() => restaurants.id, {
        onDelete: 'cascade',
        onUpdate: "cascade"
    }),
    menuCategoryId: uuid("menu_category_id").notNull().references(() =>  menuCategories.id, {
        onDelete: 'cascade',
        onUpdate: "cascade"
    }),
    isAvailable: boolean("is_available").default(false), 
    createdAt: timestamp('created_at').defaultNow()
})