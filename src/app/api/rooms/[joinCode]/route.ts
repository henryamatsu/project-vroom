import { NextRequest, NextResponse } from "next/server";
import { getRoomByJoinCode } from "@/src/lib/db/rooms";

/**
 * GET /api/rooms/[joinCode]
 * Check if a room exists and is not expired.
 */
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ joinCode: string }> }
) {
  const { joinCode } = await params;
  if (!joinCode) {
    return NextResponse.json({ error: "Join code required" }, { status: 400 });
  }

  const room = await getRoomByJoinCode(joinCode);
  if (!room) {
    return NextResponse.json(
      { error: "Room not found or expired" },
      { status: 404 }
    );
  }

  return NextResponse.json({ joinCode: room.joinCode });
}
