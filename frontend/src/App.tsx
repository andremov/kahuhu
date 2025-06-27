import { useState, useEffect } from 'react';
import { HomeScreen } from './components/screens/home-screen';
import { GameLobbyScreen } from './components/screens/game-lobby-screen';
import { QuestionScreen } from './components/screens/question-screen';
import { ResultsScreen } from './components/screens/results-screen';
import { FinalResultsScreen } from './components/screens/final-results-screen';
import { CreateQuizScreen } from './components/screens/create-quiz-screen';
// import { LoadingSpinner } from './components/ui/loading-spinner';
import { Quiz } from './utils/types';
import { QuizListScreen } from './components/screens/quiz-list-screen';
import { useSocket } from './hooks/use-socket';
import { useAppStore } from './store/app-store';

export default function App() {
  // const [hasAnswered, setHasAnswered] = useState(false);
  const { setCurrentScreen, currentScreen } = useAppStore();
  // const { socket, isConnected, createGame, joinGame, startGame, submitAnswer, nextQuestion } =
  //   useSocket();

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

  const handleJoinGameSubmit = (gameCode: string, playerName: string) => {
    // joinGame(gameCode, playerName);
  };

  // const handleStartGame = () => {
  //   startGame();
  // };

  // const handleSubmitAnswer = (answerIndex: number) => {
  //   submitAnswer(answerIndex);
  //   setHasAnswered(true);
  // };

  // const handleNextQuestion = () => {
  //   nextQuestion();
  // };

  // const handleGoHome = () => {
  //   resetGame();
  //   setAppState('home');
  // };

  // const handleLeaveGame = () => {
  //   resetGame();
  //   setAppState('home');
  // };

  return (
    <div
      className={`min-h-screen transition-all ${currentScreen === 'home' ? 'bg-linear-[27deg] from-purple-600 via-pink-500 to-orange-400' : 'bg-linear-[43deg] from-blue-600 via-teal-500 to-green-400'}`}
    >
      {currentScreen === 'home' && <HomeScreen onJoinGame={handleJoinGameSubmit} />}

      {currentScreen === 'create-quiz' && <CreateQuizScreen />}

      {currentScreen === 'list-quizzes' && <QuizListScreen />}
    </div>
  );

  // switch (appState) {
  //   case 'lobby':
  //     return gameState ? (
  //       <GameLobbyScreen
  //         gameState={gameState}
  //         isHost={isHost}
  //         onStartGame={handleStartGame}
  //         onLeaveGame={handleLeaveGame}
  //       />
  //     ) : null;

  //   case 'question':
  //     return gameState ? (
  //       <QuestionScreen
  //         gameState={gameState}
  //         playerId={playerId}
  //         onSubmitAnswer={handleSubmitAnswer}
  //         isHost={isHost}
  //         hasAnswered={hasAnswered}
  //       />
  //     ) : null;

  //   case 'results':
  //     return gameState && questionResult ? (
  //       <ResultsScreen
  //         gameState={gameState}
  //         questionResult={questionResult}
  //         onContinue={handleNextQuestion}
  //         isHost={isHost}
  //       />
  //     ) : null;

  //   case 'final':
  //     return finalResults ? (
  //       <FinalResultsScreen
  //         finalResults={finalResults}
  //         onPlayAgain={() => {}}
  //         onGoHome={handleGoHome}
  //         isHost={isHost}
  //       />
  //     ) : null;

  //   default:
  //     return null;
  // }
}
