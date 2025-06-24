import React from 'react';
import { Trophy, Medal, Award, RotateCcw, Home } from 'lucide-react';
import { GameSession } from '../types';
import { Button } from './Button';

interface FinalResultsProps {
  gameSession: GameSession;
  onPlayAgain: () => void;
  onGoHome: () => void;
  isHost: boolean;
}

export const FinalResults: React.FC<FinalResultsProps> = ({
  gameSession,
  onPlayAgain,
  onGoHome,
  isHost,
}) => {
  const sortedPlayers = [...gameSession.players].sort((a, b) => b.score - a.score);
  const winner = sortedPlayers[0];
  const totalQuestions = gameSession.quiz.questions.length;

  const getPositionIcon = (index: number) => {
    if (index === 0) return <Trophy className="w-8 h-8 text-yellow-500" />;
    if (index === 1) return <Medal className="w-8 h-8 text-gray-400" />;
    if (index === 2) return <Award className="w-8 h-8 text-orange-500" />;
    return null;
  };

  const getPositionClass = (index: number) => {
    if (index === 0) return 'bg-gradient-to-r from-yellow-50 to-yellow-100 border-yellow-300 border-2';
    if (index === 1) return 'bg-gradient-to-r from-gray-50 to-gray-100 border-gray-300 border-2';
    if (index === 2) return 'bg-gradient-to-r from-orange-50 to-orange-100 border-orange-300 border-2';
    return 'bg-white border-gray-200 border';
  };

  const getCorrectAnswers = (player: any) => {
    return player.answers.filter((answer: number | null, index: number) => 
      answer === gameSession.quiz.questions[index].correctAnswer
    ).length;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400">
      <div className="container mx-auto px-4 py-8">
        {/* Celebration Header */}
        <div className="text-center mb-8">
          <div className="mb-6">
            <div className="text-8xl mb-4">🎉</div>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-2">
              Game Complete!
            </h1>
            <p className="text-xl text-white/90">
              {gameSession.quiz.title} • {totalQuestions} questions
            </p>
          </div>
        </div>

        {/* Winner Spotlight */}
        {winner && (
          <div className="max-w-md mx-auto mb-8">
            <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-3xl p-6 shadow-2xl text-center transform rotate-1">
              <div className="bg-white rounded-2xl p-6 transform -rotate-1">
                <Trophy className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-gray-800 mb-2">🏆 Winner!</h2>
                <h3 className="text-3xl font-bold text-yellow-600 mb-2">{winner.name}</h3>
                <p className="text-gray-600">
                  {winner.score} points • {getCorrectAnswers(winner)}/{totalQuestions} correct
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Final Leaderboard */}
        <div className="max-w-2xl mx-auto mb-8">
          <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-6 shadow-2xl">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
              Final Leaderboard
            </h2>
            
            <div className="space-y-4">
              {sortedPlayers.map((player, index) => (
                <div
                  key={player.id}
                  className={`flex items-center space-x-4 p-4 rounded-xl ${getPositionClass(index)}`}
                >
                  <div className="flex-shrink-0">
                    {getPositionIcon(index) || (
                      <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold">
                        {index + 1}
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-1">
                    <div className="font-bold text-gray-800 text-lg">{player.name}</div>
                    <div className="text-sm text-gray-600">
                      {getCorrectAnswers(player)}/{totalQuestions} correct answers
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-2xl font-bold text-purple-600">
                      {player.score}
                    </div>
                    <div className="text-sm text-gray-600">points</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Game Stats */}
        <div className="max-w-md mx-auto mb-8">
          <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-6 shadow-2xl">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">
              Game Statistics
            </h3>
            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="bg-purple-50 p-4 rounded-xl">
                <div className="text-2xl font-bold text-purple-600">
                  {gameSession.players.length}
                </div>
                <div className="text-sm text-gray-600">Players</div>
              </div>
              <div className="bg-pink-50 p-4 rounded-xl">
                <div className="text-2xl font-bold text-pink-600">
                  {totalQuestions}
                </div>
                <div className="text-sm text-gray-600">Questions</div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="max-w-md mx-auto space-y-4">
          {isHost && (
            <Button
              onClick={onPlayAgain}
              icon={RotateCcw}
              size="lg"
              className="w-full"
            >
              Play Again
            </Button>
          )}
          <Button
            onClick={onGoHome}
            variant="secondary"
            icon={Home}
            size="lg"
            className="w-full"
          >
            Back to Home
          </Button>
        </div>

        {/* Thank You Message */}
        <div className="text-center mt-12">
          <p className="text-white/80 text-lg">
            Thanks for playing! 🎮
          </p>
        </div>
      </div>
    </div>
  );
};