import { useEffect } from 'react';
import { useSocket } from '../../hooks/use-socket';
import { useAppStore } from '../../store/app-store';
import { GameLobbyScreen } from './game-lobby-screen';
import CreateGameScreen from './create-game-screen';

export default function GameScreen() {
  const { gamePhase, setCurrentScreen, isHost, setGameState } = useAppStore();
  const { socket, isConnected, createGame, joinGame, startGame, submitAnswer, nextQuestion } =
    useSocket();

  // Handle connection state
  // useEffect(() => {
  //   if (isConnected && appState === 'connecting') {
  //     setAppState('home');
  //   }
  // }, [isConnected, appState]);

  useEffect(() => {
    if (!gamePhase) {
      setCurrentScreen('home');
    }
  }, [gamePhase]);

  useEffect(() => {
    if (!socket) return;

    // Game creation events
    socket.on('game-created', ({ gameCode, gameState: newGameState }) => {
      console.log('Game created:', gameCode);
      setGameState(newGameState);
    });

    // Game joining events
    // socket.on('game-joined', ({ playerId: newPlayerId, gameState: newGameState }) => {
    //   console.log('Game joined:', newPlayerId);
    //   setPlayerId(newPlayerId);
    //   setGameState(newGameState);
    //   setIsHost(false);
    //   setError(null);
    // });

    // socket.on('join-error', ({ message }) => {
    //   setError(message);
    // });

    // Player management events
    // socket.on('player-joined', (newGameState) => {
    //   setGameState(newGameState);
    // });

    // socket.on('player-left', (newGameState) => {
    //   setGameState(newGameState);
    // });

    // Game flow events
    // socket.on('game-started', (newGameState) => {
    //   setGameState(newGameState);
    //   setQuestionResult(null);
    //   setFinalResults(null);
    // });

    // socket.on('time-update', ({ timeRemaining }) => {
    //   setGameState((prev) => (prev ? { ...prev, timeRemaining } : null));
    // });

    // socket.on('answer-submitted', ({ answerIndex, isCorrect, score, totalScore }) => {
    //   console.log('Answer submitted:', { answerIndex, isCorrect, score, totalScore });
    // });

    // socket.on('question-ended', (result: QuestionResult) => {
    //   setQuestionResult(result);
    //   setGameState((prev) => (prev ? { ...prev, gameState: 'results' } : null));
    // });

    // socket.on('next-question', (newGameState) => {
    //   setGameState(newGameState);
    //   setQuestionResult(null);
    // });

    // socket.on('game-ended', (results: FinalResults) => {
    //   setFinalResults(results);
    //   setGameState((prev) => (prev ? { ...prev, gameState: 'final' } : null));
    // });

    // socket.on('host-disconnected', () => {
    //   setError('Host disconnected. Game ended.');
    //   resetGame();
    // });

    // socket.on('error', ({ message }) => {
    //   setError(message);
    // });

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

  if (gamePhase === null) {
    return <div className=""></div>;
  }

  switch (gamePhase) {
    case 'creating':
      return <CreateGameScreen onCreateGame={createGame} />;
    case 'lobby':
      return <GameLobbyScreen onStartGame={startGame} />;
    case 'question':
      return <div className="container mx-auto p-4">Question</div>;
    case 'results':
      return <div className="container mx-auto p-4">Results</div>;
    case 'final':
      return <div className="container mx-auto p-4">Final Results</div>;
    case 'connecting':
      return <div className="container mx-auto p-4">Connecting...</div>;
    default:
      return <div className="container mx-auto p-4">Unknown State</div>;
  }
}
