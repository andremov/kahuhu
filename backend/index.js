import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import { v4 as uuidv4 } from 'uuid';

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"]
  }
});

app.use(cors());
app.use(express.json());

// Game state storage
const games = new Map();
const players = new Map();

// Game management functions
const createGame = (quiz, hostSocketId) => {
  const gameCode = Math.random().toString(36).substring(2, 8).toUpperCase();
  const gameId = uuidv4();
  
  const game = {
    id: gameId,
    code: gameCode,
    quiz,
    players: new Map(),
    hostId: hostSocketId,
    currentQuestionIndex: 0,
    gameState: 'lobby', // lobby, question, results, final
    timeRemaining: 0,
    questionStartTime: null,
    createdAt: new Date()
  };
  
  games.set(gameCode, game);
  return { gameId, gameCode };
};

const joinGame = (gameCode, playerName, socketId) => {
  const game = games.get(gameCode);
  if (!game || game.gameState !== 'lobby') {
    return null;
  }
  
  const playerId = uuidv4();
  const player = {
    id: playerId,
    name: playerName,
    socketId,
    score: 0,
    answers: new Array(game.quiz.questions.length).fill(null),
    joinedAt: new Date()
  };
  
  game.players.set(playerId, player);
  players.set(socketId, { playerId, gameCode });
  
  return { playerId, game };
};

const calculateScore = (isCorrect, timeRemaining, totalTime, basePoints) => {
  if (!isCorrect) return 0;
  
  const timeBonus = Math.max(0, timeRemaining / totalTime);
  return Math.round(basePoints * (0.5 + 0.5 * timeBonus));
};

const getGameState = (game) => ({
  id: game.id,
  code: game.code,
  quiz: {
    id: game.quiz.id,
    title: game.quiz.title,
    description: game.quiz.description,
    questions: game.quiz.questions.map(q => ({
      id: q.id,
      question: q.question,
      answers: q.answers,
      timeLimit: q.timeLimit,
      points: q.points
    }))
  },
  players: Array.from(game.players.values()).map(p => ({
    id: p.id,
    name: p.name,
    score: p.score,
    joinedAt: p.joinedAt
  })),
  currentQuestionIndex: game.currentQuestionIndex,
  gameState: game.gameState,
  timeRemaining: game.timeRemaining
});

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('create-game', (quiz) => {
    try {
      const { gameId, gameCode } = createGame(quiz, socket.id);
      const game = games.get(gameCode);
      
      socket.join(gameCode);
      socket.emit('game-created', { gameCode, gameState: getGameState(game) });
      
      console.log(`Game created: ${gameCode} by ${socket.id}`);
    } catch (error) {
      socket.emit('error', { message: 'Failed to create game' });
    }
  });

  socket.on('join-game', ({ gameCode, playerName }) => {
    try {
      const result = joinGame(gameCode, playerName, socket.id);
      
      if (!result) {
        socket.emit('join-error', { message: 'Game not found or already started' });
        return;
      }
      
      const { playerId, game } = result;
      socket.join(gameCode);
      
      const gameState = getGameState(game);
      socket.emit('game-joined', { playerId, gameState });
      
      // Notify all players in the game about the new player
      io.to(gameCode).emit('player-joined', gameState);
      
      console.log(`Player ${playerName} joined game ${gameCode}`);
    } catch (error) {
      socket.emit('error', { message: 'Failed to join game' });
    }
  });

  socket.on('start-game', () => {
    try {
      const playerInfo = players.get(socket.id);
      if (!playerInfo) return;
      
      const game = games.get(playerInfo.gameCode);
      if (!game || game.hostId !== socket.id) return;
      
      game.gameState = 'question';
      game.currentQuestionIndex = 0;
      game.timeRemaining = game.quiz.questions[0].timeLimit;
      game.questionStartTime = Date.now();
      
      const gameState = getGameState(game);
      io.to(playerInfo.gameCode).emit('game-started', gameState);
      
      // Start question timer
      const questionTimer = setInterval(() => {
        game.timeRemaining--;
        
        if (game.timeRemaining <= 0) {
          clearInterval(questionTimer);
          handleQuestionEnd(game);
        } else {
          io.to(playerInfo.gameCode).emit('time-update', { timeRemaining: game.timeRemaining });
        }
      }, 1000);
      
      console.log(`Game ${playerInfo.gameCode} started`);
    } catch (error) {
      socket.emit('error', { message: 'Failed to start game' });
    }
  });

  socket.on('submit-answer', ({ answerIndex }) => {
    try {
      const playerInfo = players.get(socket.id);
      if (!playerInfo) return;
      
      const game = games.get(playerInfo.gameCode);
      if (!game || game.gameState !== 'question') return;
      
      const player = game.players.get(playerInfo.playerId);
      if (!player || player.answers[game.currentQuestionIndex] !== null) return;
      
      // Record answer
      player.answers[game.currentQuestionIndex] = answerIndex;
      
      // Calculate score
      const currentQuestion = game.quiz.questions[game.currentQuestionIndex];
      const isCorrect = answerIndex === currentQuestion.correctAnswer;
      const questionScore = calculateScore(
        isCorrect,
        game.timeRemaining,
        currentQuestion.timeLimit,
        currentQuestion.points
      );
      
      player.score += questionScore;
      
      // Notify player of their answer submission
      socket.emit('answer-submitted', { 
        answerIndex, 
        isCorrect, 
        score: questionScore,
        totalScore: player.score 
      });
      
      // Check if all players have answered
      const allAnswered = Array.from(game.players.values()).every(p => 
        p.answers[game.currentQuestionIndex] !== null
      );
      
      if (allAnswered) {
        handleQuestionEnd(game);
      }
      
      console.log(`Player ${player.name} submitted answer for question ${game.currentQuestionIndex}`);
    } catch (error) {
      socket.emit('error', { message: 'Failed to submit answer' });
    }
  });

  socket.on('next-question', () => {
    try {
      const playerInfo = players.get(socket.id);
      if (!playerInfo) return;
      
      const game = games.get(playerInfo.gameCode);
      if (!game || game.hostId !== socket.id) return;
      
      if (game.currentQuestionIndex + 1 >= game.quiz.questions.length) {
        // Game over
        game.gameState = 'final';
        const finalResults = getFinalResults(game);
        io.to(playerInfo.gameCode).emit('game-ended', finalResults);
      } else {
        // Next question
        game.currentQuestionIndex++;
        game.gameState = 'question';
        game.timeRemaining = game.quiz.questions[game.currentQuestionIndex].timeLimit;
        game.questionStartTime = Date.now();
        
        const gameState = getGameState(game);
        io.to(playerInfo.gameCode).emit('next-question', gameState);
        
        // Start next question timer
        const questionTimer = setInterval(() => {
          game.timeRemaining--;
          
          if (game.timeRemaining <= 0) {
            clearInterval(questionTimer);
            handleQuestionEnd(game);
          } else {
            io.to(playerInfo.gameCode).emit('time-update', { timeRemaining: game.timeRemaining });
          }
        }, 1000);
      }
    } catch (error) {
      socket.emit('error', { message: 'Failed to proceed to next question' });
    }
  });

  socket.on('disconnect', () => {
    try {
      const playerInfo = players.get(socket.id);
      if (playerInfo) {
        const game = games.get(playerInfo.gameCode);
        if (game) {
          // Remove player from game
          game.players.delete(playerInfo.playerId);
          
          // If host disconnected, end the game
          if (game.hostId === socket.id) {
            io.to(playerInfo.gameCode).emit('host-disconnected');
            games.delete(playerInfo.gameCode);
          } else {
            // Notify remaining players
            const gameState = getGameState(game);
            io.to(playerInfo.gameCode).emit('player-left', gameState);
          }
        }
        players.delete(socket.id);
      }
      
      console.log('User disconnected:', socket.id);
    } catch (error) {
      console.error('Error handling disconnect:', error);
    }
  });
});

