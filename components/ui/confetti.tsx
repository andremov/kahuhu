"use client";

import confetti from "canvas-confetti";

export function fireConfetti(options?: confetti.Options) {
  confetti({
    particleCount: 80,
    spread: 70,
    startVelocity: 40,
    origin: { y: 0.6 },
    colors: ["#22d3ee", "#f472b6", "#fbbf24", "#a78bfa"],
    ...options,
  });
}

export function fireBigConfetti() {
  const duration = 2500;
  const end = Date.now() + duration;
  const colors = ["#22d3ee", "#f472b6", "#fbbf24", "#a78bfa", "#34d399"];

  const frame = () => {
    confetti({
      particleCount: 6,
      angle: 60,
      spread: 55,
      origin: { x: 0, y: 0.7 },
      colors,
    });
    confetti({
      particleCount: 6,
      angle: 120,
      spread: 55,
      origin: { x: 1, y: 0.7 },
      colors,
    });
    if (Date.now() < end) {
      requestAnimationFrame(frame);
    }
  };
  frame();
}
