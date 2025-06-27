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

  // playerId: string | null;
  // isHost: boolean;
  // questionResult: QuestionResult | null;
  // finalResults: FinalResults | null;
  // error: string | null;
  // isConnected: boolean;
  // selectedQuizId: string | null;

  // setSelectedQuizId: (newId: string | null) => void;
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

      // playerId: null,
      // setPlayerId: (newId) => set({ selectedQuizId: newId }),
      // isHost: false,
      // setIsHost: (newId) => set({ selectedQuizId: newId }),
      // questionResult: null,
      // setQuestionResult: (newId) => set({ selectedQuizId: newId }),
      // finalResults: null,
      // setFinalResults: (newId) => set({ selectedQuizId: newId }),
      // error: null,
      // setError: (newId) => set({ selectedQuizId: newId }),
      // selectedQuizId: null,
      // setSelectedQuizId: (newId) => set({ selectedQuizId: newId }),
    }),
    {
      name: 'kahuhu-app-storage',
      partialize: () => ({}),
    }
  )
);
