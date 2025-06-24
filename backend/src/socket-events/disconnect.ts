import { Server, Socket } from 'socket.io';
import {
  deletePlayerFromGame,
  endGame,
  getGameByCode,
  getGameState,
  getPlayerBySocketId,
  removePlayerFromGame,
} from '../services/games';

export default function disconnectSocketEvent(io: Server, socket: Socket) {
  try {
    const playerInfo = getPlayerBySocketId(socket.id);
    if (playerInfo) {
      const game = getGameByCode(playerInfo.gameCode);

      if (game) {
        // Remove player from game
        removePlayerFromGame(playerInfo.gameCode, playerInfo.id);

        // If host disconnected, end the game
        if (game.hostId === socket.id) {
          io.to(playerInfo.gameCode).emit('host-disconnected');
          endGame(playerInfo.gameCode);
        } else {
          // Notify remaining players
          const gameState = getGameState(game);
          io.to(playerInfo.gameCode).emit('player-left', gameState);
        }
      }

      deletePlayerFromGame(socket.id);
    }

    console.log('User disconnected:', socket.id);
  } catch (error) {
    console.error('Error handling disconnect:', error);
  }
}
