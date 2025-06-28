import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Quiz } from '../utils/types';

type ScreenOptions = 'home' | 'create-quiz' | 'create-game' | 'list-quizzes' | 'in-game';

type GamePhase = 'lobby' | 'question' | 'results' | 'final' | 'connecting';

interface AppState {
  currentScreen: ScreenOptions;
  setCurrentScreen: (state: ScreenOptions) => void;

  gameState: GamePhase | null;
  setGameState: (newState: GamePhase | null) => void;

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
  gameCode: string | null;
  setGameCode: (newCode: string | null) => void;

  isConnected: boolean;
  setConnected: (connected: boolean) => void;

  // questionResult: QuestionResult | null;
  // finalResults: FinalResults | null;

  // createGame: (quiz: any) => void;
  // joinGame: (gameCode: string, playerName: string) => void;
  // startGame: () => void;
  // submitAnswer: (answerIndex: number) => void;
  // nextQuestion: () => void;
  // resetGame: () => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      gameState: null,
      setGameState: (newGameState) => set({ gameState: newGameState }),

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
      gameCode: null,
      setGameCode: (newCode) => set({ gameCode: newCode }),

      isConnected: false,
      setConnected: (connected) => set({ isConnected: connected }),
    }),
    {
      name: 'kahuhu-app-storage',
      partialize: () => ({}),
    }
  )
);
