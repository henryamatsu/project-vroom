import { useState, useEffect } from "react";
import { ROOM_NAME } from "@/src/lib/livekit";

export interface LiveKitToken {
  serverUrl: string;
  participantToken: string;
}

export function useLiveKitToken() {
  const [token, setToken] = useState<LiveKitToken | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchToken() {
      try {
        const res = await fetch("/api/token", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ room_name: ROOM_NAME }),
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
  }, []);

  return { token, error, isLoading: !token && !error };
}
