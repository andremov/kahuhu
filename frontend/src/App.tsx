import { HomeScreen } from './components/screens/home-screen';
import { CreateQuizScreen } from './components/screens/create-quiz-screen';
import { QuizListScreen } from './components/screens/quiz-list-screen';
import { useAppStore } from './store/app-store';
import GameScreen from './components/screens/game-screen';

export default function App() {
  // const [hasAnswered, setHasAnswered] = useState(false);
  const {
    setCurrentScreen,
    currentScreen,
    setGameState,
    setHostingQuizId,
    setPlayerName,
    setGameCode,
  } = useAppStore();

  const handleJoinGameSubmit = (gameCode: string, playerName: string) => {
    setGameCode(gameCode);
    setPlayerName(playerName);
    setCurrentScreen('in-game');
    setGameState('lobby');
  };

  const handleHostGameSubmit = (quizId?: string) => {
    if (quizId) {
      setHostingQuizId(quizId);
    }
    setCurrentScreen('in-game');
    setGameState('lobby');
  };

  return (
    <div
      className={`min-h-screen transition-all ${currentScreen === 'home' ? 'bg-linear-[27deg] from-purple-600 via-pink-500 to-orange-400' : 'bg-linear-[43deg] from-blue-600 via-teal-500 to-green-400'}`}
    >
      {currentScreen === 'home' && (
        <HomeScreen onJoinGame={handleJoinGameSubmit} onHostGame={handleHostGameSubmit} />
      )}

      {currentScreen === 'create-quiz' && <CreateQuizScreen />}

      {currentScreen === 'list-quizzes' && <QuizListScreen onHostGame={handleHostGameSubmit} />}

      {currentScreen === 'in-game' && <GameScreen />}
    </div>
  );
}
