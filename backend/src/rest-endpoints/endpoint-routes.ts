import { Router } from 'express';
import createQuizEndpoint from './create-quiz';
import createQuestionEndpoint from './create-question';
import deleteQuizEndpoint from './delete-quiz';
import deleteQuestionEndpoint from './delete-question';
import updateQuizEndpoint from './update-quiz';
import updateQuestionEndpoint from './update-question';
import { getQuestionsByQuizEndpoint, getQuestionEndpoint } from './get-question';
import { getQuizEndpoint, getAllQuizzesEndpoint } from './get-quiz';

const router = Router();

router.post('/create-quiz', createQuizEndpoint);
router.post('/create-question', createQuestionEndpoint);

router.delete('/delete-quiz/:id', deleteQuizEndpoint);
router.delete('/delete-question/:id', deleteQuestionEndpoint);

router.patch('/update-quiz/:id', updateQuizEndpoint);
router.patch('/update-question/:id', updateQuestionEndpoint);

router.get('/get-all-quizzes', getAllQuizzesEndpoint);
router.get('/get-quiz/:id', getQuizEndpoint);
router.get('/get-question/:id', getQuestionEndpoint);
router.get('/get-quiz-questions/:quizId', getQuestionsByQuizEndpoint);

export default router;
