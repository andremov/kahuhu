import { Quiz } from '../types';

export const sampleQuizzes: Quiz[] = [
  {
    id: 'sample-1',
    title: 'General Knowledge Quiz',
    description: 'Test your knowledge with these fun questions!',
    createdAt: new Date(),
    questions: [
      {
        id: 'q1',
        question: 'What is the capital of France?',
        answers: ['London', 'Berlin', 'Paris', 'Madrid'],
        correctAnswer: 2,
        timeLimit: 20,
        points: 1000,
      },
      {
        id: 'q2',
        question: 'Which planet is known as the Red Planet?',
        answers: ['Venus', 'Mars', 'Jupiter', 'Saturn'],
        correctAnswer: 1,
        timeLimit: 15,
        points: 1000,
      },
      {
        id: 'q3',
        question: 'What is 7 × 8?',
        answers: ['54', '56', '58', '64'],
        correctAnswer: 1,
        timeLimit: 10,
        points: 800,
      },
      {
        id: 'q4',
        question: 'Which ocean is the largest?',
        answers: ['Atlantic', 'Indian', 'Arctic', 'Pacific'],
        correctAnswer: 3,
        timeLimit: 20,
        points: 1000,
      },
      {
        id: 'q5',
        question: 'What year did World War II end?',
        answers: ['1944', '1945', '1946', '1947'],
        correctAnswer: 1,
        timeLimit: 25,
        points: 1200,
      },
    ],
  },
  {
    id: 'sample-2',
    title: 'Science & Nature',
    description: 'Explore the wonders of science and nature!',
    createdAt: new Date(),
    questions: [
      {
        id: 'q1',
        question: 'What is the chemical symbol for water?',
        answers: ['H2O', 'CO2', 'NaCl', 'O2'],
        correctAnswer: 0,
        timeLimit: 15,
        points: 800,
      },
      {
        id: 'q2',
        question: 'How many chambers does a human heart have?',
        answers: ['2', '3', '4', '5'],
        correctAnswer: 2,
        timeLimit: 20,
        points: 1000,
      },
      {
        id: 'q3',
        question: 'What is the fastest land animal?',
        answers: ['Lion', 'Cheetah', 'Horse', 'Antelope'],
        correctAnswer: 1,
        timeLimit: 15,
        points: 900,
      },
    ],
  },
];