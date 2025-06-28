import { Server } from 'socket.io';
import { Game } from './types';
import { Temporal } from '@js-temporal/polyfill';
import { getGameState } from '../services/games';

export const calculateScore = (
  isCorrect: boolean,
  timeRemaining: number,
  totalTime: number,
  basePoints: number
) => {
  if (!isCorrect) return 0;

  const timeBonus = Math.max(0, timeRemaining / totalTime);
  return Math.round(basePoints * (0.5 + 0.5 * timeBonus));
};

export const handleQuestionEnd = (io: Server, game: Game) => {
  game.gameState = 'results';

  const currentQuestion = game.quizData!.questions[game.currentQuestionIndex];
  const questionResults = {
    questionIndex: game.currentQuestionIndex,
    // correctAnswer: currentQuestion.correctAnswer,
    // correctAnswerText: currentQuestion.options[currentQuestion.correctAnswer],
    playerResults: Array.from(game.players.values()).map((player) => ({
      id: player.id,
      name: player.name,
      answer: player.answers[game.currentQuestionIndex],
      // isCorrect: player.answers[game.currentQuestionIndex] === currentQuestion.correctAnswer,
      score: player.score,
    })),
  };

  io.to(game.code).emit('question-ended', questionResults);

  // Auto-advance to next question after 5 seconds
  setTimeout(() => {
    if (game.gameState === 'results') {
      if (game.currentQuestionIndex + 1 >= game.quizData!.questions.length) {
        // Game over
        game.gameState = 'final';
        const finalResults = getFinalResults(game);
        io.to(game.code).emit('game-ended', finalResults);
      } else {
        // Next question
        game.currentQuestionIndex++;
        game.gameState = 'question';
        game.timeRemaining = 60;
        game.questionStartTime = Temporal.Now.plainDateTimeISO();

        const gameState = getGameState(game);
        io.to(game.code).emit('next-question', gameState);

        // Start next question timer
        const questionTimer = setInterval(() => {
          game.timeRemaining--;

          if (game.timeRemaining <= 0) {
            clearInterval(questionTimer);
            handleQuestionEnd(io, game);
          } else {
            io.to(game.code).emit('time-update', {
              timeRemaining: game.timeRemaining,
            });
          }
        }, 1000);
      }
    }
  }, 5000);
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
      // correctAnswers: player.answers.filter(
      //   (answer, qIndex) => answer === game.quizData!.questions[qIndex].correctAnswer
      // ).length,
    })),
  };
};
