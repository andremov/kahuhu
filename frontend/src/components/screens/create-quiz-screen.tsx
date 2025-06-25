import { useState } from 'react';
import { Quiz } from '../../utils/types';
import { NewQuizForm } from '../forms/new-quiz-form';
import { LoadingSpinner } from '../loading-spinner';
import { ArrowLeft, HelpCircle } from 'lucide-react';
import { Button } from '../ui/button';

interface CreateQuizScreenProps {
  quizId?: string;
  onBack: () => void;
}

export function CreateQuizScreen({ quizId, onBack }: CreateQuizScreenProps) {
  const [quiz, setQuiz] = useState<Quiz | null>(null);

  const handleQuizCreated = (quiz: Quiz) => {
    setQuiz(quiz);
    console.log('Quiz created successfully!');
  };

  if (quizId && !quiz) {
    return <LoadingSpinner />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center mb-12 h-20">
        <Button onClick={onBack} variant="secondary" icon={ArrowLeft} className="mr-4">
          Back
        </Button>
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center">
            <HelpCircle className="w-7 h-7 text-purple-600" />
          </div>
          <h1 className="text-3xl font-bold text-white">Quiz List</h1>
        </div>
      </div>

      {quiz === null ? (
        <NewQuizForm onQuizCreated={handleQuizCreated} />
      ) : (
        <div className="bg-white/95 rounded-3xl p-8 shadow-2xl">
          <h2>{quiz.title}</h2>
          <p>{quiz.description}</p>
        </div>
      )}
    </div>
  );
}
