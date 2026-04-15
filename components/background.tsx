"use client";

import { useEffect, useRef, useState } from "react";

interface Orb {
  x: number;
  y: number;
  vx: number;
  vy: number;
}

const ORB_COLORS = [
  "var(--answer-1)",
  "var(--answer-2)",
  "var(--answer-3)",
  "var(--answer-4)",
  "var(--accent)",
];

export default function Background() {
  const [orbs, setOrbs] = useState<Orb[]>([]);
  const animationFrameRef = useRef<number | null>(null);

  useEffect(() => {
    const width = window.innerWidth;
    const height = window.innerHeight;

    setOrbs(
      Array.from({ length: ORB_COLORS.length }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 2.2,
        vy: (Math.random() - 0.5) * 2.2,
      })),
    );

    const orbSize = 420;
    const overflow = 0.25;
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
    <>
      <div className="pointer-events-none fixed inset-0 -z-20 overflow-hidden blur-3xl">
        {orbs.map((orb, index) => (
          <div
            key={index}
            style={{
              top: orb.y,
              left: orb.x,
              background: `radial-gradient(circle at center, ${ORB_COLORS[index]} 0%, ${ORB_COLORS[index]} 35%, transparent 70%)`,
              opacity: 0.45,
            }}
            className="absolute size-[420px] rounded-full"
          />
        ))}
      </div>
      <div
        className="pointer-events-none fixed inset-0 -z-10"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 20%, var(--background) 95%)",
        }}
      />
    </>
  );
}
