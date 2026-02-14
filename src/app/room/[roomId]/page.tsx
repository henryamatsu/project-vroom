"use client";

import { useParams, useSearchParams } from "next/navigation";
import { LiveKitRoom } from "@livekit/components-react";
import { RoomContent } from "./_components/RoomContent";
import { LiveKitConnectionError } from "./_components/LiveKitConnectionError";
import { LiveKitConnecting } from "./_components/LiveKitConnecting";
import { useLiveKitToken } from "@/src/hooks/useLiveKitToken";

const START_MUTED = false;

function RoomPageInner() {
  const params = useParams();
  const searchParams = useSearchParams();
  const roomId = (params.roomId as string) ?? "vroom-demo";
  const isGuest = searchParams.get("guest") === "true";
  const guestName = searchParams.get("name")
    ? decodeURIComponent(searchParams.get("name")!)
    : "Guest";

  const { token, error, isLoading } = useLiveKitToken({
    roomName: roomId,
    participantName: isGuest ? guestName : undefined,
    isGuest,
  });

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
      <RoomContent startMuted={START_MUTED} isGuest={isGuest} />
    </LiveKitRoom>
  );
}

export default function RoomPage() {
  return <RoomPageInner />;
}
