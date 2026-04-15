"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import PartySocket from "partysocket";
import type { ClientMessage, ServerMessage } from "@/party/messages";
import type {
  FinalResults,
  PlayerRole,
  QuestionResult,
  Quiz,
  RoomSnapshot,
} from "./types";

const PARTYKIT_HOST =
  process.env.NEXT_PUBLIC_PARTYKIT_HOST ?? "127.0.0.1:1999";

export interface UsePartyRoomArgs {
  code: string;
  role: PlayerRole;
  name: string;
  initialQuiz?: Quiz | null;
}

export interface RoomView {
  connected: boolean;
  state: RoomSnapshot | null;
  playerId: string | null;
  role: PlayerRole;
  lastResult: QuestionResult | null;
  finalResults: FinalResults | null;
  errorMessage: string | null;
  send: (msg: ClientMessage) => void;
  submitAnswer: (index: number) => void;
  start: () => void;
  next: () => void;
}

export function usePartyRoom({
  code,
  role,
  name,
  initialQuiz,
}: UsePartyRoomArgs): RoomView {
  const [connected, setConnected] = useState(false);
  const [state, setState] = useState<RoomSnapshot | null>(null);
  const [playerId, setPlayerId] = useState<string | null>(null);
  const [effectiveRole, setEffectiveRole] = useState<PlayerRole>(role);
  const [lastResult, setLastResult] = useState<QuestionResult | null>(null);
  const [finalResults, setFinalResults] = useState<FinalResults | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const socketRef = useRef<PartySocket | null>(null);

  useEffect(() => {
    if (!code || !name) return;
    const socket = new PartySocket({
      host: PARTYKIT_HOST,
      room: code,
    });
    socketRef.current = socket;

    const onOpen = () => {
      setConnected(true);
      if (role === "host-tv" || role === "host-player") {
        if (!initialQuiz) {
          setErrorMessage("Host has no quiz to start the room with.");
          return;
        }
        const msg: ClientMessage = {
          type: "host-init",
          quiz: initialQuiz,
          name,
          role,
        };
        socket.send(JSON.stringify(msg));
      } else {
        const msg: ClientMessage = { type: "join", name, role };
        socket.send(JSON.stringify(msg));
      }
    };

    const onMessage = (event: MessageEvent) => {
      let msg: ServerMessage;
      try {
        msg = JSON.parse(event.data);
      } catch {
        return;
      }
      switch (msg.type) {
        case "state":
          setState(msg.state);
          break;
        case "you":
          setPlayerId(msg.playerId);
          setEffectiveRole(msg.role);
          break;
        case "time":
          setState((prev) =>
            prev && prev.currentQuestionIndex === msg.questionIndex
              ? { ...prev, timeRemaining: msg.timeRemaining }
              : prev,
          );
          break;
        case "question-ended":
          setLastResult(msg.result);
          setState(msg.state);
          break;
        case "final":
          setFinalResults(msg.results);
          setState(msg.state);
          break;
        case "error":
          setErrorMessage(msg.message);
          break;
      }
    };

    const onClose = () => setConnected(false);

    socket.addEventListener("open", onOpen);
    socket.addEventListener("message", onMessage);
    socket.addEventListener("close", onClose);

    return () => {
      socket.removeEventListener("open", onOpen);
      socket.removeEventListener("message", onMessage);
      socket.removeEventListener("close", onClose);
      socket.close();
      socketRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [code, name, role]);

  const send = useCallback((msg: ClientMessage) => {
    socketRef.current?.send(JSON.stringify(msg));
  }, []);

  const submitAnswer = useCallback(
    (index: number) => send({ type: "answer", answerIndex: index }),
    [send],
  );

  const start = useCallback(() => send({ type: "start" }), [send]);
  const next = useCallback(() => send({ type: "next" }), [send]);

  return {
    connected,
    state,
    playerId,
    role: effectiveRole,
    lastResult,
    finalResults,
    errorMessage,
    send,
    submitAnswer,
    start,
    next,
  };
}
