"use client";

import { useRouter } from "next/navigation";
import { DisconnectButton } from "@livekit/components-react";

export function LeaveCallButton() {
  const router = useRouter();

  return (
    <DisconnectButton
      className="flex h-12 w-12 items-center justify-center rounded-full bg-red-600 text-white transition-colors hover:bg-red-500"
      title="Leave call"
      onClick={() => router.push("/")}
    >
      <span className="text-xl" aria-hidden>
        📞
      </span>
    </DisconnectButton>
  );
}
