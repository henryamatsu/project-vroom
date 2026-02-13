"use client";

import { Track } from "livekit-client";
import { useTrackToggle, DisconnectButton } from "@livekit/components-react";
import { useRouter } from "next/navigation";

const EMOJI_OPTIONS = ["👍", "👏", "❤️", "😂", "🔥"];

interface ControlBarProps {
  onEmojiClick?: (emoji: string) => void;
}

export default function ControlBar({ onEmojiClick }: ControlBarProps) {
  const { buttonProps, enabled } = useTrackToggle({
    source: Track.Source.Microphone,
  });

  const router = useRouter();

  return (
    <div className="flex shrink-0 items-center justify-center gap-4 bg-neutral-900/95 px-6 py-3 backdrop-blur-sm">
      {/* Mute button */}
      <button
        {...buttonProps}
        className="flex h-12 w-12 items-center justify-center rounded-full bg-neutral-700 text-white transition-colors hover:bg-neutral-600 aria-pressed:bg-red-600"
        title={enabled ? "Mute" : "Unmute"}
      >
        <span className="text-xl" aria-hidden>
          {enabled ? "🎤" : "🔇"}
        </span>
      </button>

      {/* Emoji buttons */}
      <div className="flex items-center gap-2">
        {EMOJI_OPTIONS.map((emoji) => (
          <button
            key={emoji}
            type="button"
            onClick={() => onEmojiClick?.(emoji)}
            className="flex h-12 w-12 items-center justify-center rounded-full bg-neutral-700 text-2xl transition-colors hover:bg-neutral-600 hover:scale-110"
            title={`Send ${emoji}`}
          >
            {emoji}
          </button>
        ))}
      </div>

      {/* Leave call button */}
      <DisconnectButton
        className="flex h-12 w-12 items-center justify-center rounded-full bg-red-600 text-white transition-colors hover:bg-red-500"
        title="Leave call"
        onClick={() => router.push("/")}
      >
        <span className="text-xl" aria-hidden>
          📞
        </span>
      </DisconnectButton>

      {/* Settings button (placeholder) */}
      <button
        type="button"
        className="flex h-12 w-12 items-center justify-center rounded-full bg-neutral-700 text-white transition-colors hover:bg-neutral-600"
        title="Settings"
      >
        <span className="text-xl" aria-hidden>
          ⚙️
        </span>
      </button>
    </div>
  );
}
