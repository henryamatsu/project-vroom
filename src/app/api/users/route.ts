import { NextRequest, NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import { getOrCreateUser } from "@/src/lib/db/users";
import { getDb } from "@/src/lib/db";
import { usersTable } from "@/src/lib/db/schema";
import { eq } from "drizzle-orm";

/**
 * GET /api/users/me
 * Returns the current user's profile from DB. Creates user if not found (e.g. first sign-in).
 */
export async function GET() {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const db = getDb();
    let [user] = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.clerkId, userId))
      .limit(1);

    if (!user) {
      const clerkUser = await currentUser();
      const initialName = clerkUser?.firstName ?? clerkUser?.username ?? "User";
      await getOrCreateUser(userId, initialName);
      [user] = await getDb()
        .select()
        .from(usersTable)
        .where(eq(usersTable.clerkId, userId))
        .limit(1);
    }

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error("Failed to fetch user:", error);
    return NextResponse.json(
      { error: "Failed to fetch user" },
      { status: 500 },
    );
  }
}

/**
 * PATCH /api/users/me
 * Updates the current user's display name.
 * Body: { displayName: string }
 */
export async function PATCH(request: NextRequest) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const displayName = body.displayName?.trim();

    if (!displayName || displayName.length > 255) {
      return NextResponse.json(
        { error: "displayName must be 1-255 characters" },
        { status: 400 },
      );
    }

    const db = getDb();
    const [updated] = await db
      .update(usersTable)
      .set({
        displayName,
        updatedAt: new Date(),
      })
      .where(eq(usersTable.clerkId, userId))
      .returning();

    if (!updated) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Failed to update user:", error);
    return NextResponse.json(
      { error: "Failed to update user" },
      { status: 500 },
    );
  }
}
