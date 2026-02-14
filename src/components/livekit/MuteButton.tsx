"use client";

import { Track } from "livekit-client";
import { useTrackToggle } from "@livekit/components-react";
import { IconButton } from "@/src/components/ui/IconButton";

export function MuteButton() {
  const { buttonProps, enabled } = useTrackToggle({
    source: Track.Source.Microphone,
  });

  return (
    <IconButton
      {...buttonProps}
      aria-label={enabled ? "Mute microphone" : "Unmute microphone"}
      className="aria-pressed:bg-red-600"
    >
      <span className="text-xl" aria-hidden>
        {enabled ? "🎤" : "🔇"}
      </span>
    </IconButton>
  );
}
