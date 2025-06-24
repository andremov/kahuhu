import { Request, Response } from 'express';
import { deleteQuestionFromQuiz } from '../services/quizzes-and-questions';

export default function deleteQuestionEndpoint(req: Request, res: Response) {
  const questionId = req.params.id;

  if (!questionId) {
    console.error('Missing question ID');
    res.status(400).json({ error: 'Missing question ID' });
    return;
  }

  deleteQuestionFromQuiz(questionId)
    .then((deletedQuestion) => {
      if (deletedQuestion) {
        console.log('Question deleted successfully:', deletedQuestion);
        res.status(200).json(deletedQuestion);
      } else {
        console.error('Failed to delete question');
        res.status(404).json({ error: 'Question not found' });
      }
    })
    .catch((error) => {
      console.error('Error deleting question:', error);
      res.status(500).json({ error: 'Internal server error' });
    });
  return;
}
