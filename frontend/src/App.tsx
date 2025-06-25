import { useState, useEffect } from 'react';
import { HomeScreen } from './components/screens/home-screen';
import { GameLobbyScreen } from './components/screens/game-lobby-screen';
import { QuestionScreen } from './components/screens/question-screen';
import { ResultsScreen } from './components/screens/results-screen';
import { FinalResultsScreen } from './components/screens/final-results-screen';
import { CreateQuizScreen } from './components/screens/create-quiz-screen';
// import { LoadingSpinner } from './components/ui/loading-spinner';
import { useGameState } from './hooks/use-game-state';
import { Quiz } from './utils/types';

export default function App() {
  const [hasAnswered, setHasAnswered] = useState(false);

  const {
    appState,
    gameState,
    playerId,
    isHost,
    questionResult,
    finalResults,
    error,
    isConnected,

    setAppState,
    createGame,
    joinGame,
    startGame,
    submitAnswer,
    nextQuestion,
    resetGame,
  } = useGameState();

  // Handle connection state
  useEffect(() => {
    if (isConnected && appState === 'connecting') {
      setAppState('home');
    }
  }, [isConnected, appState]);

  // Handle game state changes
  useEffect(() => {
    if (!gameState) {
      if (appState !== 'home' && appState !== 'create-quiz' && appState !== 'connecting') {
        setAppState('home');
      }
      return;
    }

    switch (gameState.gameState) {
      case 'lobby':
        setAppState('lobby');
        break;
      case 'question':
        setAppState('question');
        setHasAnswered(false);
        break;
      case 'results':
        setAppState('results');
        break;
      case 'final':
        setAppState('final');
        break;
    }
  }, [gameState?.gameState, appState]);

  const handleCreateGame = (quiz: Quiz) => {
    createGame(quiz);
  };

  const handleJoinGameSubmit = (gameCode: string, playerName: string) => {
    joinGame(gameCode, playerName);
  };

  const handleStartGame = () => {
    startGame();
  };

  const handleSubmitAnswer = (answerIndex: number) => {
    submitAnswer(answerIndex);
    setHasAnswered(true);
  };

  const handleNextQuestion = () => {
    nextQuestion();
  };

  const handlePlayAgain = () => {
    if (gameState) {
      const quiz = gameState.quiz;
      resetGame();
      setTimeout(() => handleCreateGame(quiz), 100);
    }
  };

  const handleGoHome = () => {
    resetGame();
    setAppState('home');
  };

  const handleLeaveGame = () => {
    resetGame();
    setAppState('home');
  };

  function handleCreateQuiz() {
    setAppState('create-quiz');
  }

  // Render appropriate screen based on app state

  switch (appState) {
    case 'home':
      return (
        <HomeScreen
          onCreateGame={handleCreateGame}
          onCreateQuiz={handleCreateQuiz}
          onJoinGame={handleJoinGameSubmit}
          error={error}
        />
      );

    case 'create-quiz':
      return <CreateQuizScreen />;

    case 'lobby':
      return gameState ? (
        <GameLobbyScreen
          gameState={gameState}
          isHost={isHost}
          onStartGame={handleStartGame}
          onLeaveGame={handleLeaveGame}
        />
      ) : null;

    case 'question':
      return gameState ? (
        <QuestionScreen
          gameState={gameState}
          playerId={playerId}
          onSubmitAnswer={handleSubmitAnswer}
          isHost={isHost}
          hasAnswered={hasAnswered}
        />
      ) : null;

    case 'results':
      return gameState && questionResult ? (
        <ResultsScreen
          gameState={gameState}
          questionResult={questionResult}
          onContinue={handleNextQuestion}
          isHost={isHost}
        />
      ) : null;

    case 'final':
      return finalResults ? (
        <FinalResultsScreen
          finalResults={finalResults}
          onPlayAgain={handlePlayAgain}
          onGoHome={handleGoHome}
          isHost={isHost}
        />
      ) : null;

    default:
      return null;
  }
}
