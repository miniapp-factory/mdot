"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Share } from "@/components/share";
import { url } from "@/lib/metadata";

const fruits = ["Apple", "Banana", "Cherry", "Lemon"] as const;
type Fruit = typeof fruits[number];

const fruitImages: Record<Fruit, string> = {
  Apple: "/apple.png",
  Banana: "/banana.png",
  Cherry: "/cherry.png",
  Lemon: "/lemon.png",
};

export default function SlotMachine() {
  const [grid, setGrid] = useState<Fruit[][]>([
    ["Apple", "Banana", "Cherry"],
    ["Lemon", "Apple", "Banana"],
    ["Cherry", "Lemon", "Apple"],
  ]);
  const [spinning, setSpinning] = useState(false);

  const spin = () => {
    if (spinning) return;
    setSpinning(true);
    const interval = setInterval(() => {
      setGrid((prev) =>
        prev.map((row) =>
          row.map(() => fruits[Math.floor(Math.random() * fruits.length)])
        )
      );
    }, 200);
    setTimeout(() => {
      clearInterval(interval);
      setSpinning(false);
    }, 2000);
  };

  // Determine win condition directly in render
  let detectedWin: Fruit | null = null;
  if (!spinning) {
    // rows
    for (let i = 0; i < 3; i++) {
      if (
        grid[i][0] === grid[i][1] &&
        grid[i][1] === grid[i][2]
      ) {
        detectedWin = grid[i][0];
      }
    }
    // columns
    for (let j = 0; j < 3; j++) {
      if (
        grid[0][j] === grid[1][j] &&
        grid[1][j] === grid[2][j]
      ) {
        detectedWin = grid[0][j];
      }
    }
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="grid grid-cols-3 gap-2">
        {grid.flat().map((fruit, idx) => (
          <img
            key={idx}
            src={fruitImages[fruit]}
            alt={fruit}
            width={64}
            height={64}
          />
        ))}
      </div>
      <Button onClick={spin} disabled={spinning}>
        {spinning ? "Spinning..." : "Spin"}
      </Button>
      {!spinning && detectedWin && (
        <div className="flex flex-col items-center gap-2">
          <span className="text-xl font-bold">
            You won with {detectedWin}!
          </span>
          <Share text={`I won with ${detectedWin}! ${url}`} />
        </div>
      )}
    </div>
  );
}
