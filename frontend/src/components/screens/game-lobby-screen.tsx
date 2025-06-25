import React, { useState } from 'react';
import { Play, Users, Copy, Check, Crown } from 'lucide-react';
import { Button } from '../ui/button';
import { GameState } from '../../utils/types';

interface GameLobbyScreenProps {
  gameState: GameState;
  isHost: boolean;
  onStartGame: () => void;
  onLeaveGame: () => void;
}

export const GameLobbyScreen: React.FC<GameLobbyScreenProps> = ({
  gameState,
  isHost,
  onStartGame,
  onLeaveGame,
}) => {
  const [copied, setCopied] = useState(false);

  const copyGameCode = async () => {
    try {
      await navigator.clipboard.writeText(gameState.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy game code:', err);
    }
  };

  const sortedPlayers = [...gameState.players].sort(
    (a, b) => a.joinedAt.getTime() - b.joinedAt.getTime()
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-lg">
              <Users className="w-7 h-7 text-purple-600" />
            </div>
            <h1 className="text-4xl font-bold text-white">Game Lobby</h1>
          </div>
          <h2 className="text-2xl text-white/90 font-semibold mb-2">{gameState.quiz.title}</h2>
          <p className="text-white/80">{gameState.quiz.description}</p>
        </div>

        {/* Game Code */}
        <div className="max-w-md mx-auto mb-8">
          <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-6 shadow-2xl text-center">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Game Code</h3>
            <div className="flex items-center justify-center space-x-2 mb-4">
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
            <div className="flex items-center justify-between mb-6">
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
                {sortedPlayers.map((player, index) => (
                  <div
                    key={player.id}
                    className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl"
                  >
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold">
                      {index === 0 && isHost ? (
                        <Crown className="w-5 h-5" />
                      ) : (
                        player.name.charAt(0).toUpperCase()
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-gray-800">
                        {player.name}
                        {index === 0 && isHost && (
                          <span className="ml-2 text-sm bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
                            Host
                          </span>
                        )}
                      </div>
                      <div className="text-sm text-gray-500">
                        Joined {player.joinedAt.toLocaleTimeString()}
                      </div>
                    </div>
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Quiz Info */}
        <div className="max-w-md mx-auto mb-8">
          <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-6 shadow-2xl text-center">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Quiz Details</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="bg-purple-50 p-3 rounded-xl">
                <div className="text-2xl font-bold text-purple-600">
                  {gameState.quiz.questions.length}
                </div>
                <div className="text-gray-600">Questions</div>
              </div>
              <div className="bg-pink-50 p-3 rounded-xl">
                <div className="text-2xl font-bold text-pink-600">
                  ~
                  {Math.ceil(
                    gameState.quiz.questions.reduce((acc, q) => acc + q.timeLimit, 0) / 60
                  )}
                </div>
                <div className="text-gray-600">Minutes</div>
              </div>
            </div>
          </div>
        </div>

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
    </div>
  );
};
