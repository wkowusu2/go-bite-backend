import { numeric, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { users } from "./users.js";
import { restaurants } from "./restaurant.js";
import { restaurantLocation } from "./restaurantLocation.js";
import { geographyPoint } from "./customTypes.js";

export const orders = pgTable('orders', {
    id: uuid().defaultRandom().primaryKey(),
    customerId: uuid().notNull().references(() => users.id),
    restaurantId: uuid().notNull().references(() => restaurants.id, {
        onDelete: 'restrict'
    }),
    restaurantLocationId: uuid().notNull().references(() => restaurantLocation.id, {
        onDelete: 'restrict'
    }), 
    status: text().notNull(), 
    deliveryCity: text('delivery_city').notNull(), 
    deliveryLocation: geographyPoint('delivery_location').notNull(),
    subtotal: numeric({precision: 10, scale: 2}).notNull(),
    deliveryFee: numeric("delivery_fee",{precision: 10, scale: 2}),
    total: numeric({precision: 10, scale: 2}).notNull(), 
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
    cancelledAt: timestamp('cancelled_at'),
    deliveredAt: timestamp('delivered_at')
})

