"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import VideoCard from "./VideoCard";

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

export default function VideoGrid({ count }: { count: number }) {
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
    <div ref={containerRef} className="h-full w-full">
      <div
        className="mx-auto grid justify-center align-center"
        style={{
          gridTemplateColumns: `repeat(${layout.cols}, ${layout.tileWidth}px)`,
          gridAutoRows: `${layout.tileHeight}px`,
        }}
      >
        {Array.from({ length: count }, (_, i) => (
          <VideoCard name={"test"} isMuted={false} isSpeaking={false} key={i} />
        ))}
      </div>
    </div>
  );
}
