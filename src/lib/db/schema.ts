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

/** Room expiration: rooms unused for this many days are considered expired */
export const ROOM_EXPIRY_DAYS = 30;

/**
 * Rooms table - stores meeting rooms with join codes.
 * Only rooms in this table can be joined. Rooms expire after ROOM_EXPIRY_DAYS of inactivity.
 */
export const roomsTable = pgTable("rooms", {
  id: uuid("id").primaryKey().defaultRandom(),
  joinCode: varchar("join_code", { length: 32 }).notNull().unique(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  lastUsedAt: timestamp("last_used_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export type Room = typeof roomsTable.$inferSelect;
export type NewRoom = typeof roomsTable.$inferInsert;
