import { Server, Socket } from 'socket.io';
import createGameSocketEvent from './create-game';
import disconnectSocketEvent from './disconnect';
import joinGameSocketEvent from './join-game';
import nextQuestionSocketEvent from './next-question';
import startGameSocketEvent from './start-game';
import submitAnswerSocketEvent from './submit-answer';

export default function onSocketConnection(io: Server, socket: Socket) {
  console.log('User connected:', socket.id);

  socket.on('create-game', (quiz) => createGameSocketEvent(io, socket, quiz));

  socket.on('join-game', ({ gameCode, playerName }) =>
    joinGameSocketEvent(io, socket, { gameCode, playerName })
  );

  socket.on('start-game', () => startGameSocketEvent(io, socket));

  socket.on('submit-answer', ({ answerIndex }) =>
    submitAnswerSocketEvent(io, socket, { answerIndex })
  );

  socket.on('next-question', () => nextQuestionSocketEvent(io, socket));

  socket.on('disconnect', () => disconnectSocketEvent(io, socket));
}
