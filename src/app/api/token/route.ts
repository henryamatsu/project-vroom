import { NextRequest, NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import { AccessToken } from "livekit-server-sdk";
import { getOrCreateUser } from "@/src/lib/db/users";

/**
 * POST /api/token
 * Generates a LiveKit access token for joining a room.
 *
 * Body:
 * - room_name: string (required)
 * - participant_name: string (for guests; default "Guest". For account users, overrides DB display name)
 * - is_guest: boolean (if true, join as guest; if false and signed in, join as account user)
 *
 * Account users: identity = clerkId, name from DB (or override)
 * Guest users: identity = guest-{random}, name from body or "Guest"
 */
export async function POST(request: NextRequest) {
  const url = process.env.LIVEKIT_URL;
  const apiKey = process.env.LIVEKIT_API_KEY;
  const apiSecret = process.env.LIVEKIT_API_SECRET;

  if (!url || !apiKey || !apiSecret) {
    return NextResponse.json(
      {
        error:
          "LiveKit credentials not configured. Set LIVEKIT_URL, LIVEKIT_API_KEY, LIVEKIT_API_SECRET",
      },
      { status: 500 }
    );
  }

  try {
    const body = await request.json().catch(() => ({}));
    const roomName = body.room_name ?? "vroom-demo";
    const isGuest = body.is_guest === true;
    const nameOverride = body.participant_name?.trim();

    let participantIdentity: string;
    let participantName: string;

    if (isGuest) {
      participantIdentity = `guest-${Math.random().toString(36).slice(2, 15)}`;
      participantName = nameOverride ?? "Guest";
    } else {
      const { userId } = await auth();
      if (!userId) {
        return NextResponse.json(
          { error: "Must be signed in to join as account user, or use is_guest: true" },
          { status: 401 }
        );
      }

      const clerkUser = await currentUser();
      const initialName =
        clerkUser?.firstName ?? clerkUser?.username ?? "User";

      const user = await getOrCreateUser(userId, initialName);
      participantIdentity = userId;
      participantName = nameOverride ?? user.displayName;
    }

    const at = new AccessToken(apiKey, apiSecret, {
      identity: participantIdentity,
      name: participantName,
      ttl: "10m",
    });

    at.addGrant({ roomJoin: true, room: roomName });

    const participantToken = await at.toJwt();

    return NextResponse.json({
      server_url: url,
      participant_token: participantToken,
    });
  } catch (error) {
    console.error("Token generation failed:", error);
    return NextResponse.json(
      { error: "Failed to generate token" },
      { status: 500 }
    );
  }
}
