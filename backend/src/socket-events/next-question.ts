import { Server, Socket } from 'socket.io';
import {
  getGameByCode,
  getGameByHostSocketId,
  getGameState,
  getPlayerBySocketId,
} from '../services/games';
import { getFinalResults, handleQuestionEnd } from '../utils/functions';
import { Temporal } from '@js-temporal/polyfill';

export default function nextQuestionSocketEvent(io: Server, socket: Socket) {
  try {
    const game = getGameByHostSocketId(socket.id);
    if (!game || game.hostId !== socket.id) return;

    if (game.currentQuestionIndex + 1 >= game.quizData.questions.length) {
      // Game over
      game.gameState = 'final';
      const finalResults = getFinalResults(game);
      io.to(game.code).emit('game-ended', finalResults);
    } else {
      // Next question
      game.currentQuestionIndex++;

      const currentQuestion = game.quizData.questions[game.currentQuestionIndex];
      console.log(currentQuestion.statement, currentQuestion.timeLimit);

      game.gameState = 'question';
      game.timeRemaining = currentQuestion.timeLimit + 3;
      game.questionStartTime = Temporal.Now.plainDateTimeISO();

      const gameState = getGameState(game);
      io.to(game.code).emit('next-question', gameState);

      const gameCopy = JSON.parse(JSON.stringify(game)); // Deep copy to avoid mutation

      // Start next question timer
      const questionTimer = setInterval(() => {
        gameCopy.timeRemaining--;

        if (gameCopy.timeRemaining <= 0) {
          clearInterval(questionTimer);
          handleQuestionEnd(io, game);
        } else {
          io.to(gameCopy.code).emit('time-update', {
            questionIndex: gameCopy.currentQuestionIndex,
            timeRemaining: gameCopy.timeRemaining,
          });
        }
      }, 1000);
    }
  } catch (error) {
    console.error('Error in nextQuestionSocketEvent:', error);
    socket.emit('error', { message: 'Failed to proceed to next question' });
  }
}
