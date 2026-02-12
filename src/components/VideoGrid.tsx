"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import ParticipantTile from "./ParticipantTile";
import { Participant } from "../types";
import { Canvas } from "@react-three/fiber";
import { View } from "@react-three/drei";
import { AvatarScene } from "./AvatarScene";

const ASPECT_RATIO = 16 / 9;

interface Layout {
  cols: number;
  rows: number;
  tileWidth: number;
  tileHeight: number;
}

/**
 * Compute the optimal grid layout (cols, rows, tile size)
 * to fit `count` tiles of aspect ratio 16:9 inside the container.
 */
function computeLayout(
  containerWidth: number,
  containerHeight: number,
  count: number,
): Layout {
  let bestCols = 1;
  let bestRows = count;
  let bestTileWidth = 0;
  let bestTileHeight = 0;

  for (let cols = 1; cols <= count; cols++) {
    const rows = Math.ceil(count / cols);

    const tileWidth = containerWidth / cols;
    const tileHeight = containerHeight / rows;

    // Adjust to maintain aspect ratio
    const widthBasedHeight = tileWidth / ASPECT_RATIO;
    const heightBasedWidth = tileHeight * ASPECT_RATIO;

    let finalTileWidth: number;
    let finalTileHeight: number;

    if (widthBasedHeight <= tileHeight) {
      // Width-limited
      finalTileWidth = tileWidth;
      finalTileHeight = widthBasedHeight;
    } else {
      // Height-limited
      finalTileWidth = heightBasedWidth;
      finalTileHeight = tileHeight;
    }

    if (finalTileWidth > bestTileWidth) {
      bestTileWidth = finalTileWidth;
      bestTileHeight = finalTileHeight;
      bestCols = cols;
      bestRows = rows;
    }
  }

  return {
    cols: bestCols,
    rows: bestRows,
    tileWidth: bestTileWidth,
    tileHeight: bestTileHeight,
  };
}

export default function VideoGrid({
  participants,
}: {
  participants: Participant[];
}) {
  const count = participants.length;
  const containerRef = useRef<HTMLDivElement>(null);
  const [layout, setLayout] = useState<Layout>({
    cols: 1,
    rows: count,
    tileWidth: 0,
    tileHeight: 0,
  });

  const recalculate = useCallback(() => {
    const container = containerRef.current;
    if (!container || count === 0) return;
    const { width, height } = container.getBoundingClientRect();
    setLayout(computeLayout(width, height, count));
  }, [count]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    recalculate();

    const observer = new ResizeObserver(() => recalculate());
    observer.observe(container);
    return () => observer.disconnect();
  }, [recalculate]);

  return (
    <div ref={containerRef} className="h-full w-full relative">
      <div
        id="grid"
        className="h-full w-full mx-auto grid justify-center absolute top-0"
        style={{
          gridTemplateColumns: `repeat(${layout.cols}, ${layout.tileWidth}px)`,
          gridAutoRows: `${layout.tileHeight}px`,
        }}
      >
        {participants.map((participant) => (
          <ParticipantTile
            key={participant.id}
            participant={participant}
            liveKitParticipant={participant.liveKitParticipant}
          />
        ))}
      </div>
      <Canvas
        camera={{ fov: 25 }}
        shadows
        gl={{
          antialias: true,
          alpha: false,
        }}
        onCreated={({ gl }) => {
          // Handle WebGL context loss
          gl.domElement.addEventListener("webglcontextlost", (event) => {
            event.preventDefault();
            console.warn("WebGL context lost, attempting to restore...");
          });

          gl.domElement.addEventListener("webglcontextrestored", () => {
            console.log("WebGL context restored");
          });
        }}
      >
        <View.Port></View.Port>
      </Canvas>
    </div>
  );
}
