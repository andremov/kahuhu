import { ProgressBar } from '../ui/progress-bar';
import { useAppStore } from '../../store/app-store';
import { useEffect } from 'react';
import { Button } from '../ui/button';
import { AnswerShape } from '../ui/answer-shape';

interface QuestionScreenProps {
  onNextQuestion: () => void;
}

export default function QuestionResultsScreen({ onNextQuestion }: QuestionScreenProps) {
  const {
    setPlayerAnswers,
    gameState,
    isHost,
    playerAnswers,
    currentQuestionIndex,
    questionResult,
    playerId,
  } = useAppStore();

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

  if (!questionResult) {
    return <div></div>;
  }

  if (isHost) {
    return (
      <div className="container mx-auto px-4 py-6 min-h-screen flex flex-col gap-6">
        <div className="flex items-center justify-between md:h-28 gap-2 w-full md:flex-row flex-col">
          <div className="w-full md:w-1/4 md:h-full bg-white/95 backdrop-blur-sm rounded-md md:rounded-3xl p-3 md:p-6 shadow-md md:shadow-2xl text-center">
            <div className="text-xl md:text-3xl font-bold text-purple-600">
              {answeredCount} / {gameState.players.length}
            </div>
            <div className="text-gray-600 text-base md:text-base">players answered</div>
          </div>

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

          <Button
            onClick={onNextQuestion}
            className="w-full md:w-1/4 md:h-full bg-white/95 backdrop-blur-sm rounded-md md:rounded-3xl p-3 md:p-6 shadow-2xl text-center flex flex-col justify-between gap-2"
          >
            Next Question
          </Button>
        </div>

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

        {/* Answers */}
        <div className="w-full flex-1 flex gap-4">
          {currentQuestion.options.map((option, index) => {
            const totalPlayers = gameState.players.length;
            const answeredCount = questionResult.optionResults[index].count;
            const percentage = totalPlayers > 0 ? (answeredCount / totalPlayers) * 100 : 0;

            return (
              <div key={index} className="flex flex-col gap-2 flex-1">
                <div className="flex-1 mx-auto w-20">
                  <div
                    className="w-full"
                    style={{ maxHeight: 'calc(100% - 2.5rem)', height: `${100 - percentage}%` }}
                  ></div>
                  <div
                    className={`w-full min-h-10 bg-gradient-to-t ${getAnswerColors(index)} rounded-lg flex items-center justify-center text-white font-bold`}
                    style={{ height: `${percentage}%` }}
                  >
                    {percentage.toFixed(0)}%
                  </div>
                </div>
                <div className="bg-white rounded-xl p-2 text-center">{answeredCount} players</div>
                <div
                  className={`bg-white  rounded-xl p-2 text-center ${option.points > 0 ? 'text-green-500 font-bold' : 'text-gray-400'}`}
                >
                  +{option.points}
                </div>
                <div
                  className={`p-6 rounded-2xl text-white font-bold text-lg flex flex-col shadow-lg bg-gradient-to-r items-center gap-4 ${getAnswerColors(index)}`}
                >
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center text-2xl">
                    <AnswerShape index={index} />
                  </div>
                  <span className="flex-1 text-left text-sm">{option.text}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  } else {
    const myResults = questionResult.playerResults.find((result) => result.id === playerId)!;
    return (
      <div className="container mx-auto px-4 py-6 min-h-screen flex flex-col gap-6">
        <div className="flex items-center justify-between md:h-28 gap-2 w-full md:flex-row flex-col">
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
        </div>

        <div className="flex flex-col items-center justify-center flex-1">
          <div className="w-fit px-24 py-6 rounded-2xl bg-white text-center flex flex-col gap-4">
            {myResults.isCorrect ? (
              <div className="text-4xl text-green-500 font-bold">Correct!</div>
            ) : (
              <div className="text-4xl text-red-500 font-bold">Incorrect!</div>
            )}
            <div className="text-lg">You have {myResults.score} points.</div>{' '}
            {myResults.answer !== undefined && myResults.answer !== null ? (
              <div
                className={`p-2 bg-gradient-to-r rounded-xl text-3xl flex justify-center text-white ${getAnswerColors(myResults.answer)}`}
              >
                <AnswerShape index={myResults.answer} />
              </div>
            ) : (
              <div className="text-gray-500">No answer.</div>
            )}
          </div>
        </div>
      </div>
    );
  }
}
