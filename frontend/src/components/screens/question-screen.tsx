import { Timer } from '../ui/timer';
import { ProgressBar } from '../ui/progress-bar';
import { useAppStore } from '../../store/app-store';
import { useEffect } from 'react';

interface QuestionScreenProps {
  onSubmitAnswer: (answerIndex: number) => void;
}

export default function QuestionScreen({ onSubmitAnswer }: QuestionScreenProps) {
  const { setPlayerAnswers, gameState, isHost, playerAnswers, currentQuestionIndex } =
    useAppStore();

  useEffect(() => {
    if (!isHost && playerAnswers === null) setPlayerAnswers([]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!gameState || !gameState.quizData) {
    return <div className="text-center text-white">Loading...</div>;
  }

  const currentQuestion = gameState.quizData.questions[gameState.currentQuestionIndex];

  const answeredCount = gameState.players.length; // This would need to be tracked properly in real implementation

  const getAnswerColors = (index: number) => {
    const colors = [
      'from-red-500 to-red-600',
      'from-blue-500 to-blue-600',
      'from-yellow-500 to-yellow-600',
      'from-green-500 to-green-600',
    ];
    return colors[index] || colors[0];
  };

  const getAnswerHoverColors = (index: number) => {
    const hoverColors = [
      'hover:from-red-600 hover:to-red-700',
      'hover:from-blue-600 hover:to-blue-700',
      'hover:from-yellow-600 hover:to-yellow-700',
      'hover:from-green-600 hover:to-green-700',
    ];
    return hoverColors[index] || hoverColors[0];
  };

  const getAnswerShapes = (index: number) => {
    const shapes = ['▲', '♦', '●', '■'];
    return shapes[index] || shapes[0];
  };

  const hasAnswered = isHost
    ? false
    : playerAnswers === null || playerAnswers.length > currentQuestionIndex;

  const currentAnswerIndex = playerAnswers ? playerAnswers[currentQuestionIndex] : null;

  if (gameState.timeRemaining > gameState.quizData.questions[currentQuestionIndex].timeLimit) {
    const startCountdown =
      gameState.timeRemaining - gameState.quizData.questions[currentQuestionIndex].timeLimit;

    return (
      <div className="relative min-h-screen w-full flex items-center justify-center">
        <p className="absolute text-9xl text-white blur-xs font-serif animate-ping">
          {startCountdown}
        </p>
        <p className="text-9xl text-white font-serif">{startCountdown}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 min-h-screen flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between md:h-28 gap-2 w-full md:flex-row flex-col">
        {isHost && (
          <div className="w-full md:w-1/4 md:h-full bg-white/95 backdrop-blur-sm rounded-md md:rounded-3xl p-3 md:p-6 shadow-md md:shadow-2xl text-center">
            <div className="text-xl md:text-3xl font-bold text-purple-600">
              {answeredCount} / {gameState.players.length}
            </div>
            <div className="text-gray-600 text-base md:text-base">players answered</div>
          </div>
        )}

        <div className="w-full md:flex-1 md:h-full bg-white/95 backdrop-blur-sm rounded-md md:rounded-3xl p-3 md:p-6 shadow-2xl text-center flex flex-col items-center gap-2">
          <span className="hidden md:block text-xl font-bold">Question Progress</span>

          <div className="h-4 md:h-12 w-full">
            <ProgressBar
              current={gameState.currentQuestionIndex + 1}
              total={gameState.quizData.questions.length}
              className="w-48 relative"
            />
          </div>
        </div>

        <div className="w-full md:w-1/4 md:h-full bg-white/95 backdrop-blur-sm rounded-md md:rounded-3xl p-3 md:p-6 shadow-2xl text-center flex flex-col justify-between gap-2">
          <Timer
            timeRemaining={gameState.timeRemaining}
            totalTime={currentQuestion.timeLimit}
            isRunning={!hasAnswered}
          />
        </div>
      </div>

      {/* Question */}
      {isHost && (
        <div className="w-full">
          <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-8 shadow-2xl text-center">
            <div className="mb-4">
              <div className="inline-flex items-center space-x-2 bg-purple-100 px-4 py-2 rounded-full">
                <span className="text-purple-600 font-semibold">
                  Question {gameState.currentQuestionIndex + 1}
                </span>
              </div>
            </div>
            <h1 className="text-2xl md:text-4xl font-bold text-gray-800 leading-tight">
              {currentQuestion.statement}
            </h1>
          </div>
        </div>
      )}

      {/* Answers */}
      <div className="w-full flex-1 grid md:grid-cols-2 gap-4">
        {currentQuestion.options.map((option, index) =>
          isHost ? (
            <div
              key={index}
              className={`
                    p-6 rounded-2xl text-white font-bold text-lg transition-all duration-200 transform shadow-lg bg-gradient-to-r flex items-center gap-4 ${getAnswerColors(index)}
                  `}
            >
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center text-2xl">
                {getAnswerShapes(index)}
              </div>
              <span className="flex-1 text-left">{option.text}</span>
            </div>
          ) : (
            <button
              key={index}
              onClick={() => !hasAnswered && onSubmitAnswer(index)}
              disabled={hasAnswered || gameState.timeRemaining <= 0}
              className={`
                    p-1 md:p-6 rounded-md md:rounded-2xl text-white font-bold text-8xl transition-all duration-200 transform disabled:cursor-not-allowed
                    ${
                      hasAnswered || gameState.timeRemaining <= 0
                        ? currentAnswerIndex === index
                          ? ''
                          : 'opacity-50'
                        : 'hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl'
                    }
                    bg-gradient-to-r ${getAnswerColors(index)} ${getAnswerHoverColors(index)}
                  `}
            >
              {getAnswerShapes(index)}
            </button>
          )
        )}
      </div>
    </div>
  );
}
