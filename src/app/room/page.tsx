"use client";

import { useState, useCallback } from "react";
import FaceTracker from "@/src/components/FaceTracker";
import VideoGrid from "@/src/components/VideoGrid";
import { BlendshapeCategory, Participant } from "@/src/types";
import { Euler } from "three";

export default function RoomPage({
  params,
}: {
  params: Promise<{ roomId: string }>;
}) {
  // both of these state variables will be passed to VideoGrid -> VideoCard -> AvatarScene -> Avatar
  // for the first version of this, we should just pass along the local data to all the screens for a proof of concept
  const [localBlendshapes, setLocalBlendshapes] = useState<
    BlendshapeCategory[]
  >([]);
  const [localRotation, setLocalRotation] = useState<Euler>(new Euler());

  const handleFaceDataChange = useCallback(
    (blendshapes: BlendshapeCategory[], rotation: Euler) => {
      setLocalBlendshapes(blendshapes);
      setLocalRotation(rotation);
    },
    [],
  );

  const participantCount = 9;
  const testParticipant = {
    name: "test",
    url: "/models/default-avatar.glb",
    blendshapes: localBlendshapes,
    rotation: localRotation,
    isMuted: false,
    isSpeaking: false,
    isMirrored: true,
  };

  const participants: Participant[] = Array(participantCount)
    .fill(null)
    .map(() => testParticipant);

  return (
    <>
      {/* Face tracking with callback to send data */}
      <FaceTracker onDataChange={handleFaceDataChange} showVideo={false}>
        {() => null}
      </FaceTracker>

      {/* Participant grid */}
      <VideoGrid participants={participants} />
    </>
  );
}
