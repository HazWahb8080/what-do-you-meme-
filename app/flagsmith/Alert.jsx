"use client";
import { useFlags } from "flagsmith/react";
import React from "react";

function Alert() {
  // flagsmith
  const { welcome_message } = useFlags(["welcome_message"]);
  if (!welcome_message.enabled) {
    return null;
  }
  return (
    <div className="sticky top-0 w-full py-4 bg-black text-white items-center justify-center flex">
      {welcome_message.value}
    </div>
  );
}

export default Alert;
