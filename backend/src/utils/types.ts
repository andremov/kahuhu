import { Temporal } from '@js-temporal/polyfill';

export interface Game {
  id: string;
  code: string;
  quizId: string;
  quizData?: Quiz & { questions: Question[] };
  players: Player[];
  hostId: string;
  currentQuestionIndex: number;
  gameState: 'lobby' | 'question' | 'results' | 'final';
  timeRemaining: number;
  questionStartTime: Temporal.PlainDateTime | null;
  createdAt: Temporal.PlainDateTime;
}

export interface Player {
  id: string;
  name: string;
  socketId: string;
  score: number;
  answers: (null | number)[];
  joinedAt: Temporal.PlainDateTime;
  gameCode: string;
}

export interface Quiz {
  id: string;
  title: string;
  description: string;
  questions: Question[];
}

export interface Question {
  id: string;
  parentQuiz: string;
  statement: string;
  options: string[];
  correctAnswer: number;
  points: number;
}
