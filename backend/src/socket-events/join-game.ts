import { Server, Socket } from 'socket.io';
import { getGameState, joinGame } from '../services/games';

export default function joinGameSocketEvent(io: Server, socket: Socket, { gameCode, playerName }) {
  try {
    const result = joinGame(gameCode, playerName, socket.id);

    if (!result) {
      socket.emit('join-error', {
        message: 'Game not found or already started',
      });
      return;
    }

    const { playerId, game } = result;
    socket.join(gameCode);

    const gameState = getGameState(game);
    socket.emit('game-joined', { playerId, gameState });

    // Notify all players in the game about the new player
    io.to(gameCode).emit('player-joined', gameState);

    console.log(`Player ${playerName} joined game ${gameCode}`);
  } catch (error: unknown) {
    console.error('Error creating game:', error);
    // socket.emit('error', { message: 'Failed to join game' });
  }
}
