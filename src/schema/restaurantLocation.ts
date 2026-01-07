import { pgTable, text, uuid } from "drizzle-orm/pg-core";
import { restaurants } from "./restaurant.js";
import { geographyPoint } from "./customTypes.js";

export const restaurantLocation = pgTable('restaurant_location', {
    id: uuid().defaultRandom().primaryKey(),
    restaurantId: uuid('restaurant_id').notNull().references(() => restaurants.id, {
        onDelete: "cascade",
        onUpdate: "cascade"
    }), 
    location: geographyPoint("location").notNull(),
    city: text(),
})