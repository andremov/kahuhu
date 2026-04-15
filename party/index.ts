import type * as Party from "partykit/server";
import type {
  FinalResults,
  GameState,
  Player,
  PlayerRole,
  Quiz,
  Question,
  QuestionResult,
  RoomSnapshot,
} from "../lib/types";
import type { ClientMessage, ServerMessage } from "./messages";

function calculateScore(
  timeRemaining: number,
  totalTime: number,
  basePoints: number,
): number {
  const timeBonus = Math.min(1, timeRemaining / totalTime);
  return Math.round(basePoints * (0.5 + 0.5 * timeBonus));
}

function makeId(): string {
  return Math.random().toString(36).slice(2, 12);
}

interface ServerPlayer extends Player {
  currentQuestionDelta: number;
}

const ACCELERATED_REMAINING_MS = 5000;

export default class GameServer implements Party.Server {
  quiz: Quiz | null = null;
  players: Map<string, ServerPlayer> = new Map();
  hostConnId: string | null = null;
  currentQuestionIndex = 0;
  gameState: GameState = "lobby";
  questionStartedAt = 0;
  questionEndsAt = 0;
  timerHandle: ReturnType<typeof setTimeout> | null = null;
  acceleratedThisQuestion = false;

  constructor(readonly room: Party.Room) {}

  onConnect(conn: Party.Connection) {
    try {
      if (this.quiz) {
        this.sendTo(conn, { type: "state", state: this.buildSnapshot() });
      }
    } catch (err) {
      console.error("[party] onConnect error:", err);
    }
  }

  onError(_conn: Party.Connection, err: Error) {
    console.error("[party] onError:", err);
  }

  onClose(conn: Party.Connection) {
    try {
      const player = this.players.get(conn.id);
      if (!player) return;
      this.players.delete(conn.id);

      if (this.hostConnId === conn.id) {
        this.hostConnId = null;
      }

      if (this.players.size === 0) {
        this.resetRoom();
        return;
      }

      this.broadcastState();
    } catch (err) {
      console.error("[party] onClose error:", err);
    }
  }

  onMessage(message: string, conn: Party.Connection) {
    let parsed: ClientMessage;
    try {
      parsed = JSON.parse(message);
    } catch {
      return;
    }

    try {
      switch (parsed.type) {
        case "host-init":
          this.handleHostInit(conn, parsed.quiz, parsed.name, parsed.role);
          break;
        case "join":
          this.handleJoin(conn, parsed.name, parsed.role);
          break;
        case "start":
          this.handleStart(conn);
          break;
        case "answer":
          this.handleAnswer(conn, parsed.answerIndex);
          break;
        case "next":
          this.handleNext(conn);
          break;
      }
    } catch (err) {
      console.error("[party] onMessage error:", err);
      this.sendTo(conn, {
        type: "error",
        message: "Server error processing message.",
      });
    }
  }

  private handleHostInit(
    conn: Party.Connection,
    quiz: Quiz,
    name: string,
    role: "host-tv" | "host-player",
  ) {
    if (this.quiz && this.hostConnId) {
      this.sendTo(conn, {
        type: "error",
        message: "Room already has a host",
      });
      return;
    }
    this.quiz = quiz;
    this.hostConnId = conn.id;
    this.currentQuestionIndex = 0;
    this.gameState = "lobby";

    const player: ServerPlayer = {
      id: makeId(),
      name: name || "Host",
      role,
      score: 0,
      answers: new Array(quiz.questions.length).fill(null),
      currentQuestionDelta: 0,
    };
    this.players.set(conn.id, player);

    this.sendTo(conn, {
      type: "you",
      playerId: player.id,
      role: player.role,
    });
    this.broadcastState();
  }

  private handleJoin(conn: Party.Connection, name: string, role: PlayerRole) {
    if (!this.quiz) {
      this.sendTo(conn, {
        type: "error",
        message: "Room is not ready — waiting for host.",
      });
      return;
    }
    if (this.gameState !== "lobby") {
      this.sendTo(conn, {
        type: "error",
        message: "Game already in progress.",
      });
      return;
    }

    const effectiveRole: PlayerRole =
      role === "host-tv" || role === "host-player" ? "player" : "player";

    const player: ServerPlayer = {
      id: makeId(),
      name: name || "Player",
      role: effectiveRole,
      score: 0,
      answers: new Array(this.quiz.questions.length).fill(null),
      currentQuestionDelta: 0,
    };
    this.players.set(conn.id, player);

    this.sendTo(conn, {
      type: "you",
      playerId: player.id,
      role: player.role,
    });
    this.broadcastState();
  }

  private handleStart(conn: Party.Connection) {
    if (conn.id !== this.hostConnId || !this.quiz) return;
    if (this.gameState !== "lobby") return;
    this.currentQuestionIndex = 0;
    this.beginQuestion();
  }

  private handleAnswer(conn: Party.Connection, answerIndex: number) {
    if (!this.quiz || this.gameState !== "question") return;
    const player = this.players.get(conn.id);
    if (!player) return;
    if (player.role === "host-tv") return;

    const question = this.quiz.questions[this.currentQuestionIndex];
    if (answerIndex < 0 || answerIndex >= question.options.length) return;

    const basePoints = question.options[answerIndex].points;
    const timeRemaining = Math.max(
      0,
      Math.ceil((this.questionEndsAt - Date.now()) / 1000),
    );
    const newDelta = calculateScore(
      timeRemaining,
      question.timeLimit,
      basePoints,
    );

    player.score -= player.currentQuestionDelta;
    player.score += newDelta;
    player.currentQuestionDelta = newDelta;
    player.answers[this.currentQuestionIndex] = answerIndex;

    const everyoneAnswered = Array.from(this.players.values())
      .filter((p) => p.role !== "host-tv")
      .every((p) => p.answers[this.currentQuestionIndex] !== null);

    if (everyoneAnswered) {
      this.maybeAccelerateTimer();
    }
    this.broadcastState();
  }

