"use client";
import React, { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { IsRunningstate } from "./atoms/atoms";

const Timer = ({ resetTimer }) => {
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useRecoilState(IsRunningstate);

  useEffect(() => {
    let intervalId;
    if (isRunning) {
      intervalId = setInterval(() => {
        setTime((prevTime) => prevTime + 1);
      }, 1000);
    }

    return () => clearInterval(intervalId);
  }, [isRunning]);

  useEffect(() => {
    if (time >= 20) {
      setIsRunning(false);
    }
  }, [time]);
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds
      .toString()
      .padStart(2, "0")}`;
  };
  useEffect(() => {
    if (resetTimer) {
      reset();
    }
  }, [resetTimer]);
  const reset = () => {
    setTime(0);
    setIsRunning(true);
  };

  return <div>{!isRunning ? "Next" : formatTime(time)}</div>;
};

export default Timer;
