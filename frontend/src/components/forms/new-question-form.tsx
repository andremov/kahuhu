import { FormEvent, useState } from 'react';
import { v4 } from 'uuid';
import { Button } from '../button';
import { BadgeHelp } from 'lucide-react';
import { Question, QuestionOption } from '../../utils/types';
import { useAppStore } from '../../store/app-store';

interface NewQuizFormProps {
  onSuccessCallback: (question: Question) => void;
}

export function NewQuestionForm({ onSuccessCallback }: NewQuizFormProps) {
  const [questionStatement, setQuestionStatement] = useState('');
  const [options, setOptions] = useState<QuestionOption[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const { updateQuiz, editingQuizId, getEditingQuiz } = useAppStore();

  const handleCreateQuiz = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const baseQuiz = getEditingQuiz();

    if (
      !questionStatement.trim() ||
      options.length < 2 ||
      baseQuiz === undefined ||
      editingQuizId === null ||
      options.some(
        (option) => option.text.trim() === '' || isNaN(option.points) || option.points < 0
      ) ||
      options.every((option) => option.points === 0)
    ) {
      return;
    }

    setIsCreating(true);

    const question: Question = {
      id: v4(),
      statement: questionStatement.trim(),
      options: options.map((option) => ({
        text: option.text.trim(),
        points: option.points,
      })),
      timeLimit: 30, // Default time limit, can be adjusted later
    };

    updateQuiz(editingQuizId, { questions: [...baseQuiz.questions, question] });

    console.log('Question created successfully:', question);
    onSuccessCallback(question);

    setIsCreating(false);
  };

  const handleCreateOption = () => {
    setOptions((prev) => [...prev, { text: '', points: 0 }]);
  };

  const setQuestionText = (index: number, text: string) => {
    setOptions((prev) => prev.map((option, i) => (i === index ? { ...option, text } : option)));
  };

  const setQuestionPoints = (index: number, points: string) => {
    const pointsValue = parseInt(points, 10);
    if (isNaN(pointsValue) || pointsValue < 0) {
      return;
    }
    setOptions((prev) =>
      prev.map((option, i) => (i === index ? { ...option, points: pointsValue } : option))
    );
  };

  return (
    <div className="mx-auto">
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
              id="quizStatement"
              value={questionStatement}
              onChange={(e) => setQuestionStatement(e.target.value)}
              placeholder="Enter question statement..."
              className="w-full px-4 py-3 text-xl font-bold tracking-widest border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-colors"
              disabled={isCreating}
            />
          </div>

          <div>
            {options.map((option, index) => (
              <div className="flex gap-2 mb-2" key={index}>
                <input
                  type="text"
                  id="optionText"
                  value={option.text}
                  onChange={(e) => setQuestionText(index, e.target.value)}
                  placeholder="Enter the option text..."
                  className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-colors"
                  disabled={isCreating}
                />
                <input
                  type="number"
                  id="optionPoints"
                  value={option.points}
                  onChange={(e) => setQuestionPoints(index, e.target.value)}
                  placeholder="Enter the point value..."
                  className="w-24 px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-colors"
                  disabled={isCreating}
                />
              </div>
            ))}
            {options.length < 4 && (
              <div className="mt-2 w-1/3 mx-auto">
                <Button
                  variant="secondary"
                  type="button"
                  onClick={handleCreateOption}
                  disabled={isCreating}
                  className="w-full"
                >
                  Add Option
                </Button>
              </div>
            )}
          </div>

          <Button
            type="submit"
            disabled={
              isCreating ||
              !questionStatement.trim() ||
              options.length < 2 ||
              options.some(
                (option) => option.text.trim() === '' || isNaN(option.points) || option.points < 0
              ) ||
              options.every((option) => option.points === 0)
            }
            size="lg"
            className="w-full"
          >
            {isCreating ? 'Adding...' : 'Add question'}
          </Button>
        </form>
      </div>
    </div>
  );
}
