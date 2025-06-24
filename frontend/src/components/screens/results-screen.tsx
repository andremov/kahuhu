import React from 'react';
import { Trophy, Medal, Award } from 'lucide-react';
import { GameState, QuestionResult } from '../../types';
import { Button } from '../ui/button';

interface ResultsScreenProps {
  gameState: GameState;
  questionResult: QuestionResult;
  onContinue: () => void;
  isHost: boolean;
}

export const ResultsScreen: React.FC<ResultsScreenProps> = ({
  gameState,
  questionResult,
  onContinue,
  isHost,
}) => {
  const currentQuestion = gameState.quiz.questions[questionResult.questionIndex];

  // Sort players by score for this question
  const sortedPlayers = questionResult.playerResults
    .sort((a, b) => b.score - a.score);

  const getPositionIcon = (index: number) => {
    if (index === 0) return <Trophy className="w-6 h-6 text-yellow-500" />;
    if (index === 1) return <Medal className="w-6 h-6 text-gray-400" />;
    if (index === 2) return <Award className="w-6 h-6 text-orange-500" />;
    return null;
  };

  const getPositionClass = (index: number) => {
    if (index === 0) return 'bg-gradient-to-r from-yellow-50 to-yellow-100 border-yellow-200';
    if (index === 1) return 'bg-gradient-to-r from-gray-50 to-gray-100 border-gray-200';
    if (index === 2) return 'bg-gradient-to-r from-orange-50 to-orange-100 border-orange-200';
    return 'bg-white border-gray-200';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-600 via-blue-600 to-purple-600">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-lg">
              <Trophy className="w-7 h-7 text-green-600" />
            </div>
            <h1 className="text-4xl font-bold text-white">Results</h1>
          </div>
        </div>

        {/* Question Results */}
        <div className="max-w-2xl mx-auto mb-8">
          <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-6 shadow-2xl">
            <h2 className="text-xl font-bold text-gray-800 mb-4 text-center">
              Question {questionResult.questionIndex + 1} Results
            </h2>
            
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl">
              <h3 className="font-semibold text-gray-800 mb-2">Correct Answer:</h3>
              <p className="text-green-700 font-medium">{questionResult.correctAnswerText}</p>
            </div>

            <div className="space-y-3">
              {sortedPlayers.map((player, index) => (
                <div
                  key={player.id}
                  className={`flex items-center space-x-4 p-4 border-2 rounded-xl ${getPositionClass(index)}`}
                >
                  <div className="flex-shrink-0">
                    {getPositionIcon(index) || (
                      <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                        {index + 1}
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-1">
                    <div className="font-semibold text-gray-800">{player.name}</div>
                    <div className="text-sm text-gray-600">
                      {player.isCorrect ? '✓ Correct' : '✗ Incorrect'}
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-lg font-bold text-purple-600">
                      {player.score}
                    </div>
                    <div className="text-sm text-gray-600">points</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="max-w-md mx-auto mb-8">
          <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-6 shadow-2xl">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">
              Quick Stats
            </h3>
            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="bg-green-50 p-4 rounded-xl">
                <div className="text-2xl font-bold text-green-600">
                  {sortedPlayers.filter(p => p.isCorrect).length}
                </div>
                <div className="text-sm text-gray-600">Correct</div>
              </div>
              <div className="bg-red-50 p-4 rounded-xl">
                <div className="text-2xl font-bold text-red-600">
                  {sortedPlayers.filter(p => !p.isCorrect).length}
                </div>
                <div className="text-sm text-gray-600">Incorrect</div>
              </div>
            </div>
          </div>
        </div>

        {/* Continue Button */}
        {isHost && (
          <div className="text-center">
            <Button
              onClick={onContinue}
              size="lg"
              className="px-12"
            >
              Next Question
            </Button>
          </div>
        )}

        {!isHost && (
          <div className="text-center">
            <div className="inline-flex items-center space-x-2 bg-white/20 text-white px-6 py-3 rounded-full font-semibold">
              <div className="w-3 h-3 bg-white rounded-full animate-pulse" />
              <span>Waiting for host to continue...</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};