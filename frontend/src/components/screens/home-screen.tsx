import { Plus, Trophy, HelpCircle } from 'lucide-react';
import { Quiz } from '../../utils/types';
import { useEffect, useState } from 'react';
import { fetchQuizzes } from '../../utils/api';
import { JoinForm } from '../forms/join-form';

interface HomeScreenProps {
  onCreateGame: (quiz: Quiz) => void;
  onCreateQuiz: () => void;
  onJoinGame: (gameCode: string, playerName: string) => void;
  error?: string | null;
}

export function HomeScreen({ onCreateGame, onJoinGame, error, onCreateQuiz }: HomeScreenProps) {
  const [selectedQuiz, setSelectedQuiz] = useState<Quiz | null>(null);
  const [loadedQuizzes, setLoadedQuizzes] = useState<Quiz[]>([]);

  useEffect(() => {
    const callFetchQuizzes = async () => {
      try {
        const response = await fetchQuizzes();
        setLoadedQuizzes(response);
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        // console.error('Error fetching quizzes:', error);
      }
    };

    callFetchQuizzes();
  }, []);

  const handleCreateGame = () => {
    if (selectedQuiz) {
      onCreateGame(selectedQuiz);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-lg">
              <Trophy className="w-7 h-7 text-purple-600" />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-white">Kahuhu</h1>
          </div>
        </div>

        {/* Main Actions */}
        <div className="grid md:grid-rows-1 gap-8 max-w-4xl mx-auto mb-12">
          {/* Join Game */}
          <JoinForm onJoinGame={onJoinGame} error={error} />

          {/* Host Game */}
          {/* <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-8 shadow-2xl">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Plus className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Host a Game</h2>
              <p className="text-gray-600">Select a quiz and start a game session</p>
            </div>

            <div className="space-y-4 mb-6">
              <h3 className="font-semibold text-gray-800">Choose a Quiz:</h3>
              {loadedQuizzes.map((quiz) => (
                <div
                  key={quiz.id}
                  onClick={() => setSelectedQuiz(quiz)}
                  className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                    selectedQuiz?.id === quiz.id
                      ? 'border-purple-500 bg-purple-50'
                      : 'border-gray-200 hover:border-purple-300 hover:bg-gray-50'
                  }`}
                >
                  <h4 className="font-semibold text-gray-800">{quiz.title}</h4>
                  <p className="text-sm text-gray-600 mt-1">{quiz.description}</p>
                  <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                    <span>{quiz.questions.length} questions</span>
                    <span>•</span>
                    <span>~{quiz.questions.length} min</span>
                  </div>
                </div>
              ))}
            </div>

            <Button
              onClick={handleCreateGame}
              disabled={!selectedQuiz}
              icon={Play}
              size="lg"
              className="w-full"
            >
              Create Game
            </Button>
          </div> */}
        </div>

        <div className="grid md:grid-cols-2 gap-4 max-w-lg mx-auto">
          <button
            className="group text-center text-white transition hover:scale-105 hover:bg-white/30 bg-transparent w-fit mx-auto p-6 rounded-3xl hover:shadow-lg select-none cursor-pointer"
            onClick={onCreateGame}
          >
            <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-3 transition group-hover:bg-transparent">
              <Plus className="w-6 h-6" />
            </div>
            <h3 className="font-semibold mb-2">Host a Game</h3>
          </button>

          <button
            className="group text-center text-white transition hover:scale-105 hover:bg-white/30 bg-transparent w-fit mx-auto p-6 rounded-3xl hover:shadow-lg select-none cursor-pointer"
            onClick={onCreateQuiz}
          >
            <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-3 transition group-hover:bg-transparent">
              <HelpCircle className="w-6 h-6" />
            </div>
            <h3 className="font-semibold mb-2">Create a Quiz</h3>
          </button>
        </div>
      </div>
    </div>
  );
}
