import { Request, Response } from 'express';
import { getAllQuizzes, getQuizById } from '../services/quizzes-and-questions';

export function getQuizEndpoint(req: Request, res: Response) {
  const quizId = req.params.id;

  if (!quizId) {
    console.error('Missing quiz ID');
    res.status(400).json({ error: 'Missing quiz ID' });

    return;
  }

  getQuizById(quizId)
    .then((quiz) => {
      if (quiz) {
        console.log('Quiz retrieved successfully:', quiz);
        res.status(200).json(quiz);
      } else {
        console.error('Quiz not found');
        res.status(404).json({ error: 'Quiz not found' });
      }
    })
    .catch((error) => {
      console.error('Error retrieving quiz:', error);
      res.status(500).json({ error: 'Internal server error' });
    });

  return;
}

export function getAllQuizzesEndpoint(req: Request, res: Response) {
  getAllQuizzes()
    .then((quizzes) => {
      console.log('All quizzes retrieved successfully:', quizzes);
      res.status(200).json(quizzes);
    })
    .catch((error) => {
      console.error('Error retrieving quizzes:', error);
      res.status(500).json({ error: 'Internal server error' });
    });

  return;
}
