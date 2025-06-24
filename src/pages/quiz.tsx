import { useEffect, useState } from 'react';

function Quiz() {
  interface Question {
    question: string;
    answers: string[];
  }

  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<string[]>([]);

  const fetchQuestions = async () => {
    const response = await fetch('/api/quiz');
    const data = await response.json();
    setQuestions(data);
  };

  const handleAnswer = (answer: string) => {
    setUserAnswers([...userAnswers, answer]);
    setCurrentQuestionIndex(currentQuestionIndex + 1);
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  if (questions.length === 0) return <div>Loading...</div>;

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">{currentQuestion.question}</h1>
      <div className="flex flex-col">
        {currentQuestion.answers.map((answer, index) => (
          <button
            key={index}
            className="bg-blue-500 text-white p-2 rounded mb-2"
            onClick={() => handleAnswer(answer)}
          >
            {answer}
          </button>
        ))}
      </div>
    </div>
  );
}

export default Quiz;