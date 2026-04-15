"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowLeft, ArrowRight, Gamepad2, Tv } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import QuizDropzone from "@/components/quiz-dropzone";
import { useHostStaging } from "@/lib/store";
import { makeRoomCode } from "@/lib/score";
import type { Quiz } from "@/lib/types";
import { cn } from "@/lib/utils";

const MODES = [
  {
    id: "host-tv" as const,
    icon: Tv,
    title: "TV mode",
    subtitle: "Big-screen display. You don't answer.",
  },
  {
    id: "host-player" as const,
    icon: Gamepad2,
    title: "Host plays",
    subtitle: "You control the room and play too.",
  },
];

export default function HostPage() {
  const router = useRouter();
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [name, setName] = useState("Host");
  const [mode, setMode] = useState<"host-tv" | "host-player">("host-tv");
  const setStagedQuiz = useHostStaging((s) => s.setStagedQuiz);

  const canStart = quiz !== null && name.trim().length > 0;

  const handleStart = () => {
    if (!quiz) return;
    setStagedQuiz(quiz);
    const code = makeRoomCode();
    const params = new URLSearchParams({ role: mode, name: name.trim() });
    router.push(`/room/${code}?${params.toString()}`);
  };

  return (
    <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-8 px-6 py-12">
      <header>
        <Link
          href="/"
          className="inline-flex items-center gap-1 font-display text-xs font-semibold uppercase tracking-widest text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-3.5" />
          Back
        </Link>
        <h1 className="mt-4 font-display text-5xl font-bold">Host a room</h1>
        <p className="mt-2 text-muted-foreground">
          Drop a quiz JSON, pick a mode, and launch.
        </p>
      </header>

      <QuizDropzone onQuiz={setQuiz} quiz={quiz} />

      <div className="flex flex-col gap-3">
        <Label htmlFor="host-name" className="font-display text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          Your display name
        </Label>
        <Input
          id="host-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="h-14 text-lg"
        />
      </div>

      <div className="flex flex-col gap-3">
        <Label className="font-display text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          Mode
        </Label>
        <div className="grid grid-cols-2 gap-3">
          {MODES.map(({ id, icon: Icon, title, subtitle }) => {
            const selected = mode === id;
            return (
              <button
                key={id}
                type="button"
                onClick={() => setMode(id)}
                className={cn(
                  "group relative flex flex-col items-start gap-3 rounded-2xl border p-5 text-left transition-all",
                  selected
                    ? "scale-[1.02] border-primary/80 bg-primary/10 shadow-xl shadow-primary/20 ring-2 ring-primary"
                    : "border-white/10 bg-card/40 hover:border-white/25 hover:bg-card/60",
                )}
              >
                <div
                  className={cn(
                    "flex size-12 items-center justify-center rounded-xl transition-colors",
                    selected
                      ? "bg-primary/30 text-primary"
                      : "bg-white/5 text-muted-foreground group-hover:text-foreground",
                  )}
                >
                  <Icon className="size-6" strokeWidth={2.5} />
                </div>
                <div>
                  <p className="font-display text-lg font-bold">{title}</p>
                  <p className="text-xs text-muted-foreground">{subtitle}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <Button
        size="lg"
        disabled={!canStart}
        onClick={handleStart}
        className="group h-16 rounded-full bg-primary font-display text-base font-bold uppercase tracking-widest text-primary-foreground shadow-2xl shadow-primary/30 hover:bg-primary/90 disabled:opacity-40"
      >
        Launch room
        <ArrowRight className="ml-2 size-5 transition-transform group-hover:translate-x-0.5" />
      </Button>
    </main>
  );
}
