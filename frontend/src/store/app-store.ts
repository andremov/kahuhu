import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { FinalResults, Game, QuestionResult, Quiz } from '../utils/types';
import { Temporal } from '@js-temporal/polyfill';

type ScreenOptions = 'home' | 'create-quiz' | 'create-game' | 'list-quizzes' | 'in-game';

type GamePhase = 'lobby' | 'question' | 'results' | 'final' | 'connecting' | 'creating';

interface AppState {
  currentScreen: ScreenOptions;
  setCurrentScreen: (state: ScreenOptions) => void;

  gamePhase: GamePhase | null;
  setGamePhase: (newState: GamePhase | null) => void;

  loadedQuizzes: Quiz[];
  addQuiz: (quiz: Quiz) => void;
  updateQuiz: (id: string, updates: Partial<Quiz>) => void;
  removeQuiz: (quizId: string) => void;
  clearQuizzes: () => void;

  editingQuizId: string | null;
  setEditingQuizId: (quizId: string | null) => void;
  getEditingQuiz: () => Quiz | undefined;

  hostingQuizId: string | null;
  setHostingQuizId: (quizId: string | null) => void;
  getHostingQuiz: () => Quiz | undefined;

  isHost: boolean;
  setIsHost: (isHost: boolean) => void;

  playerId: string | null;
  setPlayerId: (newId: string | null) => void;
  playerName: string | null;
  setPlayerName: (newName: string | null) => void;
  playerAnswers: number[] | null;
  setPlayerAnswers: (answers: number[] | null) => void;
  addPlayerAnswer: (answer: number) => void;

  joinedGameCode: string | null;
  setJoinedGameCode: (gameCode: string | null) => void;

  gameState: Game | null;
  setGameState: (newGameState: Game | null) => void;
  setTimeRemaining: (timeRemaining: number, questionIndex: number) => void;

  currentQuestionIndex: number;
  setCurrentQuestionIndex: (index: number) => void;

  questionResult: QuestionResult | null;
  setQuestionResult: (result: QuestionResult | null) => void;

  finalResults: FinalResults | null;
  setFinalResults: (results: FinalResults | null) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      gamePhase: null,
      setGamePhase: (newGameState) => set({ gamePhase: newGameState }),

      currentScreen: 'home',
      setCurrentScreen: (newScreen) => set({ currentScreen: newScreen }),

      loadedQuizzes: [],
      addQuiz: (quiz: Quiz) => {
        set((state) => ({
          loadedQuizzes: [...state.loadedQuizzes, quiz],
        }));
      },
      updateQuiz: (id: string, updates: Partial<Quiz>) => {
        set((state) => ({
          loadedQuizzes: state.loadedQuizzes.map((quiz) =>
            quiz.id === id ? { ...quiz, ...updates } : quiz
          ),
        }));
      },
      removeQuiz: (quizId: string) => {
        set((state) => ({
          loadedQuizzes: state.loadedQuizzes.filter((quiz) => quiz.id !== quizId),
        }));
      },
      clearQuizzes: () => {
        set({ loadedQuizzes: [] });
      },

      editingQuizId: null,
      setEditingQuizId: (quizId) => set({ editingQuizId: quizId }),
      getEditingQuiz: () => {
        const { loadedQuizzes, editingQuizId } = get();

        return loadedQuizzes.find((quiz) => quiz.id === editingQuizId);
      },

      hostingQuizId: null,
      setHostingQuizId: (quizId) => set({ hostingQuizId: quizId }),
      getHostingQuiz: () => {
        const { loadedQuizzes, hostingQuizId } = get();

        return loadedQuizzes.find((quiz) => quiz.id === hostingQuizId);
      },

      isHost: false,
      setIsHost: (isHost) => set({ isHost }),

      playerId: null,
      setPlayerId: (newId) => set({ playerId: newId }),
      playerName: null,
      setPlayerName: (newName) => set({ playerName: newName }),
      playerAnswers: null,
      setPlayerAnswers: (answers) => set({ playerAnswers: answers }),
      addPlayerAnswer: (answer) => {
        set((state) => ({
          playerAnswers: state.playerAnswers ? [...state.playerAnswers, answer] : [answer],
        }));
      },

      joinedGameCode: null,
      setJoinedGameCode: (gameCode) => set({ joinedGameCode: gameCode }),

      gameState: null,
      setGameState: (newGameState: Game | null) => {
        if (!newGameState) {
          return set({ gameState: null });
        }

        set({
          gameState: {
            ...newGameState,
            players: newGameState.players.map((p) => ({
              ...p,
              joinedAt: Temporal.PlainDateTime.from(p.joinedAt),
            })),
          },
        });
      },
      setTimeRemaining: (timeRemaining, questionIndex) => {
        set((state) => {
          if (state.currentQuestionIndex === questionIndex) {
            return {
              ...state,
              gameState: state.gameState ? { ...state.gameState, timeRemaining } : null,
            };
          } else {
            return state;
          }
        });
      },

      currentQuestionIndex: 0,
      setCurrentQuestionIndex: (index) => set({ currentQuestionIndex: index }),

      questionResult: null,
      setQuestionResult: (result) => {
        if (result === null) {
          set({ questionResult: null });
          return;
        }

        set((state) => {
          if (state.currentQuestionIndex === result.questionIndex) {
            return { questionResult: result };
          } else {
            return state;
          }
        });
      },

      finalResults: null,
      setFinalResults: (results) => set({ finalResults: results }),
    }),
    {
      name: 'kahuhu-app-storage',
      partialize: () => ({}),
    }
  )
);
