import { Server, Socket } from 'socket.io';
import { createGame, getGameByCode, getGameState } from '../services/games';
import { Quiz } from '../utils/types';

export default function createGameSocketEvent(io: Server, socket: Socket, quiz: Quiz) {
  try {
    const { gameCode } = createGame(quiz, socket.id);
    const game = getGameByCode(gameCode);

    if (!game) {
      return;
    }

    socket.join(gameCode);
    socket.emit('game-created', {
      gameCode,
      gameState: getGameState(game),
    });

    console.log(`Game created: ${gameCode} by ${socket.id}`);
  } catch (error: unknown) {
    console.error('Error creating game:', error);
    // socket.emit("error", { message: "Failed to create game" });
  }
}
