"use client";
import React, { useEffect, useState } from "react";
import { useOthers } from "@/liveblocks.config";
import { useRouter, useSearchParams } from "next/navigation";

function Room() {
  const others = useOthers();
  const userCount = others.length;
  const searchParams = useSearchParams();
  const playersNumber = searchParams.get("P");
  const id = searchParams.get("id");
  const router = useRouter();
  const [unLockGame, setUnLockGame] = useState(false);
  useEffect(() => {
    if (unLockGame) return;
    if (playersNumber == userCount + 1) {
      setUnLockGame(true);
    }
  }, [userCount]);
  if (unLockGame) {
    return (
      <div>
        <p>all players joined 👍</p>
        <span className="items-center justify-center flex w-full py-10">
          <button
            className="button"
            onClick={() => router.push(`/game?id=${id}&P=${playersNumber}`)}
          >
            Start game
          </button>
        </span>
      </div>
    );
  } else {
    return <>{playersNumber - (userCount + 1)} left to join</>;
  }
}

export default Room;
