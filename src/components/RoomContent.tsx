"use client";

import { useState, useCallback, useMemo } from "react";
import FaceTracker from "@/src/components/FaceTracker";
import VideoGrid from "@/src/components/VideoGrid";
import LiveKitStatusPanel from "@/src/components/LiveKitStatusPanel";
import { BlendshapeCategory, Participant } from "@/src/types";
import { Euler } from "three";
import {
  useDataChannel,
  useConnectionState,
  useParticipants,
} from "@livekit/components-react";
import type { ReceivedDataMessage } from "@livekit/components-core";
import {
  FACE_TRACKING_TOPIC,
  serializeFaceData,
  payloadToEuler,
  DEFAULT_AVATAR_URL,
  type FaceTrackingPayload,
} from "@/src/lib/livekit";

/**
 * Inner room content - must be inside LiveKitRoom for useDataChannel.
 * Builds participants from LiveKit room state + face data. Local user is always first and mirrored.
 */
export default function RoomContent() {
  const connectionState = useConnectionState();
  const liveKitParticipants = useParticipants();

  const [localBlendshapes, setLocalBlendshapes] = useState<
    BlendshapeCategory[]
  >([]);
  const [localRotation, setLocalRotation] = useState<Euler>(new Euler());
  const [remoteFaceData, setRemoteFaceData] = useState<
    Map<string, FaceTrackingPayload>
  >(new Map());
  const [receivedFrom, setReceivedFrom] = useState<string[]>([]);
  const [lastReceived, setLastReceived] = useState<FaceTrackingPayload | null>(
    null,
  );

  const { send } = useDataChannel(
    FACE_TRACKING_TOPIC,
    useCallback((msg: ReceivedDataMessage<typeof FACE_TRACKING_TOPIC>) => {
      try {
        const decoded = new TextDecoder().decode(msg.payload);
        const payload = JSON.parse(decoded) as FaceTrackingPayload;
        const identity = msg.from?.identity ?? "unknown";

        setLastReceived(payload);
        setReceivedFrom((prev) =>
          prev.includes(identity) ? prev : [...prev, identity],
        );
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

      return {
        id: identity,
        name,
        url: DEFAULT_AVATAR_URL,
        blendshapes,
        rotation,
        isMuted: false,
        isSpeaking: false,
        isMirrored: isLocal,
      };
    });
  }, [liveKitParticipants, localBlendshapes, localRotation, remoteFaceData]);

  return (
    <>
      {/* <LiveKitStatusPanel
        connectionState={connectionState}
        receivedFrom={receivedFrom}
        lastReceived={lastReceived}
      /> */}

      <FaceTracker onDataChange={handleFaceDataChange} showVideo={false}>
        {() => null}
      </FaceTracker>

      <VideoGrid participants={participants} />
    </>
  );
}
