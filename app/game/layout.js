"use client";
import { useSearchParams } from "next/navigation";
import { RoomProvider } from "@/liveblocks.config";

export default function GameLayout({ children }) {
  const searchParams = useSearchParams();
  const roomId = searchParams.get("id");
  return (
    <RoomProvider id={roomId} initialPresence={{}}>
      <div>{children}</div>
    </RoomProvider>
  );
}
