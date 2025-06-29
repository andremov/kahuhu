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

    const gameCopy = JSON.parse(JSON.stringify(game)); // Deep copy to avoid mutation

    // Start question timer
    const questionTimer = setInterval(() => {
      if (
        gameCopy.currentQuestionIndex !== game.currentQuestionIndex ||
        game.gameState !== 'question'
      ) {
        clearInterval(questionTimer);
        return; // Stop the timer if the question index has changed
      }

      gameCopy.timeRemaining--;

      if (gameCopy.timeRemaining <= 0) {
        clearInterval(questionTimer);
        handleQuestionEnd(io, gameCopy);
      } else {
        io.to(gameCopy.code).emit('time-update', {
          questionIndex: gameCopy.currentQuestionIndex,
          timeRemaining: gameCopy.timeRemaining,
        });
      }
    }, 1000);

    console.log(`Game ${game.code} started`);
  } catch (error) {
    console.error('Error starting game:', error);
    socket.emit('error', { message: 'Failed to start game' });
  }
}
