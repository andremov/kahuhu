import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { getConfigValue } from '../utils/config';
import { Quiz } from '../utils/types';

interface UseSocketReturn {
  socket: Socket | null;
  isConnected: boolean;
  createGame: (quiz: Quiz) => void;
  joinGame: (gameCode: string, playerName: string) => void;
  startGame: () => void;
  submitAnswer: (answerIndex: number) => void;
  nextQuestion: () => void;
}

export const useSocket = (): UseSocketReturn => {
  const socketRef = useRef<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Initialize socket connection
    socketRef.current = io(getConfigValue('apiAddress'), {
      transports: ['websocket'],
    });

    const socket = socketRef.current;

    socket.on('connect', () => {
      console.log('Connected to server');
      setIsConnected(true);
    });

    socket.on('disconnect', () => {
      console.log('Disconnected from server');
      setIsConnected(false);
    });

    socket.on('error', (error) => {
      console.error('Socket error:', error);
    });

    return () => {
      if (isConnected) socket.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const createGame = (quiz: Quiz) => {
    if (socketRef.current) {
      socketRef.current.emit('create-game', quiz);
    } else {
      console.error('Socket is not initialized. Could not create game.');
    }
  };

  const joinGame = (gameCode: string, playerName: string) => {
    if (socketRef.current) {
      socketRef.current.emit('join-game', { gameCode, playerName });
    } else {
      console.error('Socket is not initialized. Could not join game.');
    }
  };

  const startGame = () => {
    if (socketRef.current) {
      socketRef.current.emit('start-game');
    } else {
      console.error('Socket is not initialized. Could not start game.');
    }
  };

  const submitAnswer = (answerIndex: number) => {
    if (socketRef.current) {
      socketRef.current.emit('submit-answer', { answerIndex });
    } else {
      console.error('Socket is not initialized. Could not submit answer.');
    }
  };

  const nextQuestion = () => {
    if (socketRef.current) {
      socketRef.current.emit('next-question');
    } else {
      console.error('Socket is not initialized. Could not go to next question.');
    }
  };

  return {
    socket: socketRef.current,
    isConnected,
    createGame,
    joinGame,
    startGame,
    submitAnswer,
    nextQuestion,
  };
};
