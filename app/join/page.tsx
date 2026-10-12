"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

const CODE_LENGTH = 6;

const cleanCode = (raw: string) =>
  raw.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, CODE_LENGTH);

function JoinForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const prefill = searchParams.get("code");
  const [code, setCode] = useState(() => (prefill ? cleanCode(prefill) : ""));
  const [name, setName] = useState("");

  // A ?code= that changes while the form is mounted refills the field (adjust-state-on-prop-change).
  const [seenPrefill, setSeenPrefill] = useState(prefill);
  if (prefill !== seenPrefill) {
    setSeenPrefill(prefill);
    if (prefill) setCode(cleanCode(prefill));
  }

  const canJoin = code.trim().length >= 4 && name.trim().length > 0;

  const handleJoin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canJoin) return;
    const params = new URLSearchParams({ role: "player", name: name.trim() });
    router.push(`/room/${code.trim().toUpperCase()}?${params.toString()}`);
  };

  const padded = code.padEnd(CODE_LENGTH, " ");

  return (
    <main className="mx-auto flex w-full max-w-md flex-1 flex-col gap-8 px-6 py-12">
      <header>
        <Link
          href="/"
          className="inline-flex items-center gap-1 font-display text-xs font-semibold uppercase tracking-widest text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-3.5" />
          Back
        </Link>
        <h1 className="mt-4 font-display text-5xl font-bold">Join a room</h1>
      </header>

      <form onSubmit={handleJoin} className="flex flex-col gap-8">
        <div className="flex flex-col gap-3">
          <Label
            htmlFor="code"
            className="font-display text-xs font-semibold uppercase tracking-widest text-muted-foreground"
          >
            Room code
          </Label>
          <div className="relative">
            <Input
              id="code"
              placeholder=""
              value={code}
              onChange={(e) =>
                setCode(
                  e.target.value
                    .toUpperCase()
                    .replace(/[^A-Z0-9]/g, "")
                    .slice(0, CODE_LENGTH),
                )
              }
              className="absolute inset-0 h-full w-full cursor-pointer bg-transparent text-transparent caret-transparent"
              maxLength={CODE_LENGTH}
              autoComplete="off"
              autoCapitalize="characters"
              inputMode="text"
              aria-label="Room code"
            />
            <div className="pointer-events-none flex gap-2">
              {Array.from({ length: CODE_LENGTH }).map((_, i) => {
                const ch = padded[i].trim();
                const active = code.length === i;
                return (
                  <div
                    key={i}
                    className={cn(
                      "flex h-16 flex-1 items-center justify-center rounded-xl border-2 bg-card/60 font-display text-3xl font-bold backdrop-blur-xl transition-all",
                      ch
                        ? "border-primary/60"
                        : "border-white/10",
                      active &&
                        "border-primary ring-4 ring-primary/20",
                    )}
                  >
                    {ch || ""}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-3">
          <Label
            htmlFor="name"
            className="font-display text-xs font-semibold uppercase tracking-widest text-muted-foreground"
          >
            Your name
          </Label>
          <Input
            id="name"
            placeholder="e.g. Alex"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="h-14 text-lg"
            autoComplete="off"
          />
        </div>
        <Button
          type="submit"
          size="lg"
          disabled={!canJoin}
          className="group h-16 rounded-full bg-primary font-display text-base font-bold uppercase tracking-widest text-primary-foreground shadow-2xl shadow-primary/30 hover:bg-primary/90 disabled:opacity-40"
        >
          Join
          <ArrowRight className="ml-2 size-5 transition-transform group-hover:translate-x-0.5" />
        </Button>
      </form>
    </main>
  );
}

export default function JoinPage() {
  return (
    <Suspense fallback={null}>
      <JoinForm />
    </Suspense>
  );
}
