"use client";

import { useEffect, useRef, useState } from "react";

interface Orb {
  x: number;
  y: number;
  vx: number;
  vy: number;
}

const COLORS = [
  "from-pink-400",
  "from-teal-300",
  "from-red-500",
  "from-green-400",
  "from-blue-600",
  "from-violet-500",
  "from-yellow-400",
];

export default function Background() {
  const [orbs, setOrbs] = useState<Orb[]>([]);
  const animationFrameRef = useRef<number | null>(null);

  useEffect(() => {
    const width = window.innerWidth;
    const height = window.innerHeight;

    setOrbs(
      Array.from({ length: COLORS.length }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 5,
        vy: (Math.random() - 0.5) * 5,
      })),
    );

    const orbSize = 256;
    const overflow = 0.2;
    const lowerBoundX = orbSize * overflow * -1;
    const upperBoundX = width - orbSize * (1 - overflow);
    const lowerBoundY = orbSize * overflow * -1;
    const upperBoundY = height - orbSize * (1 - overflow);

    const tick = () => {
      setOrbs((current) =>
        current.map((orb) => {
          let { x, y, vx, vy } = orb;
          x += vx;
          y += vy;
          if (x <= lowerBoundX || x >= upperBoundX) {
            vx = -vx;
            x = Math.max(lowerBoundX, Math.min(upperBoundX, x));
          }
          if (y <= lowerBoundY || y >= upperBoundY) {
            vy = -vy;
            y = Math.max(lowerBoundY, Math.min(upperBoundY, y));
          }
          return { x, y, vx, vy };
        }),
      );
      animationFrameRef.current = requestAnimationFrame(tick);
    };

    animationFrameRef.current = requestAnimationFrame(tick);

    return () => {
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden blur-3xl">
      {orbs.map((orb, index) => (
        <div
          key={index}
          style={{
            top: orb.y,
            left: orb.x,
            transform: "translate3d(0, 0, 0)",
          }}
          className={`absolute size-64 rounded-full bg-radial ${COLORS[index]} from-70% to-70% to-transparent opacity-80`}
        />
      ))}
    </div>
  );
}
