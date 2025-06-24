import { Server, Socket } from 'socket.io';
import { getGameByCode, getPlayerBySocketId } from '../services/games';
import { calculateScore, handleQuestionEnd } from '../utils/functions';

export default function submitAnswerSocketEvent(
  io: Server,
  socket: Socket,
  { answerIndex }: { answerIndex: string }
) {
  try {
    const player = getPlayerBySocketId(socket.id);
    if (!player) return;

    const game = getGameByCode(player.gameCode);
    if (!game || game.gameState !== 'question') return;

    if (!player || player.answers[game.currentQuestionIndex] !== null) return;

    // Record answer
    player.answers[game.currentQuestionIndex] = Number(answerIndex);

    // Calculate score
    const currentQuestion = game.quizData!.questions[game.currentQuestionIndex];
    const isCorrect = Number(answerIndex) === currentQuestion.correctAnswer;
    const questionScore = calculateScore(isCorrect, game.timeRemaining, 60, currentQuestion.points);

    player.score += questionScore;

    // Notify player of their answer submission
    socket.emit('answer-submitted', {
      answerIndex,
      isCorrect,
      score: questionScore,
      totalScore: player.score,
    });

    // Check if all players have answered
    const allAnswered = Array.from(game.players.values()).every(
      (p) => p.answers[game.currentQuestionIndex] !== null
    );

    if (allAnswered) {
      handleQuestionEnd(io, game);
    }

    console.log(`Player ${player.name} submitted answer for question ${game.currentQuestionIndex}`);
  } catch (error) {
    console.error('Error submitting answer:', error);
    socket.emit('error', { message: 'Failed to submit answer' });
  }
}
