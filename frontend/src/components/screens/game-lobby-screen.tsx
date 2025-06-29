import { useEffect, useState } from 'react';
import { Play, Users, Copy, Check } from 'lucide-react';
import { Button } from '../ui/button';
import { useAppStore } from '../../store/app-store';

interface GameLobbyScreenProps {
  onStartGame: () => void;
}

export default function GameLobbyScreen({ onStartGame }: GameLobbyScreenProps) {
  const { gameState, setCurrentScreen, setGamePhase, isHost, playerId, setGameState } =
    useAppStore();
  const [copied, setCopied] = useState(false);

  const copyGameCode = async () => {
    if (!gameState?.code) {
      console.error('No game code available to copy');
      return;
    }

    try {
      await navigator.clipboard.writeText(gameState.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy game code:', err);
    }
  };

  const onLeaveGame = () => {
    setCurrentScreen('home');
    setGamePhase(null);
    setGameState(null);
  };

  useEffect(() => {
    if (!gameState) {
      setCurrentScreen('home');
      setGamePhase(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!gameState) {
    return <></>;
  }

  const sortedPlayers = [...gameState.players].sort((a, b) => a.joinedAt.since(b.joinedAt).seconds);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center space-x-3 mb-4">
          <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-lg">
            <Users className="w-7 h-7 text-purple-600" />
          </div>
          <h1 className="text-4xl font-bold text-white">Game Lobby</h1>
        </div>
        <h2 className="text-2xl text-white/90 font-semibold mb-2">{gameState.quizData.title}</h2>
        <p className="text-white/80">{gameState.quizData.description}</p>
      </div>

      {/* Game Code */}
      <div className="max-w-md mx-auto mb-8">
        <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-6 shadow-2xl text-center">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">Game Code</h3>
          <div className="flex items-center justify-center space-x-2 mb-4 flex-col md:flex-row gap-2">
            <div className="text-4xl font-bold tracking-widest text-purple-600 bg-purple-50 px-6 py-3 rounded-xl">
              {gameState.code}
            </div>
            <Button
              onClick={copyGameCode}
              variant="secondary"
              size="sm"
              icon={copied ? Check : Copy}
              className={copied ? 'text-green-600' : ''}
            >
              {copied ? 'Copied!' : 'Copy'}
            </Button>
          </div>
          <p className="text-gray-600 text-sm">Share this code with players to join the game</p>
        </div>
      </div>

      {/* Players List */}
      <div className="max-w-2xl mx-auto mb-8">
        <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-6 shadow-2xl">
          <div className="flex flex-col md:flex-row items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-800">
              Players ({gameState.players.length})
            </h3>
            <div className="text-sm text-gray-600">Waiting for more players...</div>
          </div>

          {gameState.players.length === 0 ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-gray-600">No players joined yet</p>
              <p className="text-gray-500 text-sm mt-1">Share the game code to get started!</p>
            </div>
          ) : (
            <div className="grid gap-3">
              {sortedPlayers.map((player) => (
                <div
                  key={player.id}
                  className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl"
                >
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold">
                    {player.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 flex gap-1">
                    <div className="font-semibold text-gray-800">{player.name}</div>
                    {player.id === playerId && (
                      <div className="font-semibold text-gray-300">(You)</div>
                    )}
                  </div>
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Quiz Info */}
      {isHost && (
        <div className="max-w-md mx-auto mb-8">
          <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-6 shadow-2xl text-center">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Quiz Details</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="bg-purple-50 p-3 rounded-xl">
                <div className="text-2xl font-bold text-purple-600">
                  {gameState.quizData.questions.length}
                </div>
                <div className="text-gray-600">Questions</div>
              </div>
              <div className="bg-pink-50 p-3 rounded-xl">
                <div className="text-2xl font-bold text-pink-600">
                  ~
                  {Math.ceil(
                    gameState.quizData.questions.reduce((acc, q) => acc + q.timeLimit, 0) / 60
                  )}
                </div>
                <div className="text-gray-600">Minutes</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="max-w-md mx-auto space-y-4">
        {isHost && (
          <Button
            onClick={onStartGame}
            disabled={gameState.players.length === 0}
            icon={Play}
            size="lg"
            className="w-full"
          >
            Start Game
          </Button>
        )}
        <Button onClick={onLeaveGame} variant="secondary" size="lg" className="w-full">
          Leave Game
        </Button>
      </div>
    </div>
  );
}
