export interface Question {
  id: string;
  text: string;
  answers: string[];
  correctAnswer: string;
  timeLimit: number;
}

export interface Quiz {
  id: string;
  title: string;
  questions: Question[];
  createdAt: string;
}
