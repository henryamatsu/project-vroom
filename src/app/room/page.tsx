"use client";

import { LiveKitRoom } from "@livekit/components-react";
import RoomContent from "@/src/components/RoomContent";
import LiveKitConnectionError from "@/src/components/LiveKitConnectionError";
import LiveKitConnecting from "@/src/components/LiveKitConnecting";
import { useLiveKitToken } from "@/src/hooks/useLiveKitToken";

/**
 * Set to true to start muted. Toggle this in code for testing until a mute button is added.
 */
const START_MUTED = false;

export default function RoomPage() {
  const { token, error, isLoading } = useLiveKitToken();

  if (error) {
    return <LiveKitConnectionError error={error} />;
  }

  if (isLoading || !token) {
    return <LiveKitConnecting />;
  }

  return (
    <LiveKitRoom
      serverUrl={token.serverUrl}
      token={token.participantToken}
      connect={true}
      audio={true}
      video={false}
      className="h-screen w-screen"
    >
      <RoomContent startMuted={START_MUTED} />
    </LiveKitRoom>
  );
}
