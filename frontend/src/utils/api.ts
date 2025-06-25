import axios from 'axios';
import { getConfigValue } from './config';
import { Quiz } from './types';

// create the base axios instance
const api = axios.create({
  baseURL: getConfigValue('apiAddress'),
  headers: {
    'Content-Type': 'application/json',
  },
});

export const fetchQuizzes = async () => {
  try {
    const response = await api.get('/api/get-all-quizzes');
    return response.data as Quiz[];
  } catch (error) {
    console.error('Error fetching quizzes:', error);
    throw error;
  }
};

export const fetchQuizById = async (id: string) => {
  try {
    const response = await api.get(`/api/get-quiz/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching quiz with id ${id}:`, error);
    throw error;
  }
};

export const requestCreateQuiz = async (title: string, description: string) => {
  try {
    const response = await api.post('/api/create-quiz', { title, description });
    return response.data;
  } catch (error) {
    console.error('Error creating quiz:', error);
    throw error;
  }
};

export const requestCreateQuestion = async (
  quizId: string,
  question: string,
  options: string[],
  answer: string
) => {
  try {
    const response = await api.post('/api/create-question', {
      quizId,
      question,
      options,
      answer,
    });
    return response.data;
  } catch (error) {
    console.error('Error creating question:', error);
    throw error;
  }
};
