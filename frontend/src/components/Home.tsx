import React, { useState } from 'react';
import { Play, Plus, Users, Trophy } from 'lucide-react';
import { Button } from './Button';
import { sampleQuizzes } from '../data/sampleQuizzes';
import { Quiz } from '../types';

interface HomeProps {
  onCreateGame: (quiz: Quiz) => void;
  onJoinGame: () => void;
}

export const Home: React.FC<HomeProps> = ({ onCreateGame, onJoinGame }) => {
  const [selectedQuiz, setSelectedQuiz] = useState<Quiz | null>(null);

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
            <h1 className="text-4xl md:text-6xl font-bold text-white">
              QuizMaster
            </h1>
          </div>
          <p className="text-xl text-white/90 font-medium">
            Create engaging quizzes and compete with friends in real-time!
          </p>
        </div>

        {/* Main Actions */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-12">
          {/* Host Game */}
          <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-8 shadow-2xl">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Plus className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Host a Game</h2>
              <p className="text-gray-600">Select a quiz and start a game session</p>
            </div>

            <div className="space-y-4 mb-6">
              <h3 className="font-semibold text-gray-800">Choose a Quiz:</h3>
              {sampleQuizzes.map((quiz) => (
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
                    <span>~{Math.ceil(quiz.questions.reduce((acc, q) => acc + q.timeLimit, 0) / 60)} min</span>
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
          </div>

          {/* Join Game */}
          <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-8 shadow-2xl">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Join a Game</h2>
              <p className="text-gray-600">Enter a game code to join an existing session</p>
            </div>

            <div className="text-center">
              <div className="mb-6">
                <div className="w-32 h-32 bg-gradient-to-br from-pink-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-4xl">🎮</span>
                </div>
                <p className="text-gray-600">Ready to play? Get the game code from your host!</p>
              </div>

              <Button
                onClick={onJoinGame}
                variant="warning"
                size="lg"
                icon={Users}
                className="w-full"
              >
                Join Game
              </Button>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <div className="text-center text-white">
            <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-3">
              <Play className="w-6 h-6" />
            </div>
            <h3 className="font-semibold mb-2">Real-time Gameplay</h3>
            <p className="text-white/80 text-sm">Experience live quiz sessions with instant feedback</p>
          </div>
          <div className="text-center text-white">
            <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-3">
              <Trophy className="w-6 h-6" />
            </div>
            <h3 className="font-semibold mb-2">Live Leaderboard</h3>
            <p className="text-white/80 text-sm">Compete with others and climb the rankings</p>
          </div>
          <div className="text-center text-white">
            <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-3">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="font-semibold mb-2">Multiplayer Fun</h3>
            <p className="text-white/80 text-sm">Play with friends, family, or colleagues</p>
          </div>
        </div>
      </div>
    </div>
  );
};