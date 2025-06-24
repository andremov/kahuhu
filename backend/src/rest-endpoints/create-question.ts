import { Request, Response } from 'express';
import { addQuestionToQuiz } from '../services/quizzes-and-questions';

export default function createQuestionEndpoint(req: Request, res: Response) {
  const { quizId, question, answers, correctAnswer, points } = req.body;

  if (!quizId || !question || !answers || correctAnswer === undefined) {
    console.error('Missing required fields:', {
      quizId,
      question,
      answers,
      correctAnswer,
      points,
    });
    res.status(400).json({ error: 'Missing required fields' });
    return;
  }

  addQuestionToQuiz(quizId, question, answers, correctAnswer, points)
    .then((newQuestion) => {
      if (newQuestion) {
        console.log('Question created successfully:', newQuestion);
        res.status(201).json(newQuestion);
      } else {
        console.error('Failed to create question');
        res.status(500).json({ error: 'Failed to create question' });
      }
    })
    .catch((error) => {
      console.error('Error creating question:', error);
      res.status(500).json({ error: 'Internal server error' });
    });
  return;
}
