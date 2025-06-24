import { Request, Response } from 'express';
import { getQuestionById, getQuestionsForQuiz } from '../services/quizzes-and-questions';

export function getQuestionEndpoint(req: Request, res: Response) {
  const questionId = req.params.id;

  if (!questionId) {
    console.error('Missing question ID');
    res.status(400).json({ error: 'Missing question ID' });
    return;
  }

  getQuestionById(questionId)
    .then((question) => {
      if (question) {
        console.log('Question retrieved successfully:', question);
        res.status(200).json(question);
      } else {
        console.error('Question not found');
        res.status(404).json({ error: 'Question not found' });
      }
    })
    .catch((error) => {
      console.error('Error retrieving question:', error);
      res.status(500).json({ error: 'Internal server error' });
    });

  return;
}

// endpoint to get all questions for a quiz

export function getQuestionsByQuizEndpoint(req: Request, res: Response) {
  const quizId = req.params.quizId;

  if (!quizId) {
    console.error('Missing quiz ID');
    res.status(400).json({ error: 'Missing quiz ID' });
    return;
  }

  getQuestionsForQuiz(quizId)
    .then((questions) => {
      if (questions && questions.length > 0) {
        console.log('Questions retrieved successfully:', questions);
        res.status(200).json(questions);
      } else {
        console.error('No questions found for this quiz');
        res.status(404).json({ error: 'No questions found for this quiz' });
      }
    })
    .catch((error) => {
      console.error('Error retrieving questions:', error);
      res.status(500).json({ error: 'Internal server error' });
    });

  return;
}
