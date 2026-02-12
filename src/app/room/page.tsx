"use client";

import { LiveKitRoom } from "@livekit/components-react";
import RoomContent from "@/src/components/RoomContent";
import LiveKitConnectionError from "@/src/components/LiveKitConnectionError";
import LiveKitConnecting from "@/src/components/LiveKitConnecting";
import { useLiveKitToken } from "@/src/hooks/useLiveKitToken";

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
      audio={false}
      video={false}
      className="h-screen w-screen"
    >
      <RoomContent />
    </LiveKitRoom>
  );
}
