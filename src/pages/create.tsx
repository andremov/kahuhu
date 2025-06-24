import { QuizCreator } from "../components/quiz-creator";

export default function CreatePage() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Create Quiz</h1>
      <QuizCreator />
    </div>
  );
}
