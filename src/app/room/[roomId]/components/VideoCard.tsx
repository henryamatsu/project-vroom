"use client";

import { View } from "@react-three/drei";
import { Participant } from "@/src/types";
import { AvatarScene } from "./AvatarScene";
import { RefObject, useRef } from "react";

export function VideoCard({ participant }: { participant: Participant }) {
  const { name, isSpeaking, isMuted, displayEmoji } = participant;
  const isVideoOn = true;
  const viewRef = useRef<HTMLDivElement>(null);

  return (
    <div
      className={`relative flex aspect-video w-full items-center justify-center bg-neutral-900 text-white inset-ring ${
        isSpeaking ? `inset-ring-lime-300` : "inset-ring-slate-300"
      }`}
      ref={viewRef}
    >
      {isVideoOn ? (
        <View
          track={viewRef as RefObject<HTMLDivElement>}
          className="h-full w-full"
        >
          <AvatarScene participant={participant} />
        </View>
      ) : (
        <div className="flex flex-col items-center justify-center opacity-80">
          <div className="mb-2 flex h-14 w-14 items-center justify-center rounded-full bg-neutral-700 text-xl font-semibold">
            {name.charAt(0).toUpperCase()}
          </div>
          <span className="text-sm text-neutral-300">No video</span>
        </div>
      )}

      {displayEmoji && (
        <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center">
          <span className="animate-bounce text-6xl drop-shadow-lg">
            {displayEmoji}
          </span>
        </div>
      )}

      <div className="absolute bottom-2 left-2">
        <div className="flex items-center gap-2 rounded-md bg-black/60 px-2 py-1 backdrop-blur-sm">
          <span className="max-w-[120px] truncate text-sm font-medium">
            {name}
          </span>
          {isMuted && (
            <span className="text-red-400" title="Muted">
              🔇
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
