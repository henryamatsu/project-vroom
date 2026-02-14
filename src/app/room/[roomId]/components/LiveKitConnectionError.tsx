"use client";

interface LiveKitConnectionErrorProps {
  error: string;
}

export function LiveKitConnectionError({ error }: LiveKitConnectionErrorProps) {
  return (
    <div className="flex h-screen items-center justify-center bg-gray-900 p-8 text-white">
      <div className="max-w-md text-center">
        <h2 className="mb-2 text-xl font-semibold">LiveKit connection failed</h2>
        <p className="mb-4 text-gray-400">{error}</p>
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
      </div>
    </div>
  );
}
