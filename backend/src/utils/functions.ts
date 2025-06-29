import { Server } from 'socket.io';
import { Game, QuestionResult } from './types';
import { Temporal } from '@js-temporal/polyfill';
import { getGameState } from '../services/games';

export const calculateScore = (timeRemaining: number, totalTime: number, basePoints: number) => {
  const timeBonus = Math.min(1, timeRemaining / totalTime);
  return Math.round(basePoints * (0.5 + 0.5 * timeBonus));
};

export const handleQuestionEnd = (io: Server, game: Game) => {
  game.gameState = 'results';

  const currentQuestion = game.quizData!.questions[game.currentQuestionIndex];
  const questionResults: QuestionResult = {
    questionIndex: game.currentQuestionIndex,
    optionResults: currentQuestion.options.map((option, index) => {
      const playersWithAnswer = Array.from(game.players.values()).filter(
        (player) => player.answers[game.currentQuestionIndex] === index
      );
      return { ...option, count: playersWithAnswer.length };
    }),
    playerResults: Array.from(game.players.values()).map((player) => {
      const playerAnswer = player.answers[game.currentQuestionIndex];
      return {
        id: player.id,
        name: player.name,
        answer: player.answers[game.currentQuestionIndex],
        isCorrect: playerAnswer === null ? false : currentQuestion.options[playerAnswer].points > 0,
        score: player.score,
      };
    }),
  };

  io.to(game.code).emit('question-ended', questionResults);
};

export const getFinalResults = (game: Game) => {
  const sortedPlayers = Array.from(game.players.values()).sort((a, b) => b.score - a.score);

  return {
    quiz: {
      title: game.quizData!.title,
      totalQuestions: game.quizData!.questions.length,
    },
    players: sortedPlayers.map((player, index) => ({
      id: player.id,
      name: player.name,
      score: player.score,
      position: index + 1,
      correctAnswers: player.answers.filter(
        (answer, qIndex) =>
          answer !== null && game.quizData.questions[qIndex].options[answer].points > 0
      ).length,
    })),
  };
};
