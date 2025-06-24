import { useState, useEffect } from "react";
import { Quiz } from "../utils/types";

interface Player {
  name: string;
  score: number;
}

export function QuizHost() {
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [sessionId, setSessionId] = useState<string>("");
  const [players, setPlayers] = useState<Player[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(-1);
  const [ws, setWs] = useState<WebSocket | null>(null);

  useEffect(() => {
    const socket = new WebSocket("ws://localhost:3001");

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      switch (data.type) {
        case "playerJoined":
          setPlayers((prev) => [...prev, { name: data.playerName, score: 0 }]);
          break;
        case "playerAnswer":
          // Update player scores
          setPlayers((prev) =>
            prev.map((player) =>
              player.name === data.playerName
                ? { ...player, score: player.score + data.points }
                : player
            )
          );
          break;
      }
    };

    setWs(socket);
    return () => socket.close();
  }, []);

  const importQuiz = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const quiz = JSON.parse(e.target?.result as string);
        setQuiz(quiz);
        ws?.send(JSON.stringify({ type: "host", quiz }));
      } catch (err) {
        console.error("Failed to parse quiz file:", err);
      }
    };
    reader.readAsText(file);
  };

  const startQuiz = () => {
    setCurrentQuestionIndex(0);
    ws?.send(
      JSON.stringify({
        type: "startQuiz",
        sessionId,
      })
    );
  };

  const nextQuestion = () => {
    setCurrentQuestionIndex((prev) => prev + 1);
    ws?.send(
      JSON.stringify({
        type: "nextQuestion",
        sessionId,
        questionIndex: currentQuestionIndex + 1,
      })
    );
  };

  if (!quiz) {
    return (
      <div className="max-w-2xl mx-auto">
        <input
          type="file"
          accept=".json"
          onChange={importQuiz}
          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 
                   file:px-4 file:rounded-full file:border-0 file:text-sm 
                   file:font-semibold file:bg-blue-50 file:text-blue-700
                   hover:file:bg-blue-100"
        />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-4">
        <h2 className="text-xl font-bold">{quiz.title}</h2>
        <p>Session ID: {sessionId}</p>
        <p>Players: {players.length}</p>
      </div>

      {currentQuestionIndex === -1 ? (
        <button
          onClick={startQuiz}
          className="w-full p-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Start Quiz
        </button>
      ) : (
        <div>
          <div className="mb-4 p-4 border rounded bg-gray-50">
            <h3 className="text-lg font-bold mb-2">
              {quiz.questions[currentQuestionIndex].text}
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {quiz.questions[currentQuestionIndex].answers.map(
                (answer, index) => (
                  <div key={index} className="p-2 border rounded bg-white">
                    {answer}
                  </div>
                )
              )}
            </div>
          </div>
          {currentQuestionIndex < quiz.questions.length - 1 && (
            <button
              onClick={nextQuestion}
              className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Next Question
            </button>
          )}
        </div>
      )}

      <div className="mt-4">
        <h3 className="text-lg font-bold mb-2">Leaderboard</h3>
        {players
          .sort((a, b) => b.score - a.score)
          .map((player) => (
            <div key={player.name} className="p-2 border rounded mb-2">
              {player.name}: {player.score} points
            </div>
          ))}
      </div>
    </div>
  );
}
