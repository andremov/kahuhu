import { create } from "zustand";
import type { Quiz, QuestionOption } from "./types";
import { makeId } from "./score";

interface EditorOption extends QuestionOption {
  enabled: boolean;
}

interface EditorQuestion {
  id: string;
  statement: string;
  timeLimit: number;
  options: EditorOption[];
}

interface EditorState {
  title: string;
  description: string;
  questions: EditorQuestion[];
  setTitle: (v: string) => void;
  setDescription: (v: string) => void;
  addQuestion: () => void;
  removeQuestion: (id: string) => void;
  updateQuestion: (id: string, patch: Partial<EditorQuestion>) => void;
  toggleOption: (questionId: string, index: number) => void;
  updateOption: (
    questionId: string,
    index: number,
    patch: Partial<QuestionOption>,
  ) => void;
  reset: () => void;
  build: () => Quiz;
}

function blankQuestion(): EditorQuestion {
  return {
    id: makeId(),
    statement: "",
    timeLimit: 20,
    options: [
      { text: "", points: 100, enabled: true },
      { text: "", points: 0, enabled: true },
      { text: "", points: 0, enabled: true },
      { text: "", points: 0, enabled: true },
    ],
  };
}

export const useEditorStore = create<EditorState>((set, get) => ({
  title: "",
  description: "",
  questions: [blankQuestion()],

  setTitle: (v) => set({ title: v }),
  setDescription: (v) => set({ description: v }),

  addQuestion: () =>
    set((s) => ({ questions: [...s.questions, blankQuestion()] })),

  removeQuestion: (id) =>
    set((s) => ({
      questions:
        s.questions.length > 1
          ? s.questions.filter((q) => q.id !== id)
          : s.questions,
    })),

  updateQuestion: (id, patch) =>
    set((s) => ({
      questions: s.questions.map((q) => (q.id === id ? { ...q, ...patch } : q)),
    })),

  toggleOption: (questionId, index) =>
    set((s) => ({
      questions: s.questions.map((q) => {
        if (q.id !== questionId) return q;
        const options = q.options.map((o, i) =>
          i === index ? { ...o, enabled: !o.enabled } : o,
        );
        const enabledCount = options.filter((o) => o.enabled).length;
        if (enabledCount < 2) return q;
        return { ...q, options };
      }),
    })),

  updateOption: (questionId, index, patch) =>
    set((s) => ({
      questions: s.questions.map((q) =>
        q.id === questionId
          ? {
              ...q,
              options: q.options.map((o, i) =>
                i === index ? { ...o, ...patch } : o,
              ),
            }
          : q,
      ),
    })),

  reset: () =>
    set({ title: "", description: "", questions: [blankQuestion()] }),

  build: () => {
    const s = get();
    return {
      id: makeId(),
      title: s.title.trim(),
      description: s.description.trim(),
      questions: s.questions.map((q) => ({
        id: q.id,
        statement: q.statement.trim(),
        timeLimit: q.timeLimit,
        options: q.options
          .filter((o) => o.enabled && o.text.trim().length > 0)
          .map((o) => ({ text: o.text.trim(), points: o.points })),
      })),
    };
  },
}));

interface HostStagingState {
  stagedQuiz: Quiz | null;
  setStagedQuiz: (q: Quiz | null) => void;
}

export const useHostStaging = create<HostStagingState>((set) => ({
  stagedQuiz: null,
  setStagedQuiz: (q) => set({ stagedQuiz: q }),
}));
