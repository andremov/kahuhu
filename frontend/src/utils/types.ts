export interface Question {
  id: string;
  question: string;
  answers: string[];
  correctAnswer: number;
  timeLimit: number;
  points: number;
}

export interface Quiz {
  id: string;
  title: string;
  description: string;
  questions: Question[];
  createdAt?: Date;
}

export interface Player {
  id: string;
  name: string;
  score: number;
  joinedAt: Date;
}

export interface GameState {
  id: string;
  code: string;
  quiz: Quiz;
  players: Player[];
  currentQuestionIndex: number;
  gameState: 'lobby' | 'question' | 'results' | 'final';
  timeRemaining: number;
}

export interface QuestionResult {
  questionIndex: number;
  correctAnswer: number;
  correctAnswerText: string;
  playerResults: PlayerResult[];
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