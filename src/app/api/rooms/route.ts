import { NextResponse } from "next/server";
import { createRoom } from "@/src/lib/db/rooms";

/**
 * POST /api/rooms
 * Create a new room. Returns the join code for sharing.
 */
export async function POST() {
  try {
    const { joinCode } = await createRoom();
    return NextResponse.json({ joinCode });
  } catch (error) {
    console.error("Create room failed:", error);
    return NextResponse.json(
      { error: "Failed to create room" },
      { status: 500 }
    );
  }
}
