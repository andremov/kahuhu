import { useSocket } from '../../hooks/use-socket';

export default function GameScreen() {
  const { socket, isConnected, createGame, joinGame, startGame, submitAnswer, nextQuestion } =
    useSocket();

  // Handle connection state
  // useEffect(() => {
  //   if (isConnected && appState === 'connecting') {
  //     setAppState('home');
  //   }
  // }, [isConnected, appState]);

  // useEffect(() => {
  //   if (!socket) return;

  //   // Game creation events
  //   socket.on('game-created', ({ gameCode, gameState: newGameState }) => {
  //     console.log('Game created:', gameCode);
  //     setGameState(newGameState);
  //     setIsHost(true);
  //     setError(null);
  //   });

  //   // Game joining events
  //   socket.on('game-joined', ({ playerId: newPlayerId, gameState: newGameState }) => {
  //     console.log('Game joined:', newPlayerId);
  //     setPlayerId(newPlayerId);
  //     setGameState(newGameState);
  //     setIsHost(false);
  //     setError(null);
  //   });

  //   socket.on('join-error', ({ message }) => {
  //     setError(message);
  //   });

  //   // Player management events
  //   socket.on('player-joined', (newGameState) => {
  //     setGameState(newGameState);
  //   });

  //   socket.on('player-left', (newGameState) => {
  //     setGameState(newGameState);
  //   });

  //   // Game flow events
  //   socket.on('game-started', (newGameState) => {
  //     setGameState(newGameState);
  //     setQuestionResult(null);
  //     setFinalResults(null);
  //   });

  //   socket.on('time-update', ({ timeRemaining }) => {
  //     setGameState((prev) => (prev ? { ...prev, timeRemaining } : null));
  //   });

  //   socket.on('answer-submitted', ({ answerIndex, isCorrect, score, totalScore }) => {
  //     console.log('Answer submitted:', { answerIndex, isCorrect, score, totalScore });
  //   });

  //   socket.on('question-ended', (result: QuestionResult) => {
  //     setQuestionResult(result);
  //     setGameState((prev) => (prev ? { ...prev, gameState: 'results' } : null));
  //   });

  //   socket.on('next-question', (newGameState) => {
  //     setGameState(newGameState);
  //     setQuestionResult(null);
  //   });

  //   socket.on('game-ended', (results: FinalResults) => {
  //     setFinalResults(results);
  //     setGameState((prev) => (prev ? { ...prev, gameState: 'final' } : null));
  //   });

  //   socket.on('host-disconnected', () => {
  //     setError('Host disconnected. Game ended.');
  //     resetGame();
  //   });

  //   socket.on('error', ({ message }) => {
  //     setError(message);
  //   });

  //   return () => {
  //     socket.off('game-created');
  //     socket.off('game-joined');
  //     socket.off('join-error');
  //     socket.off('player-joined');
  //     socket.off('player-left');
  //     socket.off('game-started');
  //     socket.off('time-update');
  //     socket.off('answer-submitted');
  //     socket.off('question-ended');
  //     socket.off('next-question');
  //     socket.off('game-ended');
  //     socket.off('host-disconnected');
  //     socket.off('error');
  //   };
  // }, [socket]);

  // Handle game state changes
  // useEffect(() => {
  //   if (!gameState) {
  //     if (appState !== 'home' && appState !== 'create-quiz' && appState !== 'connecting') {
  //       setAppState('home');
  //     }
  //     return;
  //   }

  //   switch (gameState.gameState) {
  //     case 'lobby':
  //       setAppState('lobby');
  //       break;
  //     case 'question':
  //       setAppState('question');
  //       setHasAnswered(false);
  //       break;
  //     case 'results':
  //       setAppState('results');
  //       break;
  //     case 'final':
  //       setAppState('final');
  //       break;
  //   }
  // }, [gameState?.gameState, appState]);

  return <div className="container mx-auto p-4">Game</div>;
}
