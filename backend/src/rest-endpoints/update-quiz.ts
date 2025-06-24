import { Request, Response } from 'express';
import { updateQuiz } from '../services/quizzes-and-questions';

export default async function updateQuizEndpoint(req: Request, res: Response) {
  const { id } = req.params;
  const { title, description } = req.body;

  if (!id) {
    res.status(400).json({ error: 'Invalid request data' });
    return;
  }

  try {
    const updatedQuiz = await updateQuiz(id, { title, description });

    if (!updatedQuiz) {
      res.status(404).json({ error: 'Quiz not found' });

      return;
    }

    res.status(200).json(updatedQuiz);
  } catch (error) {
    console.error('Error updating quiz:', error);
    res.status(500).json({ error: 'Internal server error' });
  }

  return;
}
