"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { ClientSideSuspense } from "@liveblocks/react";
import { RoomProvider } from "@/liveblocks.config";
import Room from "./Room";
import { v4 as uuidv4 } from "uuid";

export default function Home() {
  const [startGame, setStartGame] = useState(false);
  const [step, setStep] = useState(1);
  const [players_number, setPlayers_number] = useState(1);
  const router = useRouter();
  const searchParams = useSearchParams();
  const roomId = searchParams.get("id");
  const playerNumber = searchParams.get("P");

  return (
    <main
      className="flex min-h-screen flex-col 
    items-center justify-between bg-black bg-[url('/bg.jpg')] "
    >
      <div
        className="w-full items-center min-h-screen
       justify-center flex flex-col text-white bg-black/80"
      >
        <h2 className="text-5xl font-medium">What Do You Meme ?</h2>
        <p className="italic opacity-60">ONLINE VERSION</p>
        <div className="py-12 w-full items-center justify-center flex flex-col">
          {startGame ? (
            <div className="flex flex-col space-y-2 w-full items-center justify-center">
              {!roomId && (
                <>
                  {" "}
                  <label className="text-xl">How Many Players ?</label>
                  <input
                    type="number"
                    className="rounded-full py-2 px-4 text-black outline-none"
                    step={1}
                    min={1}
                    max={20}
                    defaultValue={1}
                    onChange={(e) => setPlayers_number(e.target.value)}
                    value={players_number}
                  />
                  {players_number == 1 && (
                    <span className="items-center justify-center flex w-full py-10">
                      <button
                        className="button"
                        onClick={() =>
                          router.push(`/game?id=null&P=${players_number}`)
                        }
                      >
                        Start game
                      </button>
                    </span>
                  )}
                  {players_number > 1 && (
                    <span className="items-center justify-center flex w-full py-10">
                      <button
                        className="button"
                        onClick={() => {
                          router.push(
                            `?id=${uuidv4().split("-")[0]}&P=${players_number}`
                          );
                          setStep(2);
                        }}
                      >
                        Next
                      </button>
                    </span>
                  )}
                </>
              )}

              {roomId && playerNumber > 1 && (
                <>
                  <span className="items-center justify-center flex flex-col mb-8 space-y-3">
                    <p>Invite Others using this link</p>
                    <p
                      className="bg-white text-black rounded-full
                    px-4 py-1 "
                    >{`${window.location.href}?id=${roomId}&P=${players_number}`}</p>
                  </span>

                  <RoomProvider id={roomId} initialPresence={{}}>
                    <ClientSideSuspense fallback={<div>Loading…</div>}>
                      {() => <Room />}
                    </ClientSideSuspense>
                  </RoomProvider>
                </>
              )}
            </div>
          ) : (
            <button onClick={() => setStartGame(true)} className="button">
              Start
            </button>
          )}
        </div>
      </div>
    </main>
  );
}
