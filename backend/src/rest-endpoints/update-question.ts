import { Request, Response } from 'express';
import { updateQuestionInQuiz } from '../services/quizzes-and-questions';

export default async function updateQuestionEndpoint(req: Request, res: Response) {
  const { id } = req.params;
  const { question, answers, correctAnswer, points } = req.body;

  if (!id) {
    res.status(400).json({ error: 'Invalid request data' });
    return;
  }

  try {
    const updatedQuestion = await updateQuestionInQuiz(id, {
      question,
      answers,
      correctAnswer,
      points,
    });

    if (!updatedQuestion) {
      res.status(404).json({ error: 'Question not found' });
      return;
    }

    res.status(200).json(updatedQuestion);
  } catch (error) {
    console.error('Error updating question:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
