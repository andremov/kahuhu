import { ArrowLeft, ListChecks, Play } from 'lucide-react';
import { useAppStore } from '../../store/app-store';
import { Button } from '../button';
import { Quiz } from '../../utils/types';
import { useEffect } from 'react';

type CreateGameScreenProps = {
  onCreateGame: (quiz: Quiz) => void;
};

export default function CreateGameScreen({ onCreateGame }: CreateGameScreenProps) {
  const {
    setGamePhase,
    loadedQuizzes,
    setHostingQuizId,
    setCurrentScreen,
    hostingQuizId,
    getHostingQuiz,
  } = useAppStore();

  const handleCreateGame = () => {
    const quiz = getHostingQuiz();
    if (quiz) {
      onCreateGame(quiz);
      setTimeout(() => setGamePhase('lobby'), 100);
    }
  };

  const handleSelectQuiz = (quizId: string) => {
    setHostingQuizId(quizId);
    handleCreateGame();
  };

  useEffect(() => {
    if (!hostingQuizId) return;

    setTimeout(() => {
      handleCreateGame();
    }, 100);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center mb-12 h-20">
        <Button
          onClick={() => setCurrentScreen('home')}
          variant="secondary"
          icon={ArrowLeft}
          className="mr-4"
        >
          Back
        </Button>
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center">
            <Play className="w-7 h-7 text-purple-600" />
          </div>
          <h1 className="text-3xl font-bold text-white">Create Game</h1>
        </div>
      </div>

      <div className="flex flex-col gap-8 max-w-4xl mx-auto mb-12">
        {loadedQuizzes.map((quiz) => (
          <div
            key={quiz.id}
            className={`relative p-6 rounded-3xl shadow-lg bg-white/95 backdrop-blur-sm`}
          >
            <h2 className="text-2xl font-bold mb-2">{quiz.title}</h2>
            <p className="text-gray-700">{quiz.description}</p>

            <div className="flex gap-4 mt-6 justify-end">
              <Button variant="primary" onClick={() => handleSelectQuiz(quiz.id)} icon={Play}>
                <p>Play</p>
              </Button>
            </div>
          </div>
        ))}

        {loadedQuizzes.length === 0 && (
          <div className="text-center p-6 bg-white/95 backdrop-blur-sm rounded-3xl shadow-lg">
            <p className="text-gray-700">No quizzes available. Please create or upload a quiz.</p>
          </div>
        )}

        <Button
          className="w-1/3 mx-auto"
          variant="primary"
          icon={ListChecks}
          onClick={() => setCurrentScreen('list-quizzes')}
        >
          <p className="text-lg">To Quiz List</p>
        </Button>
      </div>
    </div>
  );
}
