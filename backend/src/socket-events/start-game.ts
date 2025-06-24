import { Server, Socket } from 'socket.io';
import { getGameByCode, getGameState, getPlayerBySocketId } from '../services/games';
import { Temporal } from '@js-temporal/polyfill';
import { handleQuestionEnd } from '../utils/functions';
import { getQuizById } from '../services/quizzes-and-questions';

export default async function startGameSocketEvent(io: Server, socket: Socket) {
  try {
    const playerInfo = getPlayerBySocketId(socket.id);
    if (!playerInfo) return;

    const game = getGameByCode(playerInfo.gameCode);
    if (!game || game.hostId !== socket.id) return;

    const quizData = await getQuizById(game.quizId);

    if (quizData === null) {
      console.error(`Quiz with ID ${game.quizId} not found`);
      socket.emit('error', { message: 'Quiz not found' });
      return;
    }

    game.quizData = quizData;
    game.gameState = 'question';
    game.currentQuestionIndex = 0;
    game.timeRemaining = 60;
    game.questionStartTime = Temporal.Now.plainDateTimeISO();

    const gameState = getGameState(game);
    io.to(playerInfo.gameCode).emit('game-started', gameState);

    // Start question timer
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

    console.log(`Game ${playerInfo.gameCode} started`);
  } catch (error) {
    console.error('Error starting game:', error);
    socket.emit('error', { message: 'Failed to start game' });
  }
}
