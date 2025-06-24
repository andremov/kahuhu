import Navbar from "../components/nav-bar";

function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <Navbar />
      <h1 className="text-4xl font-bold mt-10">Welcome to Kahoot Clone</h1>
      <p className="mt-4 text-lg text-center">
        Create and participate in quizzes with friends and family!
      </p>
      <a
        href="/quiz"
        className="mt-6 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Start Quiz
      </a>
    </div>
  );
}

export default Home;
