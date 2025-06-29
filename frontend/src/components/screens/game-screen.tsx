import { useEffect } from 'react';
import { useSocket } from '../../hooks/use-socket';
import { useAppStore } from '../../store/app-store';
import GameLobbyScreen from './game-lobby-screen';
import CreateGameScreen from './create-game-screen';
import ConnectingScreen from './connecting-screen';
import type { FinalResults, QuestionResult } from '../../utils/types';
import QuestionScreen from './question-screen';
import QuestionResultsScreen from './question-results-screen';
import FinalResultsScreen from './final-results-screen';

export default function GameScreen() {
  const {
    gamePhase,
    setCurrentScreen,
    setGameState,
    setPlayerId,
    setIsHost,
    setCurrentQuestionIndex,
    setTimeRemaining,
    setGamePhase,
    setQuestionResult,
    setPlayerAnswers,
    addPlayerAnswer,
    setFinalResults,
  } = useAppStore();
  const { socket, isConnected, createGame, joinGame, startGame, submitAnswer, nextQuestion } =
    useSocket();

  useEffect(() => {
    if (!gamePhase) {
      setCurrentScreen('home');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gamePhase]);

  useEffect(() => {
    if (!socket) return;

    // Game creation events
    socket.on('game-created', ({ gameCode, gameState: newGameState }) => {
      console.log('Game created:', gameCode);
      setGameState(newGameState);
      setIsHost(true);
      setPlayerAnswers(null);
    });

    // Game joining events
    socket.on('game-joined', ({ playerId: newPlayerId, gameState: newGameState }) => {
      console.log('Game joined:', newPlayerId);
      setPlayerId(newPlayerId);
      setGameState(newGameState);
      setIsHost(false);
      setPlayerAnswers([]);
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
      setCurrentQuestionIndex(newGameState.currentQuestionIndex || 0);
      setGamePhase('question');
    });

    socket.on('time-update', ({ timeRemaining, questionIndex }) => {
      setTimeRemaining(timeRemaining, questionIndex);
    });

    socket.on('answer-submitted', (data) => {
      const {
        answerIndex,
        //  isCorrect, score, totalScore
      } = data;
      addPlayerAnswer(answerIndex);
    });

    socket.on('question-ended', (result: QuestionResult) => {
      setGamePhase('results');
      setQuestionResult(result);
    });

    socket.on('next-question', (newGameState) => {
      setGameState(newGameState);
      setGamePhase('question');
      setCurrentQuestionIndex(newGameState.currentQuestionIndex);
      setQuestionResult(null);
    });

    socket.on('game-ended', (results: FinalResults) => {
      setFinalResults(results);
      setGamePhase('final');
    });

    socket.on('host-disconnected', () => {
      setCurrentScreen('home');
      setGamePhase(null);
      setGameState(null);
      setPlayerId(null);
      setIsHost(false);
      setCurrentQuestionIndex(0);
      setQuestionResult(null);
      setPlayerAnswers(null);
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socket]);

  if (gamePhase === null) {
    return <div className=""></div>;
  }

  switch (gamePhase) {
    case 'creating':
      return <CreateGameScreen isConnected={isConnected} onCreateGame={createGame} />;
    case 'lobby':
      return <GameLobbyScreen onStartGame={startGame} />;
    case 'question':
      return <QuestionScreen onSubmitAnswer={submitAnswer} />;
    case 'results':
      return <QuestionResultsScreen onNextQuestion={nextQuestion} />;
    case 'final':
      return <FinalResultsScreen />;
    case 'connecting':
      return <ConnectingScreen isConnected={isConnected} onJoinGame={joinGame} />;
    default:
      return <div className="container mx-auto p-4">Unknown State</div>;
  }
}
