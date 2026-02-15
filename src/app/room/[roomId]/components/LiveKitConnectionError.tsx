"use client";

import Link from "next/link";

interface LiveKitConnectionErrorProps {
  error: string;
}

export function LiveKitConnectionError({ error }: LiveKitConnectionErrorProps) {
  const isRoomError = error.toLowerCase().includes("room") && error.toLowerCase().includes("not found");

  return (
    <div className="flex h-screen items-center justify-center bg-gray-900 p-8 text-white">
      <div className="max-w-md text-center space-y-4">
        <h2 className="text-xl font-semibold">
          {isRoomError ? "Cannot join room" : "Connection failed"}
        </h2>
        <p className="text-gray-400">{error}</p>
        {!isRoomError && (
          <p className="text-sm text-gray-500">
            Set LIVEKIT_URL, LIVEKIT_API_KEY, LIVEKIT_API_SECRET in .env.local.
            Get credentials from{" "}
            <a
              href="https://cloud.livekit.io"
              className="text-blue-400 hover:underline"
            >
              LiveKit Cloud
            </a>
            .
          </p>
        )}
        <Link
          href="/"
          className="inline-block px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm"
        >
          ← Back to home
        </Link>
      </div>
    </div>
  );
}
