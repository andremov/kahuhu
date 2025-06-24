import { useState } from "react";
import { Quiz, Question } from "../utils/types";

interface QuestionForm {
  text: string;
  answers: string[];
  correctAnswer: string;
  timeLimit: number;
}

export function QuizCreator() {
  const [quiz, setQuiz] = useState<Quiz>({
    id: crypto.randomUUID(),
    title: "",
    questions: [],
    createdAt: new Date().toISOString(),
  });

  const [currentQuestion, setCurrentQuestion] = useState<QuestionForm>({
    text: "",
    answers: ["", "", "", ""],
    correctAnswer: "",
    timeLimit: 30,
  });

  const addQuestion = () => {
    const question: Question = {
      id: crypto.randomUUID(),
      ...currentQuestion,
    };
    setQuiz((prev) => ({
      ...prev,
      questions: [...prev.questions, question],
    }));
    setCurrentQuestion({
      text: "",
      answers: ["", "", "", ""],
      correctAnswer: "",
      timeLimit: 30,
    });
  };

  const exportQuiz = () => {
    const blob = new Blob([JSON.stringify(quiz, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${quiz.title.toLowerCase().replace(/\s+/g, "-")}.quiz.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <input
        type="text"
        value={quiz.title}
        onChange={(e) =>
          setQuiz((prev) => ({ ...prev, title: e.target.value }))
        }
        className="w-full p-2 mb-6 border rounded"
        placeholder="Quiz Title"
      />

      <div className="mb-6 p-4 border rounded bg-gray-50">
        <input
          type="text"
          value={currentQuestion.text}
          onChange={(e) =>
            setCurrentQuestion((prev) => ({ ...prev, text: e.target.value }))
          }
          className="w-full p-2 mb-4 border rounded"
          placeholder="Question Text"
        />

        {currentQuestion.answers.map((answer, index) => (
          <input
            key={index}
            type="text"
            value={answer}
            onChange={(e) => {
              const newAnswers = [...currentQuestion.answers];
              newAnswers[index] = e.target.value;
              setCurrentQuestion((prev) => ({ ...prev, answers: newAnswers }));
            }}
            className="w-full p-2 mb-2 border rounded"
            placeholder={`Answer ${index + 1}`}
          />
        ))}

        <select
          value={currentQuestion.correctAnswer}
          onChange={(e) =>
            setCurrentQuestion((prev) => ({
              ...prev,
              correctAnswer: e.target.value,
            }))
          }
          className="w-full p-2 mb-4 border rounded"
        >
          <option value="">Select Correct Answer</option>
          {currentQuestion.answers.map((answer, index) => (
            <option key={index} value={answer}>
              {answer || `Answer ${index + 1}`}
            </option>
          ))}
        </select>

        <button
          onClick={addQuestion}
          className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Add Question
        </button>
      </div>

      {quiz.questions.length > 0 && (
        <button
          onClick={exportQuiz}
          className="w-full p-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Export Quiz
        </button>
      )}
    </div>
  );
}
