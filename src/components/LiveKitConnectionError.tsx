"use client";

interface LiveKitConnectionErrorProps {
  error: string;
}

export default function LiveKitConnectionError({ error }: LiveKitConnectionErrorProps) {
  return (
    <div className="h-screen flex items-center justify-center bg-gray-900 text-white p-8">
      <div className="max-w-md text-center">
        <h2 className="text-xl font-semibold mb-2">LiveKit connection failed</h2>
        <p className="text-gray-400 mb-4">{error}</p>
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
