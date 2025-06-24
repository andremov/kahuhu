import { QuizHost } from "../components/quiz-host";

export default function HostPage() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Host Quiz</h1>
      <QuizHost />
    </div>
  );
}
