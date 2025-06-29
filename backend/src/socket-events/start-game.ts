import { Server, Socket } from 'socket.io';
import { getGameByHostSocketId, getGameState, getPlayerBySocketId } from '../services/games';
import { Temporal } from '@js-temporal/polyfill';
import { handleQuestionEnd } from '../utils/functions';

export default async function startGameSocketEvent(io: Server, socket: Socket) {
  try {
    const game = getGameByHostSocketId(socket.id);
    if (!game) return;

    const currentQuestion = game.quizData.questions[game.currentQuestionIndex];

    game.gameState = 'question';
    game.currentQuestionIndex = 0;
    game.timeRemaining = currentQuestion.timeLimit + 3;
    game.questionStartTime = Temporal.Now.plainDateTimeISO();

    const gameState = getGameState(game);
    io.to(game.code).emit('game-started', gameState);

    // Start question timer
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

    console.log(`Game ${game.code} started`);
  } catch (error) {
    console.error('Error starting game:', error);
    socket.emit('error', { message: 'Failed to start game' });
  }
}
