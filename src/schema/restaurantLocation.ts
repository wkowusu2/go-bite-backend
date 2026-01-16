import { numeric, pgTable, text, uuid } from "drizzle-orm/pg-core";
import { restaurants } from "./restaurant.js";
import { geographyPoint } from "./customTypes.js";

export const restaurantLocation = pgTable('restaurant_location', {
    id: uuid().defaultRandom().primaryKey(),
    restaurantId: uuid('restaurant_id').notNull().references(() => restaurants.id, {
        onDelete: "cascade",
        onUpdate: "cascade"
    }),
    latitude: numeric({precision: 9, scale: 6}).notNull(),
    longitude: numeric({precision: 9, scale: 6}).notNull(),
    city: text(),
})