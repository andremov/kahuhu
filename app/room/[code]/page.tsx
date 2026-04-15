"use client";

import { use, useEffect, useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { usePartyRoom } from "@/lib/party";
import { useHostStaging } from "@/lib/store";
import type { PlayerRole } from "@/lib/types";
import Lobby from "@/components/room/lobby";
import QuestionScreen from "@/components/room/question-screen";
import QuestionResultsScreen from "@/components/room/question-results-screen";
import FinalScreen from "@/components/room/final-screen";

export default function RoomPage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = use(params);
  const searchParams = useSearchParams();
  const router = useRouter();

  const roleParam = (searchParams.get("role") ?? "player") as PlayerRole;
  const nameParam = searchParams.get("name") ?? "";
  const stagedQuiz = useHostStaging((s) => s.stagedQuiz);
  const setStagedQuiz = useHostStaging((s) => s.setStagedQuiz);

  const initialQuiz = useMemo(() => {
    if (roleParam === "host-tv" || roleParam === "host-player") {
      return stagedQuiz;
    }
    return null;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const isHostRole = roleParam === "host-tv" || roleParam === "host-player";

  useEffect(() => {
    if (isHostRole && !stagedQuiz && !initialQuiz) {
      router.replace("/host");
    }
  }, [isHostRole, stagedQuiz, initialQuiz, router]);

  useEffect(() => {
    return () => {
      if (isHostRole) setStagedQuiz(null);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const room = usePartyRoom({
    code,
    role: roleParam,
    name: nameParam,
    initialQuiz,
  });

  if (!nameParam) {
    return (
      <main className="flex flex-1 items-center justify-center p-8 text-center">
        <div className="flex flex-col gap-2">
          <p className="font-display text-lg font-bold">Missing name</p>
          <p className="text-sm text-muted-foreground">
            Go back and enter a name first.
          </p>
        </div>
      </main>
    );
  }

  if (isHostRole && !initialQuiz) {
    return null;
  }

  if (room.errorMessage) {
    return (
      <main className="flex flex-1 items-center justify-center p-8 text-center">
        <div className="flex flex-col gap-2">
          <p className="font-display text-lg font-bold text-destructive">
            {room.errorMessage}
          </p>
          <p className="text-sm text-muted-foreground">
            Double-check the room code and try again.
          </p>
        </div>
      </main>
    );
  }

  if (!room.connected || !room.state) {
    return (
      <main className="flex flex-1 items-center justify-center p-8 text-center">
        <div className="flex flex-col items-center gap-3 text-muted-foreground">
          <Loader2 className="size-8 animate-spin text-primary" />
          <p className="font-display text-xs font-semibold uppercase tracking-widest">
            Connecting to room…
          </p>
        </div>
      </main>
    );
  }

  const state = room.state;
  const isHostClient = state.hostId !== null && state.hostId === room.playerId;

  const myPlayer = state.players.find((p) => p.id === room.playerId);
  const myAnswer =
    state.gameState === "question" && myPlayer
      ? null // server owns real truth; track locally via lastResult if needed
      : null;

  // Optimistic local answer tracking
  const localAnswered =
    typeof window !== "undefined"
      ? sessionStorage.getItem(
          `kahuhu-answer-${state.code}-${state.currentQuestionIndex}`,
        )
      : null;
  const localMyAnswer = localAnswered !== null ? Number(localAnswered) : null;

  const handleAnswer = (index: number) => {
    sessionStorage.setItem(
      `kahuhu-answer-${state.code}-${state.currentQuestionIndex}`,
      String(index),
    );
    room.submitAnswer(index);
  };

  const transition = { duration: 0.35, ease: "easeInOut" as const };
  const variants = {
    initial: { opacity: 0, y: 16 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -16 },
  };

  return (
    <main className="flex flex-1 flex-col">
      <AnimatePresence mode="wait">
        {state.gameState === "lobby" && (
          <motion.div
            key="lobby"
            initial="initial"
            animate="animate"
            exit="exit"
            variants={variants}
            transition={transition}
            className="flex flex-1 flex-col"
          >
            <Lobby state={state} isHost={isHostClient} onStart={room.start} />
          </motion.div>
        )}
        {state.gameState === "question" && (
          <motion.div
            key={`question-${state.currentQuestionIndex}`}
            initial="initial"
            animate="animate"
            exit="exit"
            variants={variants}
            transition={transition}
            className="flex flex-1 flex-col"
          >
            <QuestionScreen
              state={state}
              role={room.role}
              myAnswer={localMyAnswer ?? myAnswer}
              onAnswer={handleAnswer}
            />
          </motion.div>
        )}
        {state.gameState === "results" && (
          <motion.div
            key={`results-${state.currentQuestionIndex}`}
            initial="initial"
            animate="animate"
            exit="exit"
            variants={variants}
            transition={transition}
            className="flex flex-1 flex-col"
          >
            {room.lastResult ? (
              <QuestionResultsScreen
                state={state}
                result={room.lastResult}
                isHost={isHostClient}
                onNext={room.next}
                myPlayerId={room.playerId}
              />
            ) : (
              <p className="p-8 text-center text-muted-foreground">
                Tallying results…
              </p>
            )}
          </motion.div>
        )}
        {state.gameState === "final" && (
          <motion.div
            key="final"
            initial="initial"
            animate="animate"
            exit="exit"
            variants={variants}
            transition={transition}
            className="flex flex-1 flex-col"
          >
            {room.finalResults ? (
              <FinalScreen
                results={room.finalResults}
                myPlayerId={room.playerId}
              />
            ) : (
              <p className="p-8 text-center text-muted-foreground">
                Loading final scores…
              </p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
