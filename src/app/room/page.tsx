import { redirect } from "next/navigation";
import { DEFAULT_ROOM_NAME } from "@/src/lib/livekit";

export default function RoomPage() {
  redirect(`/join/${DEFAULT_ROOM_NAME}`);
}
