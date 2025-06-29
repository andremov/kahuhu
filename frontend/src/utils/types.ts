import { Temporal } from '@js-temporal/polyfill';

export interface Question {
  id: string;
  statement: string;
  options: QuestionOption[];
  timeLimit: number;
}

export interface QuestionOption {
  text: string;
  points: number;
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
  score: number;
  joinedAt: Temporal.PlainDateTime;
}

export interface Game {
  id: string;
  code: string;
  quizId: string;
  quizData: Quiz;
  players: Player[];
  hostId: string;
  currentQuestionIndex: number;
  gameState: 'lobby' | 'question' | 'results' | 'final';
  timeRemaining: number;
  questionStartTime: Temporal.PlainDateTime | null;
  createdAt: Temporal.PlainDateTime;
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

export interface PlayerResult {
  id: string;
  name: string;
  answer: number | null;
  isCorrect: boolean;
  score: number;
}

export interface FinalResults {
  quiz: {
    title: string;
    totalQuestions: number;
  };
  players: FinalPlayerResult[];
}

export interface FinalPlayerResult {
  id: string;
  name: string;
  score: number;
  position: number;
  correctAnswers: number;
}
