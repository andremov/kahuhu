"use client";

import { AnimatePresence, motion } from "framer-motion";
import { QRCodeSVG } from "qrcode.react";
import { Check, Copy, Crown, Play, Tv, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import type { RoomSnapshot } from "@/lib/types";
import { cn } from "@/lib/utils";

interface Props {
  state: RoomSnapshot;
  isHost: boolean;
  onStart: () => void;
}

const AVATAR_COLORS = [
  "bg-answer-1 text-answer-1-foreground",
  "bg-answer-2 text-answer-2-foreground",
  "bg-answer-3 text-answer-3-foreground",
  "bg-answer-4 text-answer-4-foreground",
  "bg-primary text-primary-foreground",
  "bg-accent text-accent-foreground",
];

function colorForId(id: string): string {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = (hash << 5) - hash + id.charCodeAt(i);
    hash |= 0;
  }
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

function initials(name: string): string {
  const parts = name.trim().split(/\s+/).slice(0, 2);
  return parts.map((p) => p[0]?.toUpperCase() ?? "").join("") || "?";
}

export default function Lobby({ state, isHost, onStart }: Props) {
  const [copied, setCopied] = useState(false);
  const [joinUrl, setJoinUrl] = useState("");

  useEffect(() => {
    if (typeof window === "undefined") return;
    const url = new URL("/join", window.location.origin);
    url.searchParams.set("code", state.code);
    setJoinUrl(url.toString());
  }, [state.code]);

  const copy = () => {
    navigator.clipboard.writeText(state.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const playingCount = state.players.filter((p) => p.role !== "host-tv").length;

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col items-center gap-10 px-6 py-12">
      <motion.p
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="font-display text-sm font-semibold uppercase tracking-[0.4em] text-muted-foreground"
      >
        {state.quizTitle || "Waiting for quiz…"}
      </motion.p>

      <div className="grid w-full items-center gap-8 sm:grid-cols-[1fr_auto]">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="flex flex-col items-center gap-4 text-center sm:items-start sm:text-left"
        >
          <span className="font-display text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            Room code
          </span>
          <button
            onClick={copy}
            className="group relative -mx-2"
            aria-label="Copy room code"
          >
            <span className="kahuhu-glow block font-display text-7xl font-bold tracking-[0.15em] tabular-nums sm:text-8xl md:text-9xl">
              <span className="bg-gradient-to-r from-primary via-accent to-answer-3 bg-clip-text text-transparent">
                {state.code}
              </span>
            </span>
            <span className="mt-2 flex items-center justify-center gap-2 text-sm text-muted-foreground group-hover:text-foreground sm:justify-start">
              {copied ? (
                <>
                  <Check className="size-4 text-answer-2" />
                  <span>Copied</span>
                </>
              ) : (
                <>
                  <Copy className="size-4" />
                  <span>Tap to copy</span>
                </>
              )}
            </span>
          </button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: "easeOut", delay: 0.15 }}
          className="flex flex-col items-center gap-2 rounded-2xl bg-white p-4 shadow-2xl shadow-primary/20"
        >
          {joinUrl && (
            <QRCodeSVG
              value={joinUrl}
              size={144}
              level="M"
              marginSize={0}
              fgColor="#0f0b1d"
            />
          )}
          <span className="font-display text-[10px] font-bold uppercase tracking-widest text-black/60">
            Scan to join
          </span>
        </motion.div>
      </div>

      <div className="w-full rounded-3xl border border-white/10 bg-card/60 p-6 backdrop-blur-xl">
        <div className="mb-4 flex items-center gap-2 font-display text-sm uppercase tracking-widest text-muted-foreground">
          <Users className="size-4" />
          {playingCount} player{playingCount === 1 ? "" : "s"}
        </div>
        {state.players.length === 0 ? (
          <p className="py-8 text-center text-muted-foreground">
            Waiting for players to join…
          </p>
        ) : (
          <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
            <AnimatePresence initial={false}>
              {state.players.map((p) => {
                const isHostTv = p.role === "host-tv";
                const isHostPlayer = p.role === "host-player";
                return (
                  <motion.li
                    key={p.id}
                    layout
                    initial={{ opacity: 0, scale: 0.6, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.6 }}
                    transition={{
                      type: "spring",
                      stiffness: 320,
                      damping: 22,
                    }}
                    className="flex items-center gap-3 rounded-xl bg-background/50 p-3"
                  >
                    <div
                      className={cn(
                        "flex size-10 shrink-0 items-center justify-center rounded-lg font-display text-sm font-bold",
                        colorForId(p.id),
                      )}
                    >
                      {isHostTv ? (
                        <Tv className="size-5" />
                      ) : (
                        initials(p.name)
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="flex items-center gap-1 truncate text-sm font-semibold">
                        {p.name}
                        {isHostPlayer && (
                          <Crown className="size-3.5 text-answer-3" />
                        )}
                      </p>
                      {isHostTv && (
                        <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                          TV display
                        </p>
                      )}
                    </div>
                  </motion.li>
                );
              })}
            </AnimatePresence>
          </ul>
        )}
      </div>

      {isHost ? (
        <Button
          size="lg"
          onClick={onStart}
          disabled={playingCount === 0}
          className="group h-16 w-full max-w-md rounded-full bg-primary font-display text-lg font-bold uppercase tracking-widest text-primary-foreground shadow-2xl shadow-primary/40 hover:bg-primary/90 disabled:opacity-40"
        >
          <Play className="mr-2 size-5 fill-current transition-transform group-hover:translate-x-0.5" />
          Start game
        </Button>
      ) : (
        <p className="font-display text-sm uppercase tracking-widest text-muted-foreground">
          Waiting for the host…
        </p>
      )}
    </div>
  );
}
