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
import { QuizListScreen } from './components/screens/quiz-list-screen';

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

  const handleGoHome = () => {
    resetGame();
    setAppState('home');
  };

  const handleLeaveGame = () => {
    resetGame();
    setAppState('home');
  };

  return (
    <div className="min-h-screen bg-gradient-[40deg,purple_10%,pink_50%,orange_90%]">
      {appState === 'home' && (
        <HomeScreen
          onCreateGame={() => setAppState('create-game')}
          onCreateQuiz={() => setAppState('create-quiz')}
          onListQuizzes={() => setAppState('list-quizzes')}
          onJoinGame={handleJoinGameSubmit}
          error={error}
        />
      )}

      {appState === 'create-quiz' && (
        <CreateQuizScreen
          onBack={() => setAppState('list-quizzes')}
          // quizId={selectedQuizId} // Pass the selected quiz ID if editing
        />
      )}

      {appState === 'list-quizzes' && (
        <QuizListScreen
          onBack={() => setAppState('home')}
          onCreateQuiz={() => setAppState('create-quiz')}
          onHostQuiz={(quizId: string) => {
            // createGame(quizId);
            // setAppState('lobby');
          }}
          onEditQuiz={(quizId: string) => {
            setAppState('create-quiz');
            // Navigate to edit quiz screen (not implemented in this example)
          }}
          onDeleteQuiz={(quizId: string) => {
            // Handle quiz deletion (not implemented in this example)
          }}
        />
      )}
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
