import { Server, Socket } from 'socket.io';
import { getGameByCode, getGameState, getPlayerBySocketId } from '../services/games';
import { getFinalResults, handleQuestionEnd } from '../utils/functions';
import { Temporal } from '@js-temporal/polyfill';

export default function nextQuestionSocketEvent(io: Server, socket: Socket) {
  try {
    const playerInfo = getPlayerBySocketId(socket.id);
    if (!playerInfo) return;

    const game = getGameByCode(playerInfo.gameCode);
    if (!game || game.hostId !== socket.id) return;

    if (game.currentQuestionIndex + 1 >= game.quizData!.questions.length) {
      // Game over
      game.gameState = 'final';
      const finalResults = getFinalResults(game);
      io.to(playerInfo.gameCode).emit('game-ended', finalResults);
    } else {
      // Next question
      game.currentQuestionIndex++;
      game.gameState = 'question';
      game.timeRemaining = 60;
      game.questionStartTime = Temporal.Now.plainDateTimeISO();

      const gameState = getGameState(game);
      io.to(playerInfo.gameCode).emit('next-question', gameState);

      // Start next question timer
      const questionTimer = setInterval(() => {
        game.timeRemaining--;

        if (game.timeRemaining <= 0) {
          clearInterval(questionTimer);
          handleQuestionEnd(io, game);
        } else {
          io.to(playerInfo.gameCode).emit('time-update', {
            timeRemaining: game.timeRemaining,
          });
        }
      }, 1000);
    }
  } catch (error) {
    console.error('Error in nextQuestionSocketEvent:', error);
    socket.emit('error', { message: 'Failed to proceed to next question' });
  }
}
