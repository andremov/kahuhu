import { Plus, Trophy, HelpCircle, ListOrdered } from 'lucide-react';
import { JoinForm } from '../forms/join-form';
import { useAppStore } from '../../store/app-store';

interface HomeScreenProps {
  onJoinGame: (gameCode: string, playerName: string) => void;
  error?: string | null;
}

export function HomeScreen({ onJoinGame, error }: HomeScreenProps) {
  const { setCurrentScreen } = useAppStore();

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-12 h-20">
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
      </div>

      <div className="grid md:grid-cols-3 gap-4 max-w-lg mx-auto">
        <button
          className="group text-center text-white transition hover:scale-105 hover:bg-white/30 bg-transparent w-fit mx-auto p-6 rounded-3xl hover:shadow-lg select-none cursor-pointer"
          onClick={() => {}}
        >
          <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-3 transition group-hover:bg-transparent">
            <Plus className="w-6 h-6" />
          </div>
          <h3 className="font-semibold mb-2">Host a Game</h3>
        </button>

        <button
          className="group text-center text-white transition hover:scale-105 hover:bg-white/30 bg-transparent w-fit mx-auto p-6 rounded-3xl hover:shadow-lg select-none cursor-pointer"
          onClick={() => setCurrentScreen('create-quiz')}
        >
          <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-3 transition group-hover:bg-transparent">
            <HelpCircle className="w-6 h-6" />
          </div>
          <h3 className="font-semibold mb-2">Create a Quiz</h3>
        </button>

        <button
          className="group text-center text-white transition hover:scale-105 hover:bg-white/30 bg-transparent w-fit mx-auto p-6 rounded-3xl hover:shadow-lg select-none cursor-pointer"
          onClick={() => setCurrentScreen('list-quizzes')}
        >
          <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-3 transition group-hover:bg-transparent">
            <ListOrdered className="w-6 h-6" />
          </div>
          <h3 className="font-semibold mb-2">List Quizzes</h3>
        </button>
      </div>
    </div>
  );
}
