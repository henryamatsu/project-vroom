"use client";

import { useFaceTracking } from "@/src/hooks/useFaceTracking";
import { BlendshapeCategory } from "@/src/types";
import { Euler } from "three";

interface FaceTrackerProps {
  children: (data: {
    blendshapes: BlendshapeCategory[];
    rotation: Euler;
  }) => React.ReactNode;
  onDataChange?: (blendshapes: BlendshapeCategory[], rotation: Euler) => void;
  showVideo?: boolean;
}

export function FaceTracker({
  children,
  onDataChange,
  showVideo = false,
}: FaceTrackerProps) {
  const { blendshapes, rotation, videoRef } = useFaceTracking({ onDataChange });

  return (
    <>
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className={showVideo ? "face-tracker-video" : "hidden"}
        style={showVideo ? {} : { display: "none" }}
      />
      {children({ blendshapes, rotation })}
    </>
  );
}
