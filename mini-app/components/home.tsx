"use client";

import { useState } from "react";
import Game from "./game";

export default function Home() {
  const [playing, setPlaying] = useState(false);

  if (playing) {
    return <Game />;
  }

  return (
    <main className="flex flex-col gap-3 place-items-center place-content-center px-4 grow h-screen bg-gradient-to-b from-gray-900 to-black">
      <span className="text-2xl text-white">
        Tap when the growing circle reaches the hidden ideal size.
      </span>
      <button
        className="mt-4 px-8 py-3 bg-blue-600 text-white rounded-md text-2xl"
        onClick={() => setPlaying(true)}
      >
        PLAY
      </button>
    </main>
  );
}
