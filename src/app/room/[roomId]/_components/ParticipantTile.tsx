"use client";

import { useMemo } from "react";
import { useIsMuted, useIsSpeaking } from "@livekit/components-react";
import { Track } from "livekit-client";
import type { Participant as LiveKitParticipant } from "livekit-client";
import { VideoCard } from "./VideoCard";
import { Participant } from "@/src/types";

interface ParticipantTileProps {
  participant: Participant;
  liveKitParticipant: LiveKitParticipant;
}

export function ParticipantTile({
  participant,
  liveKitParticipant,
}: ParticipantTileProps) {
  const micTrackRef = useMemo(
    () => ({
      participant: liveKitParticipant,
      source: Track.Source.Microphone,
    }),
    [liveKitParticipant]
  );
  const isMuted = useIsMuted(micTrackRef);
  const isSpeaking = useIsSpeaking(liveKitParticipant);

  const participantWithMediaState: Participant = {
    ...participant,
    isMuted,
    isSpeaking,
  };

  return <VideoCard participant={participantWithMediaState} />;
}
