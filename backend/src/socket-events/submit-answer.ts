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
    const currentQuestion = game.quizData.questions[game.currentQuestionIndex];
    const answerPoints = currentQuestion.options[Number(answerIndex)].points;
    const questionScore = calculateScore(
      game.timeRemaining,
      currentQuestion.timeLimit,
      answerPoints
    );

    player.score += questionScore;

    // Notify player of their answer submission
    socket.emit('answer-submitted', {
      answerIndex,
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
