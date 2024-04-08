/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
"use client";
import { useRouter, useSearchParams } from "next/navigation";
import React, { Children, useEffect, useState } from "react";
import { memes } from "../data/data";
import { captions } from "../data/data";
import { useRecoilState } from "recoil";
import {
  IsRunningstate,
  chosenCaptionsState,
  randomCaptionsState,
  randomMemesState,
} from "../atoms/atoms";
import {
  addDoc,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { db } from "@/firebase";
import {
  RoomProvider,
  useBroadcastEvent,
  useEventListener,
  useStorage,
} from "@/liveblocks.config";
import Timer, { reset } from "../Timer";

function GamePage() {
  const searchParams = useSearchParams();
  const [currentUserName, setCurrentUserName] = useState("");
  const router = useRouter();
  const docId = searchParams.get("id");
  const user_name = searchParams.get("name");
  const players_number = searchParams.get("P");
  const [selectedCaptions, setSelectedCaptions] = useState([]);
  const [selectedCaption, setSelectedCaption] = useState();
  const [randomCaptions, setRandomCaptions] =
    useRecoilState(randomCaptionsState);
  const [randomMemes, setRandomMemes] = useRecoilState(randomMemesState);
  const [chosenCaptions, setChosenCaptions] =
    useRecoilState(chosenCaptionsState);
  const [round, setRound] = useState(1);
  const [activeMeme, setActiveMeme] = useState();
  const broadcast = useBroadcastEvent();
  const [isRunning, setIsRunning] = useRecoilState(IsRunningstate);
  const [showResults, setShowResults] = useState(false);
  // const captions = useStorage((root) => root.captions);

  useEventListener(({ event }) => {
    if (event.type === "CAPTION") {
      const newCaption = { player: event.name, caption: event.message };

      // Check if the new caption message already exists in the chosenCaptions array
      const isDuplicate = chosenCaptions.some(
        (caption) => caption.caption === newCaption.caption
      );

      if (!isDuplicate) {
        // If it's not a duplicate, add it to the chosenCaptions array
        setChosenCaptions([...chosenCaptions, newCaption]);
      }
    }
  });

  const getRandomCaptionsAndMemes = async () => {
    const numStringsToReturn = 7;
    const randomIndices = [];
    const randomStrings = [];

    // Generate 7 unique random indices
    while (randomIndices.length < numStringsToReturn) {
      const randomIndex = Math.floor(Math.random() * captions?.length);
      if (!randomIndices.includes(randomIndex)) {
        randomIndices.push(randomIndex);
      }
    }

    // Get the strings at the randomly generated indices
    randomIndices.forEach((index) => {
      randomStrings.push(captions[index]);
    });

    await setDoc(doc(db, "games", docId), {
      captions: randomStrings,
    });

    const randomIndicesMemes = [];
    const randomMemes = [];

    // Generate 7 unique random indices
    while (randomIndicesMemes.length < numStringsToReturn) {
      const randomIndex = Math.floor(Math.random() * memes?.length);
      if (!randomIndicesMemes.includes(randomIndex)) {
        randomIndicesMemes.push(randomIndex);
      }
    }

    // Get the strings at the randomly generated indices
    randomIndicesMemes.forEach((index) => {
      randomMemes.push(memes[index]);
    });

    await updateDoc(doc(db, "games", docId), {
      memes: randomMemes,
    });
  };

  useEffect(() => {
    if (randomCaptions.length > 0 && randomMemes.length > 0) return;
    const fetchData = async () => {
      const gameDoc = await getDoc(doc(db, "games", docId));
      if (gameDoc.exists()) {
        setRandomCaptions(gameDoc.data().captions);
        setRandomMemes(gameDoc.data().memes);
      }
      if (!gameDoc.exists()) {
        getRandomCaptionsAndMemes();
      }
    };
    fetchData();
  }, []);
  useEffect(() => {
    setActiveMeme(randomMemes[round]);
  }, [round, randomMemes]);

  useEffect(() => {
    if (!isRunning) {
      broadcast({
        type: "CAPTION",
        message: selectedCaption,
        name: user_name,
      });
      setShowResults(true);
    }
  }, [isRunning]);

  if (!docId) {
    return (
      <div className="min-h-screen items-center justify-center flex bg-black text-white">
        something went wrong
      </div>
    );
  }
  if (!user_name) {
    return (
      <div className="min-h-screen items-center justify-center flex bg-black text-white flex-col">
        <label className="text-lg pb-4 ">please enter your name</label>
        <input
          type="text"
          className="rounded-full py-2 px-4 text-black outline-none disabled:cursor-not-allowed"
          onChange={(e) => setCurrentUserName(e.target.value)}
          value={currentUserName}
        />

        <span className="items-center justify-center flex w-full py-10">
          <button
            className="button"
            onClick={() =>
              router.push(
                `/game?id=${docId}&P=${players_number}&name=${currentUserName}`
              )
            }
          >
            Start game
          </button>
        </span>
      </div>
    );
  }
  return (
    <div className="relative min-h-screen w-full items-center justify-center flex flex-col">
      {!showResults ? (
        <div
          className="relative min-h-screen w-full items-center justify-center
     grid grid-cols-2 bg-white space-x-12 overflow-hidden"
        >
          <div className="w-full px-10 relative min-h-screen items-center justify-center flex">
            <img
              src={activeMeme}
              className="rotate-(20deg) filter rounded-md h-[500px] w-[500px] object-cover"
            />
          </div>
          <div
            className="z-50 py-12 justify-items-center
       gap-y-10 grid grid-cols-1 xl:grid-cols-2 max-h-screen overflow-y-scroll"
          >
            {randomCaptions
              .filter((caption) => !selectedCaptions.includes(caption))
              .map((caption) => (
                <div
                  onClick={() => {
                    setSelectedCaption(caption);
                  }}
                  key={caption}
                  className={`bg-[#06051D] cursor-pointer rounded-xl
             h-[300px] w-[200px] py-6 px-6 text-white text-xl 
             ${
               selectedCaption === caption &&
               "opacity-30 rotate-12 smooth scale-110"
             }`}
                >
                  {caption}
                </div>
              ))}
          </div>
        </div>
      ) : (
        <div className="bg-[#06051D] min-h-screen relative w-full items-center space-x-5 justify-evenly flex ">
          <img
            src={randomMemes[round]}
            className="rotate-(20deg) filter top-10 sticky rounded-md h-[500px] w-[500px] object-cover"
          />
          <div className="grid grid-cols-2 items-center py-12 gap-6 justify-center place-items-center">
            {chosenCaptions.map((item) => (
              <div key={item} className="space-y-4">
                <p
                  className="text-xl font-bold italic px-6
                 py-1 rounded-full bg-white text-[#06051D]"
                >
                  {item.player}
                </p>
                <div
                  className={`text-[#06051D] cursor-pointer rounded-xl
             h-[300px] w-[200px] py-6 px-6 bg-white text-xl 
            `}
                >
                  {item.caption}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <span className="absolute top-5 left-5">
        {round === 7 ? (
          <button
            onClick={() => {
              router.push("/");
              setRandomCaptions([]);
              setRandomMemes([]);
            }}
            className="text-white font-bold text-xl bg-[#06051D] px-6 py-2 rounded-full"
          >
            Play Again
          </button>
        ) : (
          <span className="flex space-x-4">
            <button
              onClick={() =>
                !isRunning &&
                (setRound((curr) => curr + 1),
                setSelectedCaptions([...selectedCaptions, selectedCaption]),
                setChosenCaptions([]),
                setShowResults(false))
              }
              className="text-white font-bold text-xl bg-[#06051D] px-6 py-2 rounded-full"
            >
              <Timer resetTimer={round} />
            </button>
          </span>
        )}
      </span>
    </div>
  );
}

export default GamePage;
