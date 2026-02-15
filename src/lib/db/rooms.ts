import { and, eq, gte } from "drizzle-orm";
import { getDb } from "./index";
import { roomsTable, ROOM_EXPIRY_DAYS } from "./schema";

/** Generate a random join code: xxxx-xxxx format (lowercase alphanumeric) */
function generateJoinCode(): string {
  const chars = "abcdefghjkmnpqrstuvwxyz23456789"; // exclude ambiguous chars
  const segment = (n: number) =>
    Array.from({ length: n }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
  return `${segment(4)}-${segment(4)}`;
}

/**
 * Create a new room. Generates a unique join code.
 */
export async function createRoom(): Promise<{ id: string; joinCode: string }> {
  const db = getDb();
  const maxAttempts = 10;

  for (let i = 0; i < maxAttempts; i++) {
    const joinCode = generateJoinCode();
    const [existing] = await db
      .select()
      .from(roomsTable)
      .where(eq(roomsTable.joinCode, joinCode))
      .limit(1);

    if (!existing) {
      const [created] = await db
        .insert(roomsTable)
        .values({ joinCode })
        .returning();

      if (!created) throw new Error("Failed to create room");
      return { id: created.id, joinCode: created.joinCode };
    }
  }

  throw new Error("Failed to generate unique join code");
}

/**
 * Get a room by join code if it exists and is not expired.
 */
export async function getRoomByJoinCode(
  joinCode: string
): Promise<{ id: string; joinCode: string } | null> {
  const normalized = joinCode.trim().toLowerCase();
  if (!normalized) return null;

  const db = getDb();
  const expiryThreshold = new Date();
  expiryThreshold.setDate(expiryThreshold.getDate() - ROOM_EXPIRY_DAYS);

  const [room] = await db
    .select()
    .from(roomsTable)
    .where(
      and(
        eq(roomsTable.joinCode, normalized),
        gte(roomsTable.lastUsedAt, expiryThreshold)
      )
    )
    .limit(1);

  return room ? { id: room.id, joinCode: room.joinCode } : null;
}

/**
 * Update lastUsedAt for a room. Call when someone joins or uses the room.
 */
export async function touchRoom(joinCode: string): Promise<boolean> {
  const normalized = joinCode.trim().toLowerCase();
  if (!normalized) return false;

  const db = getDb();
  const [updated] = await db
    .update(roomsTable)
    .set({ lastUsedAt: new Date() })
    .where(eq(roomsTable.joinCode, normalized))
    .returning();

  return !!updated;
}
