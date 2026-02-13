import { pgTable, text, timestamp, uuid, varchar } from "drizzle-orm/pg-core";

/**
 * User table - stores account users synced from Clerk.
 * Fields align with Participant type for future customization (avatar, background, etc).
 */
export const usersTable = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  clerkId: varchar("clerk_id", { length: 255 }).notNull().unique(),
  displayName: varchar("display_name", { length: 255 })
    .notNull()
    .default("User"),
  avatarUrl: text("avatar_url"),
  avatarModelUrl: text("avatar_model_url"),
  backgroundUrl: text("background_url"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export type User = typeof usersTable.$inferSelect;
export type NewUser = typeof usersTable.$inferInsert;
