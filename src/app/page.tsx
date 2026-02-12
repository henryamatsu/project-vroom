import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <Link
        href="/room"
        className="px-6 py-3 bg-blue-600 hover:bg-blue-500 rounded-lg text-white font-medium transition"
      >
        Go to room
      </Link>
    </div>
  );
}
