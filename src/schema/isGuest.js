import { boolean, pgTable, timestamp, uuid } from "drizzle-orm/pg-core";
import { users } from "./users.js";

export const isUserGuest = pgTable('is_user_guest', {
    id: uuid().defaultRandom().primaryKey(),
    userId: uuid('user_id').references(() => users.id, {
        onDelete: "cascade",
        onUpdate: 'cascade'
    }).notNull(),
    isGuest: boolean('is_guest').default(false),
    createdAt: timestamp('create_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
})