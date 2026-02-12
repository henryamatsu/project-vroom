"use client";

import { useState, useCallback, useEffect } from "react";
import FaceTracker from "@/src/components/FaceTracker";
import VideoGrid from "@/src/components/VideoGrid";
import { BlendshapeCategory, Participant } from "@/src/types";
import { Euler } from "three";
import {
  LiveKitRoom,
  useDataChannel,
  useConnectionState,
} from "@livekit/components-react";
import type { ReceivedDataMessage } from "@livekit/components-core";

const FACE_TRACKING_TOPIC = "face-tracking" as const;
const ROOM_NAME = "vroom-demo";

export interface FaceTrackingPayload {
  blendshapes: BlendshapeCategory[];
  rotation: { x: number; y: number; z: number };
}

function serializeFaceData(
  blendshapes: BlendshapeCategory[],
  rotation: Euler
): FaceTrackingPayload {
  return {
    blendshapes,
    rotation: { x: rotation.x, y: rotation.y, z: rotation.z },
  };
}

/**
 * Inner room content - must be inside LiveKitRoom for useDataChannel
 */
function RoomContent({
  onFaceDataChange,
  participants,
}: {
  onFaceDataChange: (blendshapes: BlendshapeCategory[], rotation: Euler) => void;
  participants: Participant[];
}) {
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
      {/* LiveKit proof-of-concept indicator */}
      <div
        className="fixed top-4 right-4 z-50 bg-black/80 text-white px-4 py-2 rounded-lg text-sm font-mono min-w-[200px]"
        data-testid="livekit-status"
      >
        <div>LiveKit: {connectionState}</div>
        {receivedFrom.length > 0 && (
          <div className="mt-1 text-green-400">
            Receiving from: {receivedFrom.join(", ")}
          </div>
        )}
        {lastReceived && (
          <div className="mt-1 text-gray-400 text-xs truncate">
            Last: rotation x={lastReceived.rotation.x.toFixed(2)} y=
            {lastReceived.rotation.y.toFixed(2)} z={lastReceived.rotation.z.toFixed(2)}
          </div>
        )}
      </div>

      <FaceTracker onDataChange={handleFaceDataChange} showVideo={false}>
        {() => null}
      </FaceTracker>

      <VideoGrid participants={participants} />
    </>
  );
}

export default function RoomPage() {
  const [localBlendshapes, setLocalBlendshapes] = useState<BlendshapeCategory[]>(
    []
  );
  const [localRotation, setLocalRotation] = useState<Euler>(new Euler());
  const [token, setToken] = useState<{
    serverUrl: string;
    participantToken: string;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFaceDataChange = useCallback(
    (blendshapes: BlendshapeCategory[], rotation: Euler) => {
      setLocalBlendshapes(blendshapes);
      setLocalRotation(rotation);
    },
    []
  );

  useEffect(() => {
    let cancelled = false;

    async function fetchToken() {
      try {
        const res = await fetch("/api/token", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ room_name: ROOM_NAME }),
        });

        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          throw new Error(err.error ?? `Token request failed: ${res.status}`);
        }

        const data = await res.json();
        if (!cancelled) {
          setToken({
            serverUrl: data.server_url,
            participantToken: data.participant_token,
          });
        }
      } catch (e) {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : "Failed to get token");
        }
      }
    }

    fetchToken();
    return () => {
      cancelled = true;
    };
  }, []);

  const participantCount = 9;
  const testParticipant: Participant = {
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

  if (error) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-900 text-white p-8">
        <div className="max-w-md text-center">
          <h2 className="text-xl font-semibold mb-2">LiveKit connection failed</h2>
          <p className="text-gray-400 mb-4">{error}</p>
          <p className="text-sm text-gray-500">
            Set LIVEKIT_URL, LIVEKIT_API_KEY, LIVEKIT_API_SECRET in .env.local.
            Get credentials from{" "}
            <a
              href="https://cloud.livekit.io"
              className="text-blue-400 hover:underline"
            >
              LiveKit Cloud
            </a>
            .
          </p>
        </div>
      </div>
    );
  }

  if (!token) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-900 text-white">
        <div>Connecting to LiveKit...</div>
      </div>
    );
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
