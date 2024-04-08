"use client";
import { atom } from "recoil";

export const randomCaptionsState = atom({
  key: "randomCaptionsState",
  default: [],
});
export const randomMemesState = atom({
  key: "randomMemesState",
  default: [],
});
export const chosenCaptionsState = atom({
  key: "chosenCaptionsState",
  default: [],
});
