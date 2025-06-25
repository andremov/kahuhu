import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { getConfigValue } from '../utils/config';
// import { GameState, QuestionResult, FinalResults } from '../utils/types';

interface UseSocketReturn {
  socket: Socket | null;
  isConnected: boolean;
  createGame: (quiz: any) => void;
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
      socket.disconnect();
    };
  }, []);

  const createGame = (quiz: any) => {
    if (socketRef.current) {
      socketRef.current.emit('create-game', quiz);
    }
  };

  const joinGame = (gameCode: string, playerName: string) => {
    if (socketRef.current) {
      socketRef.current.emit('join-game', { gameCode, playerName });
    }
  };

  const startGame = () => {
    if (socketRef.current) {
      socketRef.current.emit('start-game');
    }
  };

  const submitAnswer = (answerIndex: number) => {
    if (socketRef.current) {
      socketRef.current.emit('submit-answer', { answerIndex });
    }
  };

  const nextQuestion = () => {
    if (socketRef.current) {
      socketRef.current.emit('next-question');
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
