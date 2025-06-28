import { Quiz } from '../../utils/types';
import { NewQuizForm } from '../forms/new-quiz-form';
import { ArrowLeft, HelpCircle } from 'lucide-react';
import { Button } from '../ui/button';
import { useAppStore } from '../../store/app-store';
import { useState } from 'react';
import { NewQuestionForm } from '../forms/new-question-form';

export default function CreateQuizScreen() {
  const { setCurrentScreen, editingQuizId, setEditingQuizId, getEditingQuiz } = useAppStore();
  const [creatingQuestion, setCreatingQuestion] = useState(false);

  const handleQuizCreated = (quiz: Quiz) => {
    setEditingQuizId(quiz.id);
  };

  const quiz = getEditingQuiz();

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center mb-12 h-20">
        <Button
          onClick={() => setCurrentScreen('list-quizzes')}
          variant="secondary"
          icon={ArrowLeft}
          className="mr-4"
        >
          Back
        </Button>
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center">
            <HelpCircle className="w-7 h-7 text-purple-600" />
          </div>
          <h1 className="text-3xl font-bold text-white">
            {editingQuizId ? 'Edit' : 'Create'} Quiz
          </h1>
        </div>
      </div>

      {quiz === undefined ? (
        <NewQuizForm onSuccessCallback={handleQuizCreated} />
      ) : (
        <div className="bg-white/95 rounded-3xl p-8 shadow-2xl w-1/2 mx-auto">
          <h2 className="text-2xl font-bold">{quiz.title}</h2>
          <p className="mt-4">{quiz.description}</p>
        </div>
      )}

      {quiz !== undefined && (
        <div className="w-1/2 mx-auto mt-12">
          {quiz.questions.map((question, index) => (
            <div key={question.id} className="bg-white/95 rounded-3xl p-8 shadow-2xl mt-6 mb-2">
              <h3 className="text-xl font-bold mb-4">
                {index + 1}. {question.statement}
              </h3>
              <ul className="list-disc pl-5">
                {question.options.map((option, optIndex) => (
                  <li key={optIndex} className="mb-2">
                    {option.text} - {option.points} points
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {creatingQuestion ? (
            <>
              <NewQuestionForm onSuccessCallback={() => setCreatingQuestion(false)} />
              <div className="mt-6 mx-auto w-1/3">
                <Button
                  onClick={() => setCreatingQuestion(false)}
                  className="w-full"
                  variant="danger"
                >
                  Cancel
                </Button>
              </div>
            </>
          ) : (
            <div className="mt-6 mx-auto w-1/3">
              <Button
                onClick={() => setCreatingQuestion(true)}
                className="w-full"
                variant="primary"
              >
                Add Question
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
