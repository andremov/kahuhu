import type {
  FinalResults,
  PlayerRole,
  Quiz,
  QuestionResult,
  RoomSnapshot,
} from "@/lib/types";

export type ClientMessage =
  | { type: "host-init"; quiz: Quiz; name: string; role: "host-tv" | "host-player" }
  | { type: "join"; name: string; role: PlayerRole }
  | { type: "start" }
  | { type: "answer"; answerIndex: number }
  | { type: "next" };

export type ServerMessage =
  | { type: "state"; state: RoomSnapshot }
  | { type: "you"; playerId: string; role: PlayerRole }
  | { type: "time"; questionIndex: number; timeRemaining: number }
  | { type: "question-ended"; result: QuestionResult; state: RoomSnapshot }
  | { type: "final"; results: FinalResults; state: RoomSnapshot }
  | { type: "error"; message: string };
