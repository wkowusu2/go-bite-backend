import { boolean, pgTable, text, timestamp, uuid, varchar } from "drizzle-orm/pg-core";
import { users } from "./users.js";

export const riderProfiles = pgTable('rider_profiles', {
    id: uuid().defaultRandom().primaryKey(),
    fullName: text('fullname'),
    email: varchar({length: 255}).unique(),
    avatarUrl: text('avatar_url'),
    pushToken: text('push_token'),
    approvalStatus: boolean('approval_status').default(false),
    onlineStatus: boolean('online_status').default(false),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
    userId: uuid().notNull().references(() => users.id, {
            onDelete: 'cascade',
            onUpdate: 'cascade'
        }),
})