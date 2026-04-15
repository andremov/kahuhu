"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Home, Trophy } from "lucide-react";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AnimatedNumber } from "@/components/ui/animated-number";
import { fireBigConfetti } from "@/components/ui/confetti";
import type { FinalResults } from "@/lib/types";
import { cn } from "@/lib/utils";

interface Props {
  results: FinalResults;
  myPlayerId: string | null;
}

const PODIUM_HEIGHTS = ["h-56", "h-40", "h-32"];
const PODIUM_GRADIENTS = [
  "bg-gradient-to-b from-answer-3 to-answer-3/60",
  "bg-gradient-to-b from-muted-foreground/70 to-muted-foreground/30",
  "bg-gradient-to-b from-answer-1/80 to-answer-1/40",
];
const PODIUM_ORDER = [1, 0, 2];

export default function FinalScreen({ results, myPlayerId }: Props) {
  useEffect(() => {
    fireBigConfetti();
  }, []);

  const top3 = results.players.slice(0, 3);
  const rest = results.players.slice(3);

  while (top3.length < 3) {
    top3.push(null as unknown as (typeof top3)[number]);
  }

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-1 flex-col items-center gap-10 px-6 py-12">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex flex-col items-center gap-3 text-center"
      >
        <Trophy className="size-12 text-answer-3 drop-shadow-[0_0_30px_oklch(0.82_0.17_75/0.6)]" />
        <h1 className="font-display text-4xl font-bold sm:text-5xl">
          {results.quizTitle}
        </h1>
        <p className="font-display text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          {results.totalQuestions} questions · {results.players.length} players
        </p>
      </motion.div>

      <div className="flex w-full items-end justify-center gap-3 sm:gap-6">
        {PODIUM_ORDER.map((originalIdx, renderIdx) => {
          const player = top3[originalIdx];
          if (!player) {
            return (
              <div
                key={renderIdx}
                className="flex w-28 flex-col items-center sm:w-36"
              >
                <div className={cn("w-full", PODIUM_HEIGHTS[originalIdx])} />
              </div>
            );
          }
          const position = originalIdx + 1;
          const delay = 0.3 + (2 - originalIdx) * 0.35;
          const isMe = player.id === myPlayerId;
          return (
            <motion.div
              key={player.id}
              initial={{ opacity: 0, y: 80 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay, duration: 0.6, ease: "easeOut" }}
              className="flex w-28 flex-col items-center sm:w-40"
            >
              <div className="mb-3 flex flex-col items-center gap-1 text-center">
                {position === 1 && (
                  <motion.div
                    initial={{ scale: 0, rotate: -30 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ delay: delay + 0.3, type: "spring" }}
                  >
                    <Trophy className="size-10 text-answer-3 drop-shadow-[0_0_20px_oklch(0.82_0.17_75/0.8)]" />
                  </motion.div>
                )}
                <span
                  className={cn(
                    "truncate font-display font-bold",
                    position === 1
                      ? "text-2xl sm:text-3xl"
                      : "text-xl sm:text-2xl",
                    isMe && "text-primary",
                  )}
                >
                  {player.name}
                </span>
                <AnimatedNumber
                  value={player.score}
                  className="font-display text-sm font-bold tabular-nums text-muted-foreground"
                />
              </div>
              <div
                className={cn(
                  "relative flex w-full items-start justify-center rounded-t-2xl border border-white/15 pt-3 shadow-2xl",
                  PODIUM_HEIGHTS[originalIdx],
                  PODIUM_GRADIENTS[originalIdx],
                )}
              >
                <span className="font-display text-5xl font-bold text-white drop-shadow sm:text-6xl">
                  {position}
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>

      {rest.length > 0 && (
        <div className="w-full rounded-3xl border border-white/10 bg-card/60 p-6 backdrop-blur-xl">
          <h3 className="mb-3 font-display text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            Rest of the pack
          </h3>
          <ol className="flex flex-col gap-2">
            {rest.map((p, idx) => {
              const isMe = p.id === myPlayerId;
              return (
                <motion.li
                  key={p.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1 + idx * 0.06 }}
                  className={cn(
                    "flex items-center gap-4 rounded-xl bg-background/40 px-4 py-3",
                    isMe && "ring-2 ring-primary",
                  )}
                >
                  <span className="w-8 font-display text-lg font-bold tabular-nums text-muted-foreground">
                    {p.position}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-semibold">{p.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {p.correctAnswers} / {results.totalQuestions} correct
                    </p>
                  </div>
                  <AnimatedNumber
                    value={p.score}
                    className="font-display text-xl font-bold tabular-nums"
                  />
                </motion.li>
              );
            })}
          </ol>
        </div>
      )}

      <Link href="/" className="contents">
        <Button
          size="lg"
          variant="outline"
          className="h-12 rounded-full border-white/20 px-8 font-display text-sm font-bold uppercase tracking-widest"
        >
          <Home className="mr-2 size-4" />
          Back home
        </Button>
      </Link>
    </div>
  );
}
