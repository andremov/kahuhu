import axios from 'axios';

const API_URL = 'https://your-api-url.com/api'; // Replace with your actual API URL

export const fetchQuizzes = async () => {
  try {
    const response = await axios.get(`${API_URL}/quizzes`);
    return response.data;
  } catch (error) {
    throw new Error('Error fetching quizzes');
  }
};

export const submitAnswer = async (quizId, answer) => {
  try {
    const response = await axios.post(`${API_URL}/quizzes/${quizId}/answers`, { answer });
    return response.data;
  } catch (error) {
    throw new Error('Error submitting answer');
  }
};