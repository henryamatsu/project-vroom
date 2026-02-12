"use client";

import { useState, useCallback } from "react";
import { LiveKitRoom } from "@livekit/components-react";
import { BlendshapeCategory, Participant } from "@/src/types";
import { Euler } from "three";
import RoomContent from "@/src/components/RoomContent";
import LiveKitConnectionError from "@/src/components/LiveKitConnectionError";
import LiveKitConnecting from "@/src/components/LiveKitConnecting";
import { useLiveKitToken } from "@/src/hooks/useLiveKitToken";

const PARTICIPANT_COUNT = 9;

export default function RoomPage() {
  const { token, error, isLoading } = useLiveKitToken();
  const [localBlendshapes, setLocalBlendshapes] = useState<BlendshapeCategory[]>(
    []
  );
  const [localRotation, setLocalRotation] = useState<Euler>(new Euler());

  const handleFaceDataChange = useCallback(
    (blendshapes: BlendshapeCategory[], rotation: Euler) => {
      setLocalBlendshapes(blendshapes);
      setLocalRotation(rotation);
    },
    []
  );

  const testParticipant: Participant = {
    name: "test",
    url: "/models/default-avatar.glb",
    blendshapes: localBlendshapes,
    rotation: localRotation,
    isMuted: false,
    isSpeaking: false,
    isMirrored: true,
  };

  const participants: Participant[] = Array(PARTICIPANT_COUNT)
    .fill(null)
    .map(() => testParticipant);

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
      <RoomContent
        onFaceDataChange={handleFaceDataChange}
        participants={participants}
      />
    </LiveKitRoom>
  );
}
