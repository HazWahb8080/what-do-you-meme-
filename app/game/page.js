/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
"use client";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { memes } from "../data/data";
import { captions } from "../data/data";
import { useRecoilState } from "recoil";
import { randomCaptionsState, randomMemesState } from "../atoms/atoms";
import {
  addDoc,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { db } from "@/firebase";

function GamePage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const players_number = searchParams.get("P");
  const docId = searchParams.get("id");
  const [selectedCaptions, setSelectedCaptions] = useState([]);
  const [selectedCaption, setSelectedCaption] = useState();
  const [randomCaptions, setRandomCaptions] =
    useRecoilState(randomCaptionsState);
  const [randomMemes, setRandomMemes] = useRecoilState(randomMemesState);
  const [round, setRound] = useState(1);
  const [activeMeme, setActiveMeme] = useState();

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

  // multiplayer functionality

  return (
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
       gap-y-10 grid grid-cols-2 max-h-screen overflow-y-scroll"
      >
        {randomCaptions
          .filter((caption) => !selectedCaptions.includes(caption))
          .map((caption) => (
            <div
              onClick={() => setSelectedCaption(caption)}
              key={caption}
              className={`bg-[#06051D] cursor-pointer rounded-xl
             h-[300px] w-[200px] py-6 px-6 text-white text-xl 
             ${selectedCaption === caption && "opacity-30 rotate-12 smooth"}`}
            >
              {caption}
            </div>
          ))}
      </div>
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
          <button
            onClick={() => {
              setRound((curr) => curr + 1);
              setSelectedCaptions([...selectedCaptions, selectedCaption]);
            }}
            className="text-white font-bold text-xl bg-[#06051D] px-6 py-2 rounded-full"
          >
            {`Next (${round}/7) `}
          </button>
        )}
      </span>
    </div>
  );
}

export default GamePage;
