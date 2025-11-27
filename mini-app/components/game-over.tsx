"use client";

import { useRef } from "react";

export default function GameOver({
  finalScore,
  highScore,
  onPlayAgain,
}: {
  finalScore: number;
  highScore: number;
  onPlayAgain: () => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const share = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const width = 512;
    const height = 512;
    canvas.width = width;
    canvas.height = height;
    // background
    ctx.fillStyle = "#111";
    ctx.fillRect(0, 0, width, height);
    // glowing circle
    const gradient = ctx.createRadialGradient(
      width / 2,
      height / 2,
      50,
      width / 2,
      height / 2,
      200
    );
    gradient.addColorStop(0, "rgba(0,255,255,0.8)");
    gradient.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(width / 2, height / 2, 200, 0, Math.PI * 2);
    ctx.fill();
    // text
    ctx.fillStyle = "#fff";
    ctx.font = "bold 36px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("The Uncertainty Meter", width / 2, 120);
    ctx.font = "28px sans-serif";
    ctx.fillText(`Score: ${Math.round(finalScore)}`, width / 2, 200);
    ctx.fillText(`High: ${Math.round(highScore)}`, width / 2, 250);
    // convert to blob
    canvas.toBlob(async (blob) => {
      if (!blob) return;
      const filesArray = [
        new File([blob], "uncertainty-meter.png", {
          type: "image/png",
        }),
      ];
      if (navigator.share) {
        try {
          await navigator.share({
            title: "The Uncertainty Meter",
            text: `Score: ${Math.round(finalScore)} High: ${Math.round(highScore)}`,
            files: filesArray,
          });
        } catch (e) {
          console.error(e);
        }
      } else {
        const url = URL.createObjectURL(blob);
        window.open(url);
      }
    });
  };

  return (
    <div className="relative w-full h-screen bg-gradient-to-b from-gray-900 to-black flex flex-col items-center justify-center">
      <canvas ref={canvasRef} style={{ display: "none" }} />
      <div className="text-white text-3xl mb-4">Game Over</div>
      <div className="text-white text-2xl mb-2">Final Score: {Math.round(finalScore)}</div>
      <div className="text-white text-2xl mb-6">High Score: {Math.round(highScore)}</div>
      <div className="flex gap-4">
        <button
          className="px-6 py-3 bg-green-600 text-white rounded-md text-xl"
          onClick={share}
        >
          SHARE
        </button>
        <button
          className="px-6 py-3 bg-blue-600 text-white rounded-md text-xl"
          onClick={onPlayAgain}
        >
          PLAY AGAIN
        </button>
      </div>
    </div>
  );
}