const handleQuestionEnd = (game) => {
  game.gameState = 'results';
  
  const currentQuestion = game.quiz.questions[game.currentQuestionIndex];
  const questionResults = {
    questionIndex: game.currentQuestionIndex,
    correctAnswer: currentQuestion.correctAnswer,
    correctAnswerText: currentQuestion.answers[currentQuestion.correctAnswer],
    playerResults: Array.from(game.players.values()).map(player => ({
      id: player.id,
      name: player.name,
      answer: player.answers[game.currentQuestionIndex],
      isCorrect: player.answers[game.currentQuestionIndex] === currentQuestion.correctAnswer,
      score: player.score
    }))
  };
  
  io.to(game.code).emit('question-ended', questionResults);
  
  // Auto-advance to next question after 5 seconds
  setTimeout(() => {
    if (game.gameState === 'results') {
      if (game.currentQuestionIndex + 1 >= game.quiz.questions.length) {
        // Game over
        game.gameState = 'final';
        const finalResults = getFinalResults(game);
        io.to(game.code).emit('game-ended', finalResults);
      } else {
        // Next question
        game.currentQuestionIndex++;
        game.gameState = 'question';
        game.timeRemaining = game.quiz.questions[game.currentQuestionIndex].timeLimit;
        game.questionStartTime = Date.now();
        
        const gameState = getGameState(game);
        io.to(game.code).emit('next-question', gameState);
        
        // Start next question timer
        const questionTimer = setInterval(() => {
          game.timeRemaining--;
          
          if (game.timeRemaining <= 0) {
            clearInterval(questionTimer);
            handleQuestionEnd(game);
          } else {
            io.to(game.code).emit('time-update', { timeRemaining: game.timeRemaining });
          }
        }, 1000);
      }
    }
  }, 5000);
};

const getFinalResults = (game) => {
  const sortedPlayers = Array.from(game.players.values())
    .sort((a, b) => b.score - a.score);
  
  return {
    quiz: {
      title: game.quiz.title,
      totalQuestions: game.quiz.questions.length
    },
    players: sortedPlayers.map((player, index) => ({
      id: player.id,
      name: player.name,
      score: player.score,
      position: index + 1,
      correctAnswers: player.answers.filter((answer, qIndex) => 
        answer === game.quiz.questions[qIndex].correctAnswer
      ).length
    }))
  };
};

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});