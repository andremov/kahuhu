import { Schema, model } from 'mongoose';
import { Question, Quiz } from '../utils/types';

// MODELS AND SCHEMAS

const QuestionSchema = new Schema(
  {
    parentQuiz: { type: Schema.Types.ObjectId, ref: 'Quiz', required: true },
    statement: { type: String, required: true },
    options: [{ type: String, required: true }],
    correctAnswer: { type: Number, required: true },
    points: { type: Number, default: 100 },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

const QuizSchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

const Quiz = model('Quiz', QuizSchema);
const Question = model('Question', QuestionSchema);

export { Quiz, Question };

// GET QUIZZES AND QUESTIONS
export async function getQuizById(quizId: string) {
  try {
    const quiz: Quiz | null = await Quiz.findById(quizId);

    if (!quiz) {
      console.error('Quiz not found');
      return null;
    }

    const questions: Question[] = await Question.find({ parentQuiz: quizId });

    return { ...JSON.parse(JSON.stringify(quiz)), questions };
  } catch (error) {
    console.error(`Failed to get quiz by ID ${quizId}:`, error);
  }
  return null;
}

export async function getAllQuizzes() {
  try {
    const quizzes: Quiz[] = await Quiz.find();

    return quizzes;
  } catch (error) {
    console.error('Failed to get all quizzes:', error);
  }
  return null;
}

export async function getQuestionsForQuiz(quizId: string) {
  try {
    const questions: Question[] = await Question.find({ parentQuiz: quizId });

    return questions;
  } catch (error) {
    console.error(`Failed to get questions for quiz ${quizId}:`, error);
  }
  return null;
}

export async function getQuestionById(questionId: string) {
  try {
    const question: Question | null = await Question.findById(questionId);

    if (!question) {
      console.error('Question not found');
    }

    return question;
  } catch (error) {
    console.error(`Failed to get question by ID ${questionId}:`, error);
  }
  return null;
}

// CREATE QUIZZES AND QUESTIONS
export async function createQuiz(title: string, description: string) {
  try {
    const quiz = new Quiz({ title, description });
    await quiz.save();
    return quiz;
  } catch (error) {
    console.error('Failed to create quiz:', error);
  }
  return null;
}

export async function addQuestionToQuiz(
  parentQuiz: string,
  statement: string,
  options: string[],
  correctAnswer: number,
  points: number = 100
) {
  try {
    const quiz = await Quiz.findById(parentQuiz);

    if (!quiz) {
      console.error('Quiz not found');
    }

    const newQuestion = new Question({
      parentQuiz,
      statement,
      options,
      correctAnswer,
      points,
    });

    await newQuestion.save();
    return newQuestion;
  } catch (error) {
    console.error(`Failed to add question to quiz ${parentQuiz}:`, error);
  }
  return null;
}

// DELETE QUIZZES AND QUESTIONS
export async function deleteQuiz(quizId: string) {
  try {
    const quiz = await Quiz.findByIdAndDelete(quizId);

    if (!quiz) {
      console.error('Quiz not found');
    }

    await Question.deleteMany({ parentQuiz: quizId });
    return quiz;
  } catch (error) {
    console.error(`Failed to delete quiz ${quizId}:`, error);
  }
  return null;
}

export async function deleteQuestionFromQuiz(questionId: string) {
  try {
    const question = await Question.findByIdAndDelete(questionId);

    if (!question) {
      console.error('Question not found');
    }

    return question;
  } catch (error) {
    console.error(`Failed to delete question ${questionId}:`, error);
  }
  return null;
}

// UPDATE QUIZZES AND QUESTIONS
export async function updateQuiz(
  quizId: string,
  updates: Partial<{ title: string; description: string }>
) {
  try {
    const quiz = await Quiz.findByIdAndUpdate(quizId, updates, {
      new: true,
    });

    if (!quiz) {
      console.error('Quiz not found');
    }

    return quiz;
  } catch (error) {
    console.error(`Failed to update quiz ${quizId}:`, error);
  }
  return null;
}

export async function updateQuestionInQuiz(
  questionId: string,
  updates: Partial<{
    question: string;
    answers: string[];
    correctAnswer: number;
    points: number;
  }>
) {
  try {
    const question = await Question.findByIdAndUpdate(questionId, updates, {
      new: true,
    });

    if (!question) {
      console.error('Question not found');
    }

    return question;
  } catch (error) {
    console.error(`Failed to update question ${questionId}:`, error);
  }
  return null;
}
