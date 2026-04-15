"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { QuestionResult, RoomSnapshot } from "@/lib/types";
import { Check, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  state: RoomSnapshot;
  result: QuestionResult;
  isHost: boolean;
  onNext: () => void;
}

export default function QuestionResultsScreen({
  state,
  result,
  isHost,
  onNext,
}: Props) {
  const q = state.currentQuestion;
  if (!q) return null;

  const maxCount = Math.max(1, ...result.optionResults.map((r) => r.count));
  const ranked = [...result.playerResults].sort((a, b) => b.score - a.score);
  const isLast = state.currentQuestionIndex + 1 >= state.totalQuestions;

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-6 px-6 py-8">
      <div className="text-center">
        <p className="text-sm text-muted-foreground">
          Results · Question {state.currentQuestionIndex + 1} /{" "}
          {state.totalQuestions}
        </p>
        <h2 className="mt-2 text-2xl font-bold">{q.statement}</h2>
      </div>

      <Card className="p-6">
        <div className="flex flex-col gap-3">
          {result.optionResults.map((opt, i) => {
            const isCorrect = opt.points > 0;
            const pct = (opt.count / maxCount) * 100;
            return (
              <div key={i} className="flex items-center gap-3">
                <div
                  className={cn(
                    "flex size-8 items-center justify-center rounded-md",
                    isCorrect
                      ? "bg-emerald-500/20 text-emerald-300"
                      : "bg-destructive/20 text-destructive",
                  )}
                >
                  {isCorrect ? (
                    <Check className="size-4" />
                  ) : (
                    <X className="size-4" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="mb-1 flex items-center justify-between text-sm">
                    <span
                      className={cn(
                        "font-semibold",
                        !isCorrect && "text-muted-foreground",
                      )}
                    >
                      {opt.text || <em>(blank)</em>}
                    </span>
                    <span className="tabular-nums text-muted-foreground">
                      {opt.count}
                    </span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-background/50">
                    <div
                      className={cn(
                        "h-full transition-all",
                        isCorrect ? "bg-emerald-500" : "bg-muted-foreground/50",
                      )}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="mb-3 text-sm font-semibold tracking-wide text-muted-foreground uppercase">
          Leaderboard
        </h3>
        <ol className="flex flex-col gap-1">
          {ranked.map((p, idx) => (
            <li
              key={p.id}
              className="flex items-center gap-3 rounded-lg bg-background/40 px-3 py-2"
            >
              <span className="w-6 text-sm text-muted-foreground tabular-nums">
                {idx + 1}
              </span>
              <span className="flex-1 truncate font-medium">{p.name}</span>
              {p.isCorrect ? (
                <Check className="size-4 text-emerald-400" />
              ) : p.answer === null ? (
                <span className="text-xs text-muted-foreground">—</span>
              ) : (
                <X className="size-4 text-destructive" />
              )}
              <span className="w-16 text-right font-bold tabular-nums">
                {p.score}
              </span>
            </li>
          ))}
        </ol>
      </Card>

      {isHost ? (
        <Button
          size="lg"
          onClick={onNext}
          className="h-14 w-full max-w-sm self-center text-base"
        >
          {isLast ? "See final results" : "Next question"}
        </Button>
      ) : (
        <p className="text-center text-sm text-muted-foreground">
          Waiting for the host…
        </p>
      )}
    </div>
  );
}
