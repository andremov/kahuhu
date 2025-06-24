import React, { useEffect } from 'react';
import { Timer } from './Timer';
import { ProgressBar } from './ProgressBar';
import { GameSession } from '../types';
import { useTimer } from '../hooks/useTimer';

interface QuestionScreenProps {
  gameSession: GameSession;
  playerId?: string;
  onSubmitAnswer: (answerIndex: number) => void;
  onTimeUp: () => void;
  isHost: boolean;
}

export const QuestionScreen: React.FC<QuestionScreenProps> = ({
  gameSession,
  playerId,
  onSubmitAnswer,
  onTimeUp,
  isHost,
}) => {
  const currentQuestion = gameSession.quiz.questions[gameSession.currentQuestionIndex];
  const { timeRemaining, isRunning, start, stop } = useTimer(
    currentQuestion.timeLimit,
    onTimeUp
  );

  const currentPlayer = playerId ? gameSession.players.find(p => p.id === playerId) : null;
  const hasAnswered = currentPlayer ? 
    currentPlayer.answers[gameSession.currentQuestionIndex] !== null : false;

  const answeredCount = gameSession.players.filter(player => 
    player.answers[gameSession.currentQuestionIndex] !== null
  ).length;

  useEffect(() => {
    start();
    return () => stop();
  }, [start, stop, gameSession.currentQuestionIndex]);

  const getAnswerColors = (index: number) => {
    const colors = [
      'from-red-500 to-red-600 hover:from-red-600 hover:to-red-700',
      'from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700',
      'from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700',
      'from-green-500 to-green-600 hover:from-green-600 hover:to-green-700',
    ];
    return colors[index] || colors[0];
  };

  const getAnswerShapes = (index: number) => {
    const shapes = ['▲', '♦', '●', '■'];
    return shapes[index] || shapes[0];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <ProgressBar
              current={gameSession.currentQuestionIndex + 1}
              total={gameSession.quiz.questions.length}
              className="w-48 relative"
            />
          </div>
          <Timer
            timeRemaining={timeRemaining}
            totalTime={currentQuestion.timeLimit}
            isRunning={isRunning && !hasAnswered}
          />
        </div>

        {/* Question */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-8 shadow-2xl text-center">
            <div className="mb-4">
              <div className="inline-flex items-center space-x-2 bg-purple-100 px-4 py-2 rounded-full">
                <span className="text-purple-600 font-semibold">
                  Question {gameSession.currentQuestionIndex + 1}
                </span>
                <span className="text-purple-400">•</span>
                <span className="text-purple-600 font-semibold">
                  {currentQuestion.points} points
                </span>
              </div>
            </div>
            <h1 className="text-2xl md:text-4xl font-bold text-gray-800 leading-tight">
              {currentQuestion.question}
            </h1>
          </div>
        </div>

        {/* Answers */}
        {!isHost && (
          <div className="max-w-4xl mx-auto mb-8">
            <div className="grid md:grid-cols-2 gap-4">
              {currentQuestion.answers.map((answer, index) => {
                const isSelected = currentPlayer?.answers[gameSession.currentQuestionIndex] === index;
                
                return (
                  <button
                    key={index}
                    onClick={() => !hasAnswered && onSubmitAnswer(index)}
                    disabled={hasAnswered || timeRemaining <= 0}
                    className={`
                      p-6 rounded-2xl text-white font-bold text-lg transition-all duration-200 transform
                      ${hasAnswered || timeRemaining <= 0 
                        ? 'opacity-50 cursor-not-allowed' 
                        : 'hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl'
                      }
                      ${isSelected 
                        ? 'ring-4 ring-white ring-opacity-50 scale-105' 
                        : ''
                      }
                      bg-gradient-to-r ${getAnswerColors(index)}
                    `}
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center text-2xl">
                        {getAnswerShapes(index)}
                      </div>
                      <span className="flex-1 text-left">{answer}</span>
                      {isSelected && (
                        <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
                          <div className="w-3 h-3 bg-green-500 rounded-full" />
                        </div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            {hasAnswered && (
              <div className="text-center mt-6">
                <div className="inline-flex items-center space-x-2 bg-green-100 text-green-800 px-6 py-3 rounded-full font-semibold">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                  <span>Answer submitted! Waiting for others...</span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Host View */}
        {isHost && (
          <div className="max-w-2xl mx-auto">
            <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-6 shadow-2xl">
              <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">
                Players Progress
              </h3>
              <div className="text-center mb-6">
                <div className="text-3xl font-bold text-purple-600">
                  {answeredCount} / {gameSession.players.length}
                </div>
                <div className="text-gray-600">players answered</div>
              </div>
              
              <div className="space-y-3">
                {gameSession.players.map((player) => {
                  const hasPlayerAnswered = player.answers[gameSession.currentQuestionIndex] !== null;
                  return (
                    <div
                      key={player.id}
                      className={`flex items-center space-x-3 p-3 rounded-xl ${
                        hasPlayerAnswered ? 'bg-green-50 border border-green-200' : 'bg-gray-50'
                      }`}
                    >
                      <div className={`w-3 h-3 rounded-full ${
                        hasPlayerAnswered ? 'bg-green-500' : 'bg-gray-300'
                      }`} />
                      <span className="flex-1 font-medium text-gray-800">
                        {player.name}
                      </span>
                      {hasPlayerAnswered && (
                        <span className="text-green-600 text-sm font-semibold">
                          ✓ Answered
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};