"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useHostStaging } from "@/lib/store";
import { makeRoomCode } from "@/lib/score";
import QuizDropzone from "@/components/quiz-dropzone";
import type { Quiz } from "@/lib/types";

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
    const params = new URLSearchParams({
      role: mode,
      name: name.trim(),
    });
    router.push(`/room/${code}?${params.toString()}`);
  };

  return (
    <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-8 px-6 py-12">
      <header>
        <Link
          href="/"
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          ← Back
        </Link>
        <h1 className="mt-4 text-4xl font-black">Host a room</h1>
        <p className="mt-2 text-muted-foreground">
          Upload a quiz JSON and pick how you want to join.
        </p>
      </header>

      <QuizDropzone onQuiz={setQuiz} quiz={quiz} />

      <div className="flex flex-col gap-2">
        <Label htmlFor="host-name">Your display name</Label>
        <Input
          id="host-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="h-12"
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label>Mode</Label>
        <div className="grid grid-cols-2 gap-2">
          <Button
            variant={mode === "host-tv" ? "default" : "outline"}
            size="lg"
            onClick={() => setMode("host-tv")}
            className="h-auto flex-col items-start py-3 text-left"
          >
            <span className="font-semibold">TV mode</span>
            <span className="text-xs opacity-80">
              Big-screen display. You can&apos;t answer.
            </span>
          </Button>
          <Button
            variant={mode === "host-player" ? "default" : "outline"}
            size="lg"
            onClick={() => setMode("host-player")}
            className="h-auto flex-col items-start py-3 text-left"
          >
            <span className="font-semibold">Host plays too</span>
            <span className="text-xs opacity-80">
              You both control and answer.
            </span>
          </Button>
        </div>
      </div>

      <Button
        size="lg"
        disabled={!canStart}
        onClick={handleStart}
        className="h-14 text-base"
      >
        Create room
      </Button>
    </main>
  );
}
