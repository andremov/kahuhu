import { useState, useEffect } from 'react';
import { useSocket } from './use-socket';
import { GameState, QuestionResult, FinalResults } from '../utils/types';

type AppStateOptions =
  | 'home'
  | 'create-quiz'
  | 'create-game'
  | 'lobby'
  | 'question'
  | 'results'
  | 'final'
  | 'list-quizzes'
  | 'connecting';

interface UseGameStateReturn {
  appState: AppStateOptions;
  gameState: GameState | null;
  playerId: string | null;
  isHost: boolean;
  questionResult: QuestionResult | null;
  finalResults: FinalResults | null;
  error: string | null;
  isConnected: boolean;
  selectedQuizId: string | null;

  setSelectedQuizId: (newId: string | null) => void;
  setAppState: (state: AppStateOptions) => void;
  createGame: (quiz: any) => void;
  joinGame: (gameCode: string, playerName: string) => void;
  startGame: () => void;
  submitAnswer: (answerIndex: number) => void;
  nextQuestion: () => void;
  resetGame: () => void;
}

export const useGameState = (): UseGameStateReturn => {
  const { socket, isConnected, createGame, joinGame, startGame, submitAnswer, nextQuestion } =
    useSocket();
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [appState, setAppState] = useState<AppStateOptions>('home');
  const [playerId, setPlayerId] = useState<string | null>(null);
  const [isHost, setIsHost] = useState(false);
  const [questionResult, setQuestionResult] = useState<QuestionResult | null>(null);
  const [finalResults, setFinalResults] = useState<FinalResults | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedQuizId, setSelectedQuizId] = useState<string | null>(null);

  useEffect(() => {
    if (!socket) return;

    // Game creation events
    socket.on('game-created', ({ gameCode, gameState: newGameState }) => {
      console.log('Game created:', gameCode);
      setGameState(newGameState);
      setIsHost(true);
      setError(null);
    });

    // Game joining events
    socket.on('game-joined', ({ playerId: newPlayerId, gameState: newGameState }) => {
      console.log('Game joined:', newPlayerId);
      setPlayerId(newPlayerId);
      setGameState(newGameState);
      setIsHost(false);
      setError(null);
    });

    socket.on('join-error', ({ message }) => {
      setError(message);
    });

    // Player management events
    socket.on('player-joined', (newGameState) => {
      setGameState(newGameState);
    });

    socket.on('player-left', (newGameState) => {
      setGameState(newGameState);
    });

    // Game flow events
    socket.on('game-started', (newGameState) => {
      setGameState(newGameState);
      setQuestionResult(null);
      setFinalResults(null);
    });

    socket.on('time-update', ({ timeRemaining }) => {
      setGameState((prev) => (prev ? { ...prev, timeRemaining } : null));
    });

    socket.on('answer-submitted', ({ answerIndex, isCorrect, score, totalScore }) => {
      console.log('Answer submitted:', { answerIndex, isCorrect, score, totalScore });
    });

    socket.on('question-ended', (result: QuestionResult) => {
      setQuestionResult(result);
      setGameState((prev) => (prev ? { ...prev, gameState: 'results' } : null));
    });

    socket.on('next-question', (newGameState) => {
      setGameState(newGameState);
      setQuestionResult(null);
    });

    socket.on('game-ended', (results: FinalResults) => {
      setFinalResults(results);
      setGameState((prev) => (prev ? { ...prev, gameState: 'final' } : null));
    });

    socket.on('host-disconnected', () => {
      setError('Host disconnected. Game ended.');
      resetGame();
    });

    socket.on('error', ({ message }) => {
      setError(message);
    });

    return () => {
      socket.off('game-created');
      socket.off('game-joined');
      socket.off('join-error');
      socket.off('player-joined');
      socket.off('player-left');
      socket.off('game-started');
      socket.off('time-update');
      socket.off('answer-submitted');
      socket.off('question-ended');
      socket.off('next-question');
      socket.off('game-ended');
      socket.off('host-disconnected');
      socket.off('error');
    };
  }, [socket]);

  const resetGame = () => {
    setGameState(null);
    setPlayerId(null);
    setIsHost(false);
    setQuestionResult(null);
    setFinalResults(null);
    setError(null);
  };

  return {
    appState,
    gameState,
    playerId,
    isHost,
    questionResult,
    finalResults,
    error,
    isConnected,
    selectedQuizId,

    setSelectedQuizId,
    setAppState,
    createGame,
    joinGame,
    startGame,
    submitAnswer,
    nextQuestion,
    resetGame,
  };
};
