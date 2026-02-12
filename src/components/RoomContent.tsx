"use client";

import { useState, useCallback } from "react";
import FaceTracker from "@/src/components/FaceTracker";
import VideoGrid from "@/src/components/VideoGrid";
import LiveKitStatusPanel from "@/src/components/LiveKitStatusPanel";
import { BlendshapeCategory, Participant } from "@/src/types";
import { Euler } from "three";
import {
  useDataChannel,
  useConnectionState,
} from "@livekit/components-react";
import type { ReceivedDataMessage } from "@livekit/components-core";
import {
  FACE_TRACKING_TOPIC,
  serializeFaceData,
  type FaceTrackingPayload,
} from "@/src/lib/livekit";

interface RoomContentProps {
  onFaceDataChange: (blendshapes: BlendshapeCategory[], rotation: Euler) => void;
  participants: Participant[];
}

/**
 * Inner room content - must be inside LiveKitRoom for useDataChannel.
 * Handles face tracking, data channel publish/subscribe, and the status panel.
 */
export default function RoomContent({
  onFaceDataChange,
  participants,
}: RoomContentProps) {
  const connectionState = useConnectionState();
  const [receivedFrom, setReceivedFrom] = useState<string[]>([]);
  const [lastReceived, setLastReceived] = useState<FaceTrackingPayload | null>(
    null
  );

  const { send } = useDataChannel(
    FACE_TRACKING_TOPIC,
    useCallback((msg: ReceivedDataMessage<typeof FACE_TRACKING_TOPIC>) => {
      try {
        const decoded = new TextDecoder().decode(msg.payload);
        const payload = JSON.parse(decoded) as FaceTrackingPayload;
        setLastReceived(payload);
        const identity = msg.from?.identity ?? "unknown";
        setReceivedFrom((prev) =>
          prev.includes(identity) ? prev : [...prev, identity]
        );
      } catch (e) {
        console.warn("Failed to decode face data:", e);
      }
    }, [])
  );

  const handleFaceDataChange = useCallback(
    (blendshapes: BlendshapeCategory[], rotation: Euler) => {
      onFaceDataChange(blendshapes, rotation);

      if (connectionState !== "connected") return;

      const payload = serializeFaceData(blendshapes, rotation);
      const json = JSON.stringify(payload);
      const data = new TextEncoder().encode(json);

      send(data, {
        topic: FACE_TRACKING_TOPIC,
        reliable: false,
      }).catch((err) => console.warn("Failed to send face data:", err));
    },
    [onFaceDataChange, send, connectionState]
  );

  return (
    <>
      <LiveKitStatusPanel
        connectionState={connectionState}
        receivedFrom={receivedFrom}
        lastReceived={lastReceived}
      />

      <FaceTracker onDataChange={handleFaceDataChange} showVideo={false}>
        {() => null}
      </FaceTracker>

      <VideoGrid participants={participants} />
    </>
  );
}
