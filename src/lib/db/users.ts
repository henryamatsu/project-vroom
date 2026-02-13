import { eq } from "drizzle-orm";
import { getDb } from "./index";
import { usersTable } from "./schema";

export async function getOrCreateUser(
  clerkId: string,
  displayName?: string,
): Promise<{ id: string; displayName: string }> {
  const db = getDb();
  const [existing] = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.clerkId, clerkId))
    .limit(1);

  if (existing) {
    return { id: existing.id, displayName: existing.displayName };
  }

  const [created] = await getDb()
    .insert(usersTable)
    .values({
      clerkId,
      displayName: displayName ?? "User",
    })
    .returning();

  if (!created) {
    throw new Error("Failed to create user");
  }

  return { id: created.id, displayName: created.displayName };
}
