"use client";

import type { FaceTrackingPayload } from "@/src/lib/livekit";

interface LiveKitStatusPanelProps {
  connectionState: string;
  receivedFrom: string[];
  lastReceived: FaceTrackingPayload | null;
}

export default function LiveKitStatusPanel({
  connectionState,
  receivedFrom,
  lastReceived,
}: LiveKitStatusPanelProps) {
  return (
    <div
      className="fixed top-4 right-4 z-50 bg-black/80 text-white px-4 py-2 rounded-lg text-sm font-mono w-[200px]"
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
          {lastReceived.rotation.y.toFixed(2)} z=
          {lastReceived.rotation.z.toFixed(2)}
        </div>
      )}
    </div>
  );
}
