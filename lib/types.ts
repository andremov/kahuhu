export type PlayerRole = "host-tv" | "host-player" | "player";

export type GameState = "lobby" | "question" | "results" | "final";

export interface QuestionOption {
  text: string;
  points: number;
}

export interface Question {
  id: string;
  statement: string;
  options: QuestionOption[];
  timeLimit: number;
}

export interface Quiz {
  id: string;
  title: string;
  description: string;
  questions: Question[];
}

export interface Player {
  id: string;
  name: string;
  role: PlayerRole;
  score: number;
  answers: (number | null)[];
}

export interface QuestionResult {
  questionIndex: number;
  optionResults: (QuestionOption & { count: number })[];
  playerResults: {
    id: string;
    name: string;
    answer: number | null;
    isCorrect: boolean;
    score: number;
  }[];
}

export interface FinalPlayer {
  id: string;
  name: string;
  score: number;
  position: number;
  correctAnswers: number;
}

export interface FinalResults {
  quizTitle: string;
  totalQuestions: number;
  players: FinalPlayer[];
}

export interface RoomSnapshot {
  code: string;
  quizTitle: string;
  quizDescription: string;
  totalQuestions: number;
  currentQuestionIndex: number;
  currentQuestion: Question | null;
  gameState: GameState;
  timeRemaining: number;
  questionEndsAt: number | null;
  players: Array<Pick<Player, "id" | "name" | "role" | "score">>;
  hostId: string | null;
}
