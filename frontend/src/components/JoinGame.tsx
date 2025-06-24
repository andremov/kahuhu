import React, { useState } from 'react';
import { ArrowLeft, Users, UserPlus } from 'lucide-react';
import { Button } from './Button';

interface JoinGameProps {
  onBack: () => void;
  onJoinGame: (gameCode: string, playerName: string) => boolean;
}

export const JoinGame: React.FC<JoinGameProps> = ({ onBack, onJoinGame }) => {
  const [gameCode, setGameCode] = useState('');
  const [playerName, setPlayerName] = useState('');
  const [error, setError] = useState('');
  const [isJoining, setIsJoining] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!gameCode.trim() || !playerName.trim()) {
      setError('Please enter both game code and your name');
      return;
    }

    if (playerName.length < 2) {
      setError('Name must be at least 2 characters long');
      return;
    }

    setIsJoining(true);
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const success = onJoinGame(gameCode.toUpperCase().trim(), playerName.trim());
    
    if (!success) {
      setError('Game not found. Please check the code and try again.');
      setIsJoining(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-600 via-purple-500 to-indigo-600">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center mb-8">
          <Button
            onClick={onBack}
            variant="secondary"
            icon={ArrowLeft}
            className="mr-4"
          >
            Back
          </Button>
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center">
              <Users className="w-6 h-6 text-purple-600" />
            </div>
            <h1 className="text-3xl font-bold text-white">Join Game</h1>
          </div>
        </div>

        {/* Join Form */}
        <div className="max-w-md mx-auto">
          <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-8 shadow-2xl">
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-gradient-to-br from-pink-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <UserPlus className="w-10 h-10 text-purple-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Ready to Play?</h2>
              <p className="text-gray-600">Enter the game code and your name to join the fun!</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="gameCode" className="block text-sm font-semibold text-gray-700 mb-2">
                  Game Code
                </label>
                <input
                  type="text"
                  id="gameCode"
                  value={gameCode}
                  onChange={(e) => setGameCode(e.target.value.toUpperCase())}
                  placeholder="Enter 6-digit code"
                  maxLength={6}
                  className="w-full px-4 py-3 text-center text-2xl font-bold tracking-widest border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-colors"
                  disabled={isJoining}
                />
              </div>

              <div>
                <label htmlFor="playerName" className="block text-sm font-semibold text-gray-700 mb-2">
                  Your Name
                </label>
                <input
                  type="text"
                  id="playerName"
                  value={playerName}
                  onChange={(e) => setPlayerName(e.target.value)}
                  placeholder="Enter your name"
                  maxLength={20}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-colors"
                  disabled={isJoining}
                />
              </div>

              {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
                  <p className="text-red-600 text-sm font-medium">{error}</p>
                </div>
              )}

              <Button
                type="submit"
                disabled={isJoining || !gameCode.trim() || !playerName.trim()}
                size="lg"
                className="w-full"
              >
                {isJoining ? 'Joining...' : 'Join Game'}
              </Button>
            </form>

            <div className="mt-8 p-4 bg-purple-50 rounded-xl">
              <p className="text-sm text-purple-700 text-center">
                💡 <strong>Tip:</strong> Make sure you have a stable internet connection for the best experience!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};