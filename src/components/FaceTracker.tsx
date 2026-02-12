// this is going to be directly in the page. Every user only needs one instance of this running

"use client";

import { useFaceTracking } from "@/src/hooks/useFaceTracking";
import { BlendshapeCategory } from "@/src/types";
import { Euler } from "three";

interface FaceTrackerProps {
  children: (data: {
    blendshapes: ReturnType<typeof useFaceTracking>["blendshapes"];
    rotation: ReturnType<typeof useFaceTracking>["rotation"];
  }) => React.ReactNode;
  onDataChange?: (blendshapes: BlendshapeCategory[], rotation: Euler) => void;
  showVideo?: boolean;
}

export default function FaceTracker({
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
