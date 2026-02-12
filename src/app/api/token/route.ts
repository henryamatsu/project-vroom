import { NextRequest, NextResponse } from "next/server";
import { AccessToken } from "livekit-server-sdk";

/**
 * POST /api/token
 * Generates a LiveKit access token for joining a room.
 *
 * Body (optional):
 * - room_name: string (default: "vroom-demo")
 * - participant_identity: string (default: random)
 * - participant_name: string (default: "Participant")
 *
 * Requires env: LIVEKIT_URL, LIVEKIT_API_KEY, LIVEKIT_API_SECRET
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
    const participantIdentity =
      body.participant_identity ??
      `user-${Math.random().toString(36).slice(2, 11)}`;
    const participantName = body.participant_name ?? "Participant";

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
