import { ArrowLeft, Download, ListOrdered, Pencil, Play, PlusCircle, Trash2 } from 'lucide-react';
import { Button } from '../ui/button';
import { useAppStore } from '../../store/app-store';
import { Dropzone } from '../dropzone';
import { Quiz } from '../../utils/types';

interface QuizListScreenProps {
  onHostGame: (quizId?: string) => void;
}

export function QuizListScreen({ onHostGame }: QuizListScreenProps) {
  const { loadedQuizzes, setCurrentScreen, setEditingQuizId, removeQuiz, addQuiz } = useAppStore();

  const downloadQuiz = (quizId: string) => {
    const quiz = loadedQuizzes.find((q) => q.id === quizId);
    if (!quiz) return;

    const blob = new Blob([JSON.stringify(quiz, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${quiz.title}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleQuizAdded = (quiz: Quiz) => {
    addQuiz(quiz);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center mb-12 h-20">
        <Button
          onClick={() => setCurrentScreen('home')}
          variant="secondary"
          icon={ArrowLeft}
          className="mr-4"
        >
          Back
        </Button>
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center">
            <ListOrdered className="w-7 h-7 text-purple-600" />
          </div>
          <h1 className="text-3xl font-bold text-white">List Quizzes</h1>
        </div>
      </div>

      <div className="flex flex-col gap-8 max-w-4xl mx-auto mb-12">
        {loadedQuizzes.map((quiz) => (
          <div
            key={quiz.id}
            className={`relative p-6 rounded-3xl shadow-lg bg-white/95 backdrop-blur-sm`}
          >
            <h2 className="text-2xl font-bold mb-2">{quiz.title}</h2>
            <p className="text-gray-700">{quiz.description}</p>

            <div className="flex gap-4 mt-6 justify-end">
              <Button variant="primary" onClick={() => onHostGame(quiz.id)} icon={Play}>
                <p>Host</p>
              </Button>

              <Button
                type="button"
                variant="secondary"
                onClick={() => downloadQuiz(quiz.id)}
                icon={Download}
              >
                <p>Download</p>
              </Button>

              <Button
                variant="secondary"
                onClick={() => {
                  setEditingQuizId(quiz.id);
                  setCurrentScreen('create-quiz');
                }}
                icon={Pencil}
              >
                <p>Edit</p>
              </Button>

              <Button variant="danger" onClick={() => removeQuiz(quiz.id)} icon={Trash2}>
                <p>Delete</p>
              </Button>
            </div>
          </div>
        ))}

        {/* Drag and drop zone to add quizzes */}
        <Dropzone onQuizAdded={handleQuizAdded} existingQuizIds={loadedQuizzes.map((q) => q.id)} />

        <Button
          className="w-full max-w-md mx-auto"
          variant="primary"
          onClick={() => setCurrentScreen('create-quiz')}
        >
          <PlusCircle className="w-5 h-5 mr-2" />
          <p className="text-lg">Create New Quiz</p>
        </Button>
      </div>
    </div>
  );
}
