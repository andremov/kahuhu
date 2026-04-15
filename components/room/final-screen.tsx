"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { FinalResults } from "@/lib/types";
import { Trophy } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  results: FinalResults;
  myPlayerId: string | null;
}

const MEDAL = ["text-yellow-300", "text-slate-300", "text-amber-700"];

export default function FinalScreen({ results, myPlayerId }: Props) {
  return (
    <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col items-center gap-8 px-6 py-12">
      <div className="flex flex-col items-center gap-3 text-center">
        <Trophy className="size-12 text-yellow-300" />
        <h1 className="text-4xl font-black">{results.quizTitle}</h1>
        <p className="text-muted-foreground">
          {results.totalQuestions} questions · {results.players.length} players
        </p>
      </div>

      <Card className="w-full p-6">
        <ol className="flex flex-col gap-2">
          {results.players.map((p) => {
            const isMe = p.id === myPlayerId;
            return (
              <li
                key={p.id}
                className={cn(
                  "flex items-center gap-4 rounded-lg bg-background/40 px-4 py-3",
                  isMe && "ring-2 ring-primary",
                )}
              >
                <span
                  className={cn(
                    "w-8 text-2xl font-black tabular-nums",
                    MEDAL[p.position - 1] ?? "text-muted-foreground",
                  )}
                >
                  {p.position}
                </span>
                <div className="flex-1">
                  <p className="font-semibold">{p.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {p.correctAnswers} / {results.totalQuestions} correct
                  </p>
                </div>
                <span className="text-2xl font-black tabular-nums">
                  {p.score}
                </span>
              </li>
            );
          })}
        </ol>
      </Card>

      <Link href="/" className="contents">
        <Button size="lg" variant="outline" className="h-12 px-8">
          Back to home
        </Button>
      </Link>
    </div>
  );
}
