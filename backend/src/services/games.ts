import { v4 as uuidv4 } from 'uuid';
import { Game, Player, Quiz } from '../utils/types';
import { Temporal } from '@js-temporal/polyfill';
import { time } from 'console';

const games = new Map<string, Game>();

export function createGame(quiz: Quiz, hostSocketId: string) {
  const gameCode = Math.random().toString(36).substring(2, 8).toUpperCase();
  const gameId = uuidv4();

  const game: Game = {
    id: gameId,
    code: gameCode,
    quizId: quiz.id,
    quizData: quiz,
    players: [],
    hostId: hostSocketId,
    currentQuestionIndex: 0,
    gameState: 'lobby', // lobby, question, results, final
    timeRemaining: 0,
    questionStartTime: null,
    createdAt: Temporal.Now.plainDateTimeISO(),
  };

  games.set(gameCode, game);

  return { gameId, gameCode };
}

export function joinGame(gameCode: string, playerName: string, socketId: string) {
  const game = games.get(gameCode);
  if (!game || game.gameState !== 'lobby') {
    return null;
  }

  const playerId = uuidv4();
  const player: Player = {
    id: playerId,
    name: playerName,
    socketId,
    gameCode: game.code,
    score: 0,
    answers: new Array(game.quizData!.questions.length).fill(null),
    joinedAt: Temporal.Now.plainDateTimeISO(),
  };

  game.players.push(player);

  return { playerId, game };
}

export function getGameByCode(gameCode: string) {
  return games.get(gameCode);
}

export function getGameState(game: Game) {
  return {
    id: game.id,
    code: game.code,
    quizData: {
      id: game.quizData!.id,
      title: game.quizData!.title,
      description: game.quizData!.description,
      questions: game.quizData!.questions.map((q) => ({
        id: q.id,
        statement: q.statement,
        options: q.options,
        timeLimit: q.timeLimit,
      })),
    },
    players: game.players.map((p) => ({
      id: p.id,
      name: p.name,
      score: p.score,
      joinedAt: p.joinedAt.toString(),
    })),
    currentQuestionIndex: game.currentQuestionIndex,
    gameState: game.gameState,
    timeRemaining: game.timeRemaining,
  };
}

export function removePlayerFromGame(gameCode: string, playerId: string) {
  const game = games.get(gameCode);
  if (!game) return;

  game.players = game.players.filter((p) => p.id !== playerId);
  if (game.players.length === 0) {
    games.delete(gameCode); // Remove game if no players left
  }
}

export function endGame(gameCode: string) {
  const game = games.get(gameCode);
  if (!game) return;

  game.gameState = 'final';
  game.timeRemaining = 0;
  game.questionStartTime = null;

  // Optionally, you can clear players or keep them for final results
  // game.players = [];
}

export function getPlayerBySocketId(socketId: string) {
  for (const game of games.values()) {
    const player = game.players.find((p) => p.socketId === socketId);
    if (player) {
      return player;
    }
  }
  return null;
}

export function getGameByHostSocketId(hostSocketId: string) {
  for (const game of games.values()) {
    if (game.hostId === hostSocketId) {
      return game;
    }
  }
  return null;
}

export function deletePlayerFromGame(socketId: string) {
  const player = getPlayerBySocketId(socketId);
  if (player) {
    removePlayerFromGame(player.gameCode, player.id);
  }
}
