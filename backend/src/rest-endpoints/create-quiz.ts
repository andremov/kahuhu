import { Request, Response } from 'express';
import { createQuiz } from '../services/quizzes-and-questions';

export default function createQuizEndpoint(req: Request, res: Response) {
  const { title, description } = req.body;

  if (!title || !description) {
    console.error('Missing required fields:', { title, description });
    res.status(400).json({ error: 'Missing required fields' });
    return;
  }

  createQuiz(title, description)
    .then((newQuiz) => {
      if (newQuiz) {
        console.log('Quiz created successfully:', newQuiz);
        res.status(201).json(newQuiz);
      } else {
        console.error('Failed to create quiz');
        res.status(500).json({ error: 'Failed to create quiz' });
      }
    })
    .catch((error) => {
      console.error('Error creating quiz:', error);
      res.status(500).json({ error: 'Internal server error' });
    });

  return;
}
