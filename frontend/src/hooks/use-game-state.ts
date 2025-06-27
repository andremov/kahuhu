export const useGameState = (): UseGameStateReturn => {
  const resetGame = () => {
    setGameState(null);
    setPlayerId(null);
    setIsHost(false);
    setQuestionResult(null);
    setFinalResults(null);
    setError(null);
  };

  return {
    appState,
    gameState,
    playerId,
    isHost,
    questionResult,
    finalResults,
    error,
    isConnected,
    selectedQuizId,

    setSelectedQuizId,
    setAppState,
    createGame,
    joinGame,
    startGame,
    submitAnswer,
    nextQuestion,
    resetGame,
  };
};
