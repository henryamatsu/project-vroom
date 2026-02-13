"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
} from "@clerk/nextjs";

export default function JoinPage() {
  const router = useRouter();
  const params = useParams();
  const roomId = (params.roomId as string) ?? "vroom-demo";
  const [guestName, setGuestName] = useState("Guest");

  const handleJoinAsGuest = () => {
    const name = guestName.trim() || "Guest";
    router.push(`/room/${roomId}?guest=true&name=${encodeURIComponent(name)}`);
  };

  const handleJoinAsAccount = () => {
    router.push(`/room/${roomId}`);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white p-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-2">Join Room</h1>
          <p className="text-gray-400">Room: {roomId}</p>
        </div>

        <div className="space-y-6">
          <SignedIn>
            <div className="space-y-2">
              <p className="text-sm text-gray-400">
                You&apos;re signed in. Join with your account name.
              </p>
              <button
                onClick={handleJoinAsAccount}
                className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-500 rounded-lg font-medium transition"
              >
                Join
              </button>
            </div>
          </SignedIn>

          <SignedOut>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium mb-2">Join as guest</h3>
                <p className="text-sm text-gray-400 mb-2">
                  You can change your name before or during the call.
                </p>
                <input
                  type="text"
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  placeholder="Guest"
                  className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-500 mb-2"
                />
                <button
                  onClick={handleJoinAsGuest}
                  className="w-full py-3 px-4 bg-gray-700 hover:bg-gray-600 rounded-lg font-medium transition"
                >
                  Join as guest
                </button>
              </div>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-600" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-gray-900 text-gray-400">or</span>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="font-medium">Sign in</h3>
                <p className="text-sm text-gray-400 mb-2">
                  Save your display name and preferences.
                </p>
                <div className="flex gap-2">
                  <SignInButton
                    mode="modal"
                    forceRedirectUrl={`/join/${roomId}`}
                  >
                    <button className="flex-1 py-3 px-4 bg-blue-600 hover:bg-blue-500 rounded-lg font-medium transition">
                      Login
                    </button>
                  </SignInButton>
                  <SignUpButton
                    mode="modal"
                    forceRedirectUrl={`/join/${roomId}`}
                  >
                    <button className="flex-1 py-3 px-4 bg-green-600 hover:bg-green-500 rounded-lg font-medium transition">
                      Sign up
                    </button>
                  </SignUpButton>
                </div>
              </div>
            </div>
          </SignedOut>
        </div>

        <p className="text-center text-sm text-gray-500">
          <Link href="/" className="hover:text-gray-400">
            ← Back to home
          </Link>
        </p>
      </div>
    </div>
  );
}
