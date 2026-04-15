"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { RoomSnapshot } from "@/lib/types";
import { Users, Copy, Check } from "lucide-react";
import { useState } from "react";

interface Props {
  state: RoomSnapshot;
  isHost: boolean;
  onStart: () => void;
}

export default function Lobby({ state, isHost, onStart }: Props) {
  const [copied, setCopied] = useState(false);

  const copy = () => {
    navigator.clipboard.writeText(state.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const playingCount = state.players.filter((p) => p.role !== "host-tv").length;

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col items-center gap-10 px-6 py-12">
      <div className="flex flex-col items-center gap-3 text-center">
        <p className="text-sm font-semibold tracking-[0.3em] text-muted-foreground uppercase">
          {state.quizTitle || "Waiting for quiz…"}
        </p>
        <button
          onClick={copy}
          className="group flex items-center gap-3 rounded-2xl bg-card/80 px-8 py-4 text-5xl font-black tracking-[0.25em] backdrop-blur hover:bg-card"
        >
          {state.code}
          {copied ? (
            <Check className="size-6 text-emerald-400" />
          ) : (
            <Copy className="size-6 text-muted-foreground group-hover:text-foreground" />
          )}
        </button>
        <p className="text-sm text-muted-foreground">
          Share this code. Players join at <b>/join</b>.
        </p>
      </div>

      <Card className="w-full p-6">
        <div className="mb-4 flex items-center gap-2 text-sm text-muted-foreground">
          <Users className="size-4" />
          {playingCount} player{playingCount === 1 ? "" : "s"} in the room
        </div>
        {state.players.length === 0 ? (
          <p className="text-center text-muted-foreground">
            Waiting for players to join…
          </p>
        ) : (
          <ul className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {state.players.map((p) => (
              <li
                key={p.id}
                className="truncate rounded-lg bg-background/50 px-3 py-2 text-sm"
              >
                {p.name}
                {p.role === "host-tv" ? (
                  <span className="ml-1 text-xs text-muted-foreground">
                    (TV)
                  </span>
                ) : p.role === "host-player" ? (
                  <span className="ml-1 text-xs text-muted-foreground">
                    (host)
                  </span>
                ) : null}
              </li>
            ))}
          </ul>
        )}
      </Card>

      {isHost ? (
        <Button
          size="lg"
          onClick={onStart}
          disabled={playingCount === 0}
          className="h-14 w-full max-w-sm text-base"
        >
          Start game
        </Button>
      ) : (
        <p className="text-sm text-muted-foreground">
          Waiting for the host to start…
        </p>
      )}
    </div>
  );
}
