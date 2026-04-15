"use client";

import { motion } from "framer-motion";
import { ArrowRight, Check, Flag, X } from "lucide-react";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AnimatedNumber } from "@/components/ui/animated-number";
import { fireConfetti } from "@/components/ui/confetti";
import {
  ANSWER_BG_CLASS,
  ANSWER_LETTERS,
  ANSWER_SHAPES,
  ShapeIcon,
} from "@/components/ui/shape-icon";
import type { QuestionResult, RoomSnapshot } from "@/lib/types";
import { cn } from "@/lib/utils";

interface Props {
  state: RoomSnapshot;
  result: QuestionResult;
  isHost: boolean;
  onNext: () => void;
  myPlayerId: string | null;
}

export default function QuestionResultsScreen({
  state,
  result,
  isHost,
  onNext,
  myPlayerId,
}: Props) {
  const q = state.currentQuestion;

  const myPlayerResult = result.playerResults.find((p) => p.id === myPlayerId);
  const iGotItRight = myPlayerResult?.isCorrect === true;

  useEffect(() => {
    if (iGotItRight) {
      fireConfetti({ particleCount: 60, spread: 60 });
    }
  }, [iGotItRight]);

  if (!q) return null;

  const totalAnswered = result.optionResults.reduce(
    (sum, r) => sum + r.count,
    0,
  );
  const ranked = [...result.playerResults].sort((a, b) => b.score - a.score);
  const isLast = state.currentQuestionIndex + 1 >= state.totalQuestions;

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-6 px-6 py-8">
      <div className="text-center">
        <p className="font-display text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          Results · {state.currentQuestionIndex + 1} / {state.totalQuestions}
        </p>
        <h2 className="mt-3 font-display text-2xl font-bold sm:text-3xl">
          {q.statement}
        </h2>
      </div>

      <div className="rounded-3xl border border-white/10 bg-card/60 p-6 backdrop-blur-xl">
        <div className="flex flex-col gap-4">
          {result.optionResults.map((opt, i) => {
            const isCorrect = opt.points > 0;
            const pct = totalAnswered > 0 ? (opt.count / totalAnswered) * 100 : 0;
            const shape = ANSWER_SHAPES[i % 4];
            const letter = ANSWER_LETTERS[i % 4];
            const isMyAnswer = myPlayerResult?.answer === i;
            return (
              <div key={i} className="flex items-center gap-4">
                <div
                  className={cn(
                    "flex size-12 shrink-0 items-center justify-center rounded-xl",
                    ANSWER_BG_CLASS[i % 4],
                  )}
                >
                  <ShapeIcon shape={shape} className="size-6" />
                </div>
                <div className="flex-1">
                  <div className="mb-1.5 flex items-center justify-between gap-2">
                    <div className="flex min-w-0 items-center gap-2">
                      <span className="font-display text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                        {letter}
                      </span>
                      <span
                        className={cn(
                          "truncate font-semibold",
                          !isCorrect && "text-muted-foreground",
                        )}
                      >
                        {opt.text || <em>(blank)</em>}
                      </span>
                      {isCorrect && (
                        <Check className="size-4 shrink-0 text-answer-2" />
                      )}
                      {isMyAnswer && (
                        <span className="shrink-0 rounded-full bg-white/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest">
                          You
                        </span>
                      )}
                    </div>
                    <span className="font-display text-sm font-bold tabular-nums text-muted-foreground">
                      {opt.count}
                    </span>
                  </div>
                  <div className="h-3 overflow-hidden rounded-full bg-background/50">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
                      className={cn(
                        "h-full rounded-full",
                        isCorrect
                          ? "bg-gradient-to-r from-primary to-accent"
                          : "bg-muted-foreground/40",
                      )}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="rounded-3xl border border-white/10 bg-card/60 p-6 backdrop-blur-xl">
        <h3 className="mb-3 font-display text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          Leaderboard
        </h3>
        <ol className="flex flex-col gap-2">
          {ranked.map((p, idx) => {
            const isMe = p.id === myPlayerId;
            return (
              <motion.li
                key={p.id}
                layout
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
                className={cn(
                  "flex items-center gap-3 rounded-xl bg-background/40 px-4 py-3",
                  isMe && "ring-2 ring-primary",
                )}
              >
                <span className="w-6 text-center font-display text-base font-bold tabular-nums text-muted-foreground">
                  {idx + 1}
                </span>
                <span className="min-w-0 flex-1 truncate font-semibold">
                  {p.name}
                </span>
                {p.isCorrect ? (
                  <div className="flex size-6 items-center justify-center rounded-full bg-answer-2/20 text-answer-2">
                    <Check className="size-4" />
                  </div>
                ) : p.answer === null ? (
                  <span className="font-display text-xs text-muted-foreground">
                    —
                  </span>
                ) : (
                  <div className="flex size-6 items-center justify-center rounded-full bg-destructive/20 text-destructive">
                    <X className="size-3.5" />
                  </div>
                )}
                <AnimatedNumber
                  value={p.score}
                  className="w-16 text-right font-display text-lg font-bold tabular-nums"
                />
              </motion.li>
            );
          })}
        </ol>
      </div>

      {isHost ? (
        <Button
          size="lg"
          onClick={onNext}
          className="group h-14 w-full max-w-sm self-center rounded-full bg-primary font-display text-base font-bold uppercase tracking-widest text-primary-foreground shadow-xl shadow-primary/30 hover:bg-primary/90"
        >
          {isLast ? (
            <>
              <Flag className="mr-2 size-4" />
              Final results
            </>
          ) : (
            <>
              Next question
              <ArrowRight className="ml-2 size-4 transition-transform group-hover:translate-x-0.5" />
            </>
          )}
        </Button>
      ) : (
        <p className="text-center font-display text-xs uppercase tracking-widest text-muted-foreground">
          Waiting for the host…
        </p>
      )}
    </div>
  );
}
