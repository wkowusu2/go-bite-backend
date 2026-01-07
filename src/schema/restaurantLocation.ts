import { customType, pgTable, text, uuid } from "drizzle-orm/pg-core";
import { restaurants } from "./restaurant.js";

const geographyPoint = customType<{ data: string }>({
  dataType() {
    return "geography(Point, 4326)";
  },
});

export const restaurantLocation = pgTable('restaurant_location', {
    id: uuid().defaultRandom().primaryKey(),
    restaurantId: uuid('restaurant_id').notNull().references(() => restaurants.id, {
        onDelete: "cascade",
        onUpdate: "cascade"
    }), 
    location: geographyPoint("location").notNull(),
    city: text(),
})