  private handleNext(conn: Party.Connection) {
    if (conn.id !== this.hostConnId || !this.quiz) return;
    if (this.gameState !== "results") return;

    const nextIndex = this.currentQuestionIndex + 1;
    if (nextIndex >= this.quiz.questions.length) {
      this.finishGame();
      return;
    }
    this.currentQuestionIndex = nextIndex;
    this.beginQuestion();
  }

  private beginQuestion() {
    if (!this.quiz) return;
    const question = this.quiz.questions[this.currentQuestionIndex];
    this.gameState = "question";
    this.questionStartedAt = Date.now();
    this.questionEndsAt = this.questionStartedAt + question.timeLimit * 1000;
    this.acceleratedThisQuestion = false;
    for (const p of this.players.values()) {
      p.currentQuestionDelta = 0;
    }
    this.broadcastState();
    this.scheduleQuestionEnd(question);
  }

  private maybeAccelerateTimer() {
    if (this.acceleratedThisQuestion) return;
    if (!this.quiz) return;
    const target = Date.now() + ACCELERATED_REMAINING_MS;
    if (target >= this.questionEndsAt) return;
    this.acceleratedThisQuestion = true;
    this.questionEndsAt = target;
    const question = this.quiz.questions[this.currentQuestionIndex];
    this.scheduleQuestionEnd(question);
  }

  private scheduleQuestionEnd(question: Question) {
    this.clearTimer();
    const startIndex = this.currentQuestionIndex;
    const ms = Math.max(0, this.questionEndsAt - Date.now());
    this.timerHandle = setTimeout(() => {
      if (
        this.gameState === "question" &&
        this.currentQuestionIndex === startIndex
      ) {
        this.endQuestion();
      }
    }, ms);
    void question;
  }

  private clearTimer() {
    if (this.timerHandle) {
      clearTimeout(this.timerHandle);
      this.timerHandle = null;
    }
  }

  private endQuestion() {
    if (!this.quiz) return;
    this.clearTimer();
    this.gameState = "results";
    const question = this.quiz.questions[this.currentQuestionIndex];

    const result: QuestionResult = {
      questionIndex: this.currentQuestionIndex,
      optionResults: question.options.map((option, index) => {
        const count = Array.from(this.players.values()).filter(
          (p) =>
            p.role !== "host-tv" &&
            p.answers[this.currentQuestionIndex] === index,
        ).length;
        return { ...option, count };
      }),
      playerResults: Array.from(this.players.values())
        .filter((p) => p.role !== "host-tv")
        .map((p) => {
          const answer = p.answers[this.currentQuestionIndex];
          return {
            id: p.id,
            name: p.name,
            answer,
            isCorrect:
              answer !== null ? question.options[answer].points > 0 : false,
            score: p.score,
          };
        }),
    };

    this.broadcast({
      type: "question-ended",
      result,
      state: this.buildSnapshot(),
    });
  }

  private finishGame() {
    if (!this.quiz) return;
    this.gameState = "final";
    this.clearTimer();

    const sorted = Array.from(this.players.values())
      .filter((p) => p.role !== "host-tv")
      .sort((a, b) => b.score - a.score);

    const results: FinalResults = {
      quizTitle: this.quiz.title,
      totalQuestions: this.quiz.questions.length,
      players: sorted.map((p, idx) => ({
        id: p.id,
        name: p.name,
        score: p.score,
        position: idx + 1,
        correctAnswers: p.answers.filter(
          (answer, qIdx) =>
            answer !== null &&
            this.quiz!.questions[qIdx].options[answer].points > 0,
        ).length,
      })),
    };

    this.broadcast({
      type: "final",
      results,
      state: this.buildSnapshot(),
    });
  }

  private resetRoom() {
    this.clearTimer();
    this.quiz = null;
    this.players.clear();
    this.hostConnId = null;
    this.currentQuestionIndex = 0;
    this.gameState = "lobby";
    this.questionStartedAt = 0;
    this.questionEndsAt = 0;
  }

  private buildSnapshot(): RoomSnapshot {
    const hostPlayer = this.hostConnId
      ? this.players.get(this.hostConnId)
      : null;
    const timeRemaining =
      this.gameState === "question"
        ? Math.max(0, Math.ceil((this.questionEndsAt - Date.now()) / 1000))
        : 0;
    return {
      code: this.room.id,
      quizTitle: this.quiz?.title ?? "",
      quizDescription: this.quiz?.description ?? "",
      totalQuestions: this.quiz?.questions.length ?? 0,
      currentQuestionIndex: this.currentQuestionIndex,
      currentQuestion: this.quiz
        ? this.quiz.questions[this.currentQuestionIndex] ?? null
        : null,
      gameState: this.gameState,
      timeRemaining,
      questionEndsAt: this.gameState === "question" ? this.questionEndsAt : null,
      hostId: hostPlayer?.id ?? null,
      players: Array.from(this.players.values()).map((p) => ({
        id: p.id,
        name: p.name,
        role: p.role,
        score: p.score,
      })),
    };
  }

  private broadcastState() {
    this.broadcast({ type: "state", state: this.buildSnapshot() });
  }

  private broadcast(msg: ServerMessage) {
    this.room.broadcast(JSON.stringify(msg));
  }

  private sendTo(conn: Party.Connection, msg: ServerMessage) {
    conn.send(JSON.stringify(msg));
  }
}
