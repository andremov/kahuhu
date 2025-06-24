import { Request, Response } from 'express';
import { deleteQuiz } from '../services/quizzes-and-questions';

export default function deleteQuizEndpoint(req: Request, res: Response) {
  const quizId = req.params.id;

  if (!quizId) {
    console.error('Missing quiz ID');
    res.status(400).json({ error: 'Missing quiz ID' });
    return;
  }

  deleteQuiz(quizId)
    .then((deletedQuiz) => {
      if (deletedQuiz) {
        console.log('Quiz deleted successfully:', deletedQuiz);
        res.status(200).json(deletedQuiz);
      } else {
        console.error('Failed to delete quiz');
        res.status(404).json({ error: 'Quiz not found' });
      }
    })
    .catch((error) => {
      console.error('Error deleting quiz:', error);
      res.status(500).json({ error: 'Internal server error' });
    });

  return;
}
