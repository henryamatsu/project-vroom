"use client";

import { useState, useCallback, useMemo, useEffect } from "react";
import FaceTracker from "@/src/components/FaceTracker";
import VideoGrid from "@/src/components/VideoGrid";
import GuestNameEditor from "@/src/components/GuestNameEditor";
import { BlendshapeCategory, Participant } from "@/src/types";
import { Euler } from "three";
import {
  useDataChannel,
  useConnectionState,
  useParticipants,
  useLocalParticipant,
  RoomAudioRenderer,
} from "@livekit/components-react";
import type { ReceivedDataMessage } from "@livekit/components-core";
import {
  FACE_TRACKING_TOPIC,
  serializeFaceData,
  payloadToEuler,
  DEFAULT_AVATAR_URL,
  type FaceTrackingPayload,
} from "@/src/lib/livekit";

interface RoomContentProps {
  /** If true, start with microphone muted. Toggle in code for testing. */
  startMuted?: boolean;
  /** If true, user joined as guest - show name editor. */
  isGuest?: boolean;
}

/**
 * Inner room content - must be inside LiveKitRoom for useDataChannel.
 * Builds participants from LiveKit room state + face data. Local user is always first and mirrored.
 */
export default function RoomContent({
  startMuted = false,
  isGuest = false,
}: RoomContentProps) {
  const connectionState = useConnectionState();
  const liveKitParticipants = useParticipants();
  const { localParticipant } = useLocalParticipant();

  useEffect(() => {
    if (connectionState === "connected" && startMuted) {
      void localParticipant.setMicrophoneEnabled(false);
    }
  }, [connectionState, startMuted, localParticipant]);

  const [localBlendshapes, setLocalBlendshapes] = useState<
    BlendshapeCategory[]
  >([]);
  const [localRotation, setLocalRotation] = useState<Euler>(new Euler());
  const [remoteFaceData, setRemoteFaceData] = useState<
    Map<string, FaceTrackingPayload>
  >(new Map());

  const { send } = useDataChannel(
    FACE_TRACKING_TOPIC,
    useCallback((msg: ReceivedDataMessage<typeof FACE_TRACKING_TOPIC>) => {
      try {
        const decoded = new TextDecoder().decode(msg.payload);
        const payload = JSON.parse(decoded) as FaceTrackingPayload;
        const identity = msg.from?.identity ?? "unknown";

        setRemoteFaceData((prev) => {
          const next = new Map(prev);
          next.set(identity, payload);
          return next;
        });
      } catch (e) {
        console.warn("Failed to decode face data:", e);
      }
    }, []),
  );

  const handleFaceDataChange = useCallback(
    (blendshapes: BlendshapeCategory[], rotation: Euler) => {
      setLocalBlendshapes(blendshapes);
      setLocalRotation(rotation);

      if (connectionState !== "connected") return;

      const payload = serializeFaceData(blendshapes, rotation);
      const json = JSON.stringify(payload);
      const data = new TextEncoder().encode(json);

      send(data, {
        topic: FACE_TRACKING_TOPIC,
        reliable: false,
      }).catch((err) => console.warn("Failed to send face data:", err));
    },
    [send, connectionState],
  );

  const participants: Participant[] = useMemo(() => {
    return liveKitParticipants.map((lkParticipant, index) => {
      const isLocal = index === 0;
      const identity = lkParticipant.identity;
      const name = lkParticipant.name ?? identity;

      const payload = isLocal ? null : remoteFaceData.get(identity);
      const blendshapes = isLocal
        ? localBlendshapes
        : (payload?.blendshapes ?? []);
      const rotation = isLocal
        ? localRotation
        : payload
          ? payloadToEuler(payload)
          : new Euler();

      const participant: Participant = {
        id: identity,
        name,
        url: DEFAULT_AVATAR_URL,
        blendshapes,
        rotation,
        isMuted: false,
        isSpeaking: false,
        isMirrored: isLocal,
        liveKitParticipant: lkParticipant,
      };

      return participant;
    });
  }, [liveKitParticipants, localBlendshapes, localRotation, remoteFaceData]);

  const handleGuestNameChange = useCallback(
    (name: string) => {
      void localParticipant.setName(name);
    },
    [localParticipant]
  );

  const showNameEditor = isGuest;

  return (
    <>
      <RoomAudioRenderer />

      {showNameEditor && (
        <div className="fixed top-4 left-4 z-50 flex items-center gap-2 rounded-lg bg-black/80 px-3 py-2 text-white text-sm">
          <span className="text-gray-400">Your name:</span>
          <GuestNameEditor
            currentName={localParticipant.name ?? "Guest"}
            onNameChange={handleGuestNameChange}
          />
        </div>
      )}

      <FaceTracker onDataChange={handleFaceDataChange} showVideo={false}>
        {() => null}
      </FaceTracker>

      <VideoGrid participants={participants} />
    </>
  );
}
