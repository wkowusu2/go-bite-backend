import { integer, numeric, pgTable, text, uuid } from "drizzle-orm/pg-core";
import { orders } from "./order.js";
import { menuItems } from "./menuItem.js";

export const orderItems = pgTable("order_items", {
    id: uuid().defaultRandom().primaryKey(), 
    orderId: uuid('user_id').notNull().references(() => orders.id, {
        onDelete: 'restrict'
    }), 
    menuItemId: uuid('menuItem_id').notNull().references(() => menuItems.id, {
        onDelete: 'restrict'
    }),
    nameSnaphot: text("name_snaphot"),
    price_snapshot: numeric({precision: 10, scale: 2}),
    quantity: integer().notNull()
})