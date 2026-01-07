import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { users } from "./users.js";
import { orders } from "./order.js";

export const orderStatusHistory = pgTable("order_status_history", {
    id: uuid().defaultRandom().primaryKey(),
    orderId: uuid("order_id").notNull().references(() => orders.id),
    status: text().notNull(), 
    changedByUserId: uuid("changed_by_user_id").references(() => users.id),
    createdAt: timestamp('created_at').defaultNow(), 
    updatedAt: timestamp('updated_at').defaultNow()
})