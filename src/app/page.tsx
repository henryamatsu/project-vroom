"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [joinCode, setJoinCode] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const err = searchParams.get("error");
    if (err) setError(decodeURIComponent(err));
  }, [searchParams]);
  const [isCreating, setIsCreating] = useState(false);
  const [isJoining, setIsJoining] = useState(false);

  const handleCreateRoom = async () => {
    setError(null);
    setIsCreating(true);
    try {
      const res = await fetch("/api/rooms", { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed to create room");
      router.push(`/join/${data.joinCode}`);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to create room");
    } finally {
      setIsCreating(false);
    }
  };

  const handleJoinRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const code = joinCode.trim().toLowerCase();
    if (!code) {
      setError("Enter a join code");
      return;
    }
    setIsJoining(true);
    try {
      const res = await fetch(`/api/rooms/${encodeURIComponent(code)}`);
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? "Room not found or expired");
      }
      router.push(`/join/${code}`);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Room not found or expired");
    } finally {
      setIsJoining(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white p-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-2">Vroom</h1>
          <p className="text-gray-400">
            Video meetings with 3D avatars. Create a room or join with a code.
          </p>
        </div>

        <div className="space-y-6">
          <form onSubmit={handleJoinRoom} className="space-y-4">
            <div>
              <label htmlFor="joinCode" className="block text-sm font-medium text-gray-300 mb-2">
                Join with code
              </label>
              <input
                id="joinCode"
                type="text"
                value={joinCode}
                onChange={(e) => {
                  setJoinCode(e.target.value);
                  setError(null);
                }}
                placeholder="xxxx-xxxx"
                className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={isJoining || isCreating}
              />
            </div>
            <button
              type="submit"
              disabled={isJoining || isCreating}
              className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-500 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-lg font-medium transition"
            >
              {isJoining ? "Joining…" : "Join room"}
            </button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-600" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-gray-900 text-gray-400">or</span>
            </div>
          </div>

          <button
            onClick={handleCreateRoom}
            disabled={isCreating || isJoining}
            className="w-full py-3 px-4 bg-green-600 hover:bg-green-500 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-lg font-medium transition"
          >
            {isCreating ? "Creating…" : "Create room"}
          </button>
        </div>

        {error && (
          <p className="text-sm text-red-400 text-center">{error}</p>
        )}
      </div>
    </div>
  );
}
