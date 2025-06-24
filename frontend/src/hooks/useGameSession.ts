import { useState, useEffect, useCallback } from 'react';
import { GameSession, Player, Quiz, QuestionResult } from '../types';

export const useGameSession = () => {
  const [gameSession, setGameSession] = useState<GameSession | null>(null);
  const [questionResults, setQuestionResults] = useState<QuestionResult[]>([]);

  const createGame = useCallback((quiz: Quiz) => {
    const gameCode = Math.random().toString(36).substring(2, 8).toUpperCase();
    const newSession: GameSession = {
      id: `game-${Date.now()}`,
      quiz,
      gameCode,
      players: [],
      currentQuestionIndex: 0,
      gameState: 'lobby',
      timeRemaining: 0,
    };
    setGameSession(newSession);
    return gameCode;
  }, []);

  const joinGame = useCallback((gameCode: string, playerName: string) => {
    if (!gameSession || gameSession.gameCode !== gameCode) {
      return null;
    }

    const newPlayer: Player = {
      id: `player-${Date.now()}`,
      name: playerName,
      score: 0,
      answers: new Array(gameSession.quiz.questions.length).fill(null),
      joinedAt: new Date(),
    };

    setGameSession(prev => prev ? {
      ...prev,
      players: [...prev.players, newPlayer]
    } : null);

    return newPlayer.id;
  }, [gameSession]);

  const startGame = useCallback(() => {
    if (!gameSession || gameSession.players.length === 0) return;

    setGameSession(prev => prev ? {
      ...prev,
      gameState: 'question',
      currentQuestionIndex: 0,
      timeRemaining: prev.quiz.questions[0]?.timeLimit || 30,
      startedAt: new Date(),
    } : null);
  }, [gameSession]);

  const submitAnswer = useCallback((playerId: string, answerIndex: number) => {
    if (!gameSession || gameSession.gameState !== 'question') return;

    setGameSession(prev => {
      if (!prev) return null;

      const updatedPlayers = prev.players.map(player => {
        if (player.id === playerId) {
          const newAnswers = [...player.answers];
          newAnswers[prev.currentQuestionIndex] = answerIndex;
          return { ...player, answers: newAnswers };
        }
        return player;
      });

      return { ...prev, players: updatedPlayers };
    });
  }, [gameSession]);

  const nextQuestion = useCallback(() => {
    if (!gameSession) return;

    const currentQuestion = gameSession.quiz.questions[gameSession.currentQuestionIndex];
    const correctAnswer = currentQuestion.correctAnswer;

    // Calculate scores for this question
    const questionResult: QuestionResult = {
      questionIndex: gameSession.currentQuestionIndex,
      correctAnswer,
      playerAnswers: {},
      scores: {},
    };

    const updatedPlayers = gameSession.players.map(player => {
      const playerAnswer = player.answers[gameSession.currentQuestionIndex];
      questionResult.playerAnswers[player.id] = playerAnswer;

      let questionScore = 0;
      if (playerAnswer === correctAnswer) {
        // Base points + time bonus (max timeLimit seconds)
        const timeBonus = Math.max(0, gameSession.timeRemaining / currentQuestion.timeLimit);
        questionScore = Math.round(currentQuestion.points * (0.5 + 0.5 * timeBonus));
      }

      questionResult.scores[player.id] = questionScore;
      return { ...player, score: player.score + questionScore };
    });

    setQuestionResults(prev => [...prev, questionResult]);

    if (gameSession.currentQuestionIndex + 1 >= gameSession.quiz.questions.length) {
      // Game is over
      setGameSession(prev => prev ? {
        ...prev,
        players: updatedPlayers,
        gameState: 'final',
        timeRemaining: 0,
      } : null);
    } else {
      // Move to results state, then next question
      setGameSession(prev => prev ? {
        ...prev,
        players: updatedPlayers,
        gameState: 'results',
        timeRemaining: 5, // Show results for 5 seconds
      } : null);
    }
  }, [gameSession]);

  const continueToNextQuestion = useCallback(() => {
    if (!gameSession || gameSession.gameState !== 'results') return;

    const nextIndex = gameSession.currentQuestionIndex + 1;
    const nextQuestion = gameSession.quiz.questions[nextIndex];

    setGameSession(prev => prev ? {
      ...prev,
      currentQuestionIndex: nextIndex,
      gameState: 'question',
      timeRemaining: nextQuestion.timeLimit,
    } : null);
  }, [gameSession]);

  const resetGame = useCallback(() => {
    setGameSession(null);
    setQuestionResults([]);
  }, []);

  return {
    gameSession,
    questionResults,
    createGame,
    joinGame,
    startGame,
    submitAnswer,
    nextQuestion,
    continueToNextQuestion,
    resetGame,
  };
};