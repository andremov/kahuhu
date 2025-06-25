import { FormEvent, useState } from 'react';
import { requestCreateQuiz } from '../../utils/api';
import { Button } from '../button';
import { BadgeHelp } from 'lucide-react';
import { Quiz } from '../../utils/types';

interface NewQuizFormProps {
  onQuizCreated?: (quiz: Quiz) => void;
}

export function NewQuizForm({ onQuizCreated }: NewQuizFormProps) {
  const [quizTitle, setQuizTitle] = useState('');
  const [quizDescription, setQuizDescription] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCreateQuiz = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!quizTitle.trim() || !quizDescription.trim()) {
      return;
    }

    setIsCreating(true);

    try {
      const response = await requestCreateQuiz(quizTitle, quizDescription);
      console.log('Quiz created successfully:', response);
      onQuizCreated?.(response);
    } catch (error) {
      console.error('Error creating quiz:', error);
      setError(error instanceof Error ? error.message : 'An unexpected error occurred');
    }

    setIsCreating(false);
  };

  return (
    <div className="max-w-md mx-auto">
      <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-8 shadow-2xl">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-pink-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <BadgeHelp className="w-10 h-10 text-purple-600" />
          </div>
        </div>

        <form onSubmit={handleCreateQuiz} className="space-y-6">
          <div>
            <input
              type="text"
              id="quizTitle"
              value={quizTitle}
              onChange={(e) => setQuizTitle(e.target.value)}
              placeholder="Enter quiz title..."
              className="w-full px-4 py-3 text-xl font-bold tracking-widest border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-colors"
              disabled={isCreating}
            />
          </div>

          <div>
            <input
              type="text"
              id="quizDescription"
              value={quizDescription}
              onChange={(e) => setQuizDescription(e.target.value)}
              placeholder="Enter the quiz description..."
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-colors"
              disabled={isCreating}
            />
          </div>

          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
              <p className="text-red-600 text-sm font-medium">{error}</p>
            </div>
          )}

          <Button
            type="submit"
            disabled={
              isCreating || !quizTitle.trim() || !quizDescription.trim() || quizTitle.length < 2
            }
            size="lg"
            className="w-full"
          >
            {isCreating ? 'Creating...' : 'Create Quiz'}
          </Button>
        </form>
      </div>
    </div>
  );
}
