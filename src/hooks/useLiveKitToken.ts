import { useState, useEffect } from "react";

export interface LiveKitToken {
  serverUrl: string;
  participantToken: string;
}

export interface UseLiveKitTokenOptions {
  roomName?: string;
  participantName?: string;
  isGuest?: boolean;
}

export function useLiveKitToken(options: UseLiveKitTokenOptions = {}) {
  const { roomName, participantName, isGuest = false } = options;

  const [token, setToken] = useState<LiveKitToken | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!roomName?.trim()) return;

    let cancelled = false;

    async function fetchToken() {
      try {
        const res = await fetch("/api/token", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            room_name: roomName!.trim(),
            participant_name: participantName,
            is_guest: isGuest,
          }),
        });

        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          throw new Error(err.error ?? `Token request failed: ${res.status}`);
        }

        const data = await res.json();
        if (!cancelled) {
          setToken({
            serverUrl: data.server_url,
            participantToken: data.participant_token,
          });
        }
      } catch (e) {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : "Failed to get token");
        }
      }
    }

    fetchToken();
    return () => {
      cancelled = true;
    };
  }, [roomName, participantName, isGuest]);

  return { token, error, isLoading: !token && !error };
}
