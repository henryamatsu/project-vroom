"use client";

import { useState } from "react";
import { MuteButton } from "@/src/components/livekit/MuteButton";
import { LeaveCallButton } from "@/src/components/livekit/LeaveCallButton";
import { IconButton } from "@/src/components/ui/IconButton";
import { SettingsModal } from "./SettingsModal";

const EMOJI_OPTIONS = ["👍", "👏", "❤️", "😂", "🔥"];

interface CallControlsProps {
  onEmojiClick?: (emoji: string) => void;
}

export function CallControls({ onEmojiClick }: CallControlsProps) {
  const [settingsOpen, setSettingsOpen] = useState(false);

  return (
    <>
      <div className="flex shrink-0 items-center justify-center gap-4 bg-neutral-900/95 px-6 py-3 backdrop-blur-sm">
        <MuteButton />

        <div className="flex items-center gap-2">
          {EMOJI_OPTIONS.map((emoji) => (
            <IconButton
              key={emoji}
              aria-label={`Send ${emoji}`}
              onClick={() => onEmojiClick?.(emoji)}
              className="text-2xl hover:scale-110"
            >
              {emoji}
            </IconButton>
          ))}
        </div>

        <LeaveCallButton />

        <IconButton
          aria-label="Settings"
          onClick={() => setSettingsOpen(true)}
        >
          <span className="text-xl" aria-hidden>
            ⚙️
          </span>
        </IconButton>
      </div>

      <SettingsModal
        isOpen={settingsOpen}
        onClose={() => setSettingsOpen(false)}
      />
    </>
  );
}
