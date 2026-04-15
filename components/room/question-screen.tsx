"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Tv } from "lucide-react";
import type { PlayerRole, RoomSnapshot } from "@/lib/types";
import { cn } from "@/lib/utils";
import {
  ANSWER_BG_CLASS,
  ANSWER_LETTERS,
  ANSWER_SHAPES,
  ShapeIcon,
} from "@/components/ui/shape-icon";

interface Props {
  state: RoomSnapshot;
  role: PlayerRole;
  myAnswer: number | null;
  onAnswer: (index: number) => void;
}

function useCountdown(endsAt: number | null): number {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    if (endsAt === null) return;
    setNow(Date.now());
    const handle = setInterval(() => setNow(Date.now()), 100);
    return () => clearInterval(handle);
  }, [endsAt]);
  if (endsAt === null) return 0;
  return Math.max(0, (endsAt - now) / 1000);
}

function RingCountdown({
  remaining,
  total,
}: {
  remaining: number;
  total: number;
}) {
  const size = 112;
  const stroke = 10;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const pct = Math.max(0, Math.min(1, remaining / total));
  const offset = circumference * (1 - pct);
  const urgent = remaining <= 5;
  const seconds = Math.max(0, Math.ceil(remaining));

  return (
    <div
      className={cn(
        "relative flex items-center justify-center",
        urgent && "animate-pulse",
      )}
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="oklch(1 0 0 / 0.1)"
          strokeWidth={stroke}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={urgent ? "var(--destructive)" : "var(--primary)"}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 100ms linear" }}
        />
      </svg>
      <span
        className={cn(
          "absolute inset-0 flex items-center justify-center font-display text-4xl font-bold tabular-nums",
          urgent ? "text-destructive" : "text-foreground",
        )}
      >
        {seconds}
      </span>
    </div>
  );
}

export default function QuestionScreen({
  state,
  role,
  myAnswer,
  onAnswer,
}: Props) {
  const q = state.currentQuestion;
  if (!q) return null;

  const isTv = role === "host-tv";
  const disabled = isTv;
  const totalTime = q.timeLimit;
  const remaining = useCountdown(state.questionEndsAt);

  const answeredCount = state.players.filter(
    (p) => p.role !== "host-tv",
  ).length;

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-8 px-6 py-8">
      <div className="flex items-start justify-between">
        <div className="flex flex-col gap-1 font-display uppercase tracking-widest text-muted-foreground">
          <span className="text-xs">Question</span>
          <span className="text-2xl font-bold text-foreground">
            {state.currentQuestionIndex + 1}
            <span className="text-muted-foreground">
              {" / "}
              {state.totalQuestions}
            </span>
          </span>
        </div>

        <RingCountdown remaining={remaining} total={totalTime} />

        <div className="flex flex-col items-end gap-1 font-display uppercase tracking-widest text-muted-foreground">
          <span className="text-xs">Playing</span>
          <span className="text-2xl font-bold text-foreground">
            {answeredCount}
          </span>
        </div>
      </div>

      {isTv && (
        <div className="mx-auto flex items-center gap-2 rounded-full bg-accent/20 px-4 py-2 text-xs font-semibold uppercase tracking-widest text-accent">
          <Tv className="size-4" />
          TV mode — displaying only
        </div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative rounded-[2rem] p-[2px]"
        style={{
          background:
            "linear-gradient(135deg, var(--primary), var(--accent), var(--answer-3))",
        }}
      >
        <div className="rounded-[calc(2rem-2px)] bg-card/80 p-10 text-center backdrop-blur-xl">
          <h2 className="font-display text-3xl font-bold leading-tight sm:text-4xl md:text-5xl">
            {q.statement}
          </h2>
        </div>
      </motion.div>

      <div className="grid flex-1 grid-cols-1 gap-4 sm:grid-cols-2">
        {q.options.map((opt, idx) => {
          const isMine = myAnswer === idx;
          const shape = ANSWER_SHAPES[idx % 4];
          const letter = ANSWER_LETTERS[idx % 4];
          return (
            <motion.button
              key={idx}
              onClick={() => !disabled && onAnswer(idx)}
              disabled={disabled}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 + idx * 0.08 }}
              whileHover={!disabled ? { scale: 1.02, rotate: -0.4 } : undefined}
              whileTap={!disabled ? { scale: 0.97 } : undefined}
              className={cn(
                "group relative flex min-h-36 items-center gap-5 overflow-hidden rounded-2xl p-6 text-left font-bold shadow-xl shadow-black/30 transition-all",
                ANSWER_BG_CLASS[idx % 4],
                disabled && "cursor-not-allowed",
                myAnswer !== null &&
                  !isMine &&
                  "opacity-25 grayscale brightness-75",
                isMine &&
                  "scale-105 ring-4 ring-white ring-offset-4 ring-offset-background",
              )}
            >
              <div className="flex size-16 shrink-0 items-center justify-center rounded-xl bg-black/25 sm:size-20">
                <ShapeIcon shape={shape} className="size-9 sm:size-11" />
              </div>
              <div className="flex min-w-0 flex-1 flex-col gap-1">
                <span className="font-display text-xs font-bold uppercase tracking-widest opacity-75">
                  {letter}
                </span>
                <span className="break-words text-xl leading-tight sm:text-2xl">
                  {opt.text}
                </span>
              </div>
              {isMine && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute right-4 top-4 rounded-full bg-white px-3 py-1 text-xs font-bold uppercase tracking-widest text-black"
                >
                  Picked
                </motion.div>
              )}
            </motion.button>
          );
        })}
      </div>

      {!isTv && myAnswer !== null && (
        <p className="text-center font-display text-sm text-muted-foreground">
          Tap another to change your answer.
        </p>
      )}
    </div>
  );
}
