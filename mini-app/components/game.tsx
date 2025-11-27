"use client";

import { useEffect, useRef, useState } from "react";
import GameOver from "./game-over";

const MIN_FACTOR = 0.2;
const MAX_FACTOR = 0.4;
const ANIMATION_DURATION = 2500; // ms

export default function Game() {
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("uncertainty-meter-highscore");
      return stored ? parseInt(stored, 10) : 0;
    }
    return 0;
  });
  const [radius, setRadius] = useState(0);
  const [targetRadius, setTargetRadius] = useState(0);
  const [isGrowing, setIsGrowing] = useState(false);
  const [showIdeal, setShowIdeal] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number>(0);
  const startTimeRef = useRef<number>(0);

  const shortestSide = () => {
    if (!containerRef.current) return 0;
    const { clientWidth, clientHeight } = containerRef.current;
    return Math.min(clientWidth, clientHeight);
  };

  const startRound = () => {
    setRadius(0);
    setShowIdeal(false);
    setIsGrowing(true);
    const min = shortestSide() * MIN_FACTOR;
    const max = shortestSide() * MAX_FACTOR;
    const target = Math.random() * (max - min) + min;
    setTargetRadius(target);
    startTimeRef.current = performance.now();
    animationRef.current = requestAnimationFrame(animate);
  };

  const animate = (time: number) => {
    if (!isGrowing) return;
    const elapsed = time - startTimeRef.current;
    const progress = Math.min(elapsed / ANIMATION_DURATION, 1);
    const newRadius = progress * targetRadius;
    setRadius(newRadius);
    if (progress < 1) {
      animationRef.current = requestAnimationFrame(animate);
    } else {
      setIsGrowing(false);
    }
  };

  const handleTap = () => {
    if (!isGrowing) return;
    cancelAnimationFrame(animationRef.current);
    setIsGrowing(false);
    setShowIdeal(true);
    const tappedRadius = radius;
    const success = tappedRadius <= targetRadius;
    if (success) {
      const roundScore = Math.abs(targetRadius - tappedRadius);
      const newScore = score + roundScore;
      setScore(newScore);
      setTimeout(() => {
        startRound();
      }, 800);
    } else {
      const newHigh = Math.max(highScore, score);
      setHighScore(newHigh);
      if (typeof window !== "undefined") {
        localStorage.setItem("uncertainty-meter-highscore", newHigh.toString());
      }
      setGameOver(true);
    }
  };

  useEffect(() => {
    startRound();
    return () => cancelAnimationFrame(animationRef.current);
  }, []);

  if (gameOver) {
    return <GameOver finalScore={score} highScore={highScore} onPlayAgain={() => {
      setScore(0);
      setGameOver(false);
      startRound();
    }} />;
  }

  return (
    <div
      ref={containerRef}
      className="relative w-full h-screen bg-gradient-to-b from-gray-900 to-black flex items-center justify-center"
      onClick={handleTap}
    >
      <div className="absolute text-white text-2xl top-4 left-4">
        Score: {Math.round(score)}
      </div>
      <div className="absolute text-white text-2xl top-4 right-4">
        High: {Math.round(highScore)}
      </div>
      <div
        className="absolute"
        style={{
          width: radius * 2,
          height: radius * 2,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(0,255,255,0.5) 0%, rgba(0,0,0,0) 70%)",
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%)",
        }}
      />
      {showIdeal && (
        <div
          className="absolute"
          style={{
            width: targetRadius * 2,
            height: targetRadius * 2,
            borderRadius: "50%",
            border: "4px solid red",
            left: "50%",
            top: "50%",
            transform: "translate(-50%, -50%)",
          }}
        />
      )}
    </div>
  );
}
