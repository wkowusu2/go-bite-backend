import { boolean, pgTable, text, timestamp, uuid, } from "drizzle-orm/pg-core";
import { users } from "./users.js";

export const refreshToken = pgTable('refresh_toke', {
    id: uuid().defaultRandom().primaryKey(),
    userId: uuid('user_id').notNull().references(() => users.id, {
        onDelete:"cascade",
        onUpdate: 'cascade'
    }),
    refreshToken: text('refresh_token').notNull(),
    expiresAt: timestamp("expires_at").notNull(),
    createdAt: timestamp("created_at").defaultNow(),
    lastUsedAt: timestamp("last_used_at"),
    revoked: boolean("revoked").default(false),
    revokedAt: timestamp("revoked_at"),
})

