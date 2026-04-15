"use client";

import { useEffect, useRef, useState } from "react";

interface Props {
  value: number;
  duration?: number;
  className?: string;
}

export function AnimatedNumber({ value, duration = 700, className }: Props) {
  const [display, setDisplay] = useState(value);
  const previous = useRef(value);
  const startTs = useRef<number | null>(null);
  const raf = useRef<number | null>(null);

  useEffect(() => {
    const from = previous.current;
    const to = value;
    if (from === to) return;
    startTs.current = null;

    const step = (ts: number) => {
      if (startTs.current === null) startTs.current = ts;
      const elapsed = ts - startTs.current;
      const t = Math.min(1, elapsed / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      const next = Math.round(from + (to - from) * eased);
      setDisplay(next);
      if (t < 1) {
        raf.current = requestAnimationFrame(step);
      } else {
        previous.current = to;
      }
    };

    raf.current = requestAnimationFrame(step);
    return () => {
      if (raf.current !== null) cancelAnimationFrame(raf.current);
    };
  }, [value, duration]);

  return <span className={className}>{display.toLocaleString()}</span>;
}
