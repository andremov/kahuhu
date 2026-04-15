"use client";

import { useEffect, useState } from "react";
import type { PlayerRole, RoomSnapshot } from "@/lib/types";
import { cn } from "@/lib/utils";

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
    const handle = setInterval(() => setNow(Date.now()), 250);
    return () => clearInterval(handle);
  }, [endsAt]);
  if (endsAt === null) return 0;
  return Math.max(0, Math.ceil((endsAt - now) / 1000));
}

const SHAPE_STYLES = [
  "bg-pink-500 hover:bg-pink-400",
  "bg-sky-500 hover:bg-sky-400",
  "bg-amber-500 hover:bg-amber-400",
  "bg-emerald-500 hover:bg-emerald-400",
];

export default function QuestionScreen({
  state,
  role,
  myAnswer,
  onAnswer,
}: Props) {
  const q = state.currentQuestion;
  if (!q) return null;

  const isTv = role === "host-tv";
  const disabled = isTv || myAnswer !== null;
  const totalTime = q.timeLimit;
  const remaining = useCountdown(state.questionEndsAt);
  const pct = Math.max(0, Math.min(1, remaining / totalTime));

  const answeredCount = state.players.filter(
    (p) => p.role !== "host-tv",
  ).length;

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-6 px-6 py-8">
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>
          Question {state.currentQuestionIndex + 1} / {state.totalQuestions}
        </span>
        <span>{answeredCount} playing</span>
      </div>

      <div className="flex items-center gap-4">
        <div className="h-3 flex-1 overflow-hidden rounded-full bg-card/60">
          <div
            className="h-full bg-foreground transition-all duration-1000 ease-linear"
            style={{ width: `${pct * 100}%` }}
          />
        </div>
        <span className="w-12 text-right text-xl font-bold tabular-nums">
          {remaining}s
        </span>
      </div>

      <div className="rounded-2xl bg-card/70 p-8 text-center backdrop-blur">
        <h2 className="text-2xl font-bold sm:text-3xl">{q.statement}</h2>
      </div>

      <div className="grid flex-1 grid-cols-1 gap-4 sm:grid-cols-2">
        {q.options.map((opt, idx) => {
          const isMine = myAnswer === idx;
          return (
            <button
              key={idx}
              onClick={() => !disabled && onAnswer(idx)}
              disabled={disabled}
              className={cn(
                "min-h-32 rounded-2xl p-6 text-left text-xl font-bold text-white transition-all",
                SHAPE_STYLES[idx % SHAPE_STYLES.length],
                disabled && "cursor-not-allowed",
                myAnswer !== null && !isMine && "opacity-40",
                isMine && "ring-4 ring-white ring-offset-2 ring-offset-background",
              )}
            >
              <span className="mb-2 block text-sm opacity-70">
                Option {idx + 1}
              </span>
              <span>{opt.text}</span>
            </button>
          );
        })}
      </div>

      {isTv ? (
        <p className="text-center text-xs text-muted-foreground">
          TV mode — you are displaying the question but not playing.
        </p>
      ) : myAnswer !== null ? (
        <p className="text-center text-sm text-muted-foreground">
          Answer locked in. Waiting for others…
        </p>
      ) : null}
    </div>
  );
}
