import { useState } from 'react';
import { Quiz } from '../../utils/types';
import { NewQuizForm } from '../forms/new-quiz-form';

export function CreateQuizScreen() {
  const [quiz, setQuiz] = useState<Quiz | null>(null);

  const handleQuizCreated = (quiz: Quiz) => {
    setQuiz(quiz);
    console.log('Quiz created successfully!');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400">
      <div className="container mx-auto px-4 py-8">
        {quiz === null ? (
          <NewQuizForm onQuizCreated={handleQuizCreated} />
        ) : (
          <div className="bg-white/95 rounded-3xl p-8 shadow-2xl">
            <h2>{quiz.title}</h2>
            <p>{quiz.description}</p>
          </div>
        )}
      </div>
    </div>
  );
}
