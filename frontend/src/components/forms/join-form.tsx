import { useState } from 'react';
import { Button } from '../ui/button';
import { UserPlus } from 'lucide-react';

type JoinFormProps = {
  onJoinGame: (gameCode: string, playerName: string) => void;
};

export function JoinForm({ onJoinGame }: JoinFormProps) {
  const [gameCode, setGameCode] = useState('');
  const [playerName, setPlayerName] = useState('');
  const [isJoining, setIsJoining] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!gameCode.trim() || !playerName.trim()) {
      return;
    }

    if (playerName.length < 2) {
      return;
    }

    setIsJoining(true);
    onJoinGame(gameCode.toUpperCase().trim(), playerName.trim());

    // Reset joining state after a delay
    setTimeout(() => setIsJoining(false), 2000);
  };

  return (
    <div className="max-w-md mx-auto">
      <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-8 shadow-2xl">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-pink-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <UserPlus className="w-10 h-10 text-purple-600" />
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <input
              type="text"
              id="gameCode"
              autoFocus
              autoComplete="off"
              spellCheck="false"
              pattern="[A-Z0-9]{6}"
              required
              value={gameCode}
              onChange={(e) => setGameCode(e.target.value.toUpperCase())}
              placeholder="Enter 6-digit code"
              maxLength={6}
              className="w-full px-4 py-3 text-center text-2xl font-bold tracking-widest border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-colors"
              disabled={isJoining}
            />
          </div>

          <div>
            <input
              type="text"
              id="playerName"
              autoComplete="off"
              spellCheck="false"
              pattern="[A-Za-z0-9]+"
              required
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              placeholder="Enter your name"
              maxLength={20}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-colors"
              disabled={isJoining}
            />
          </div>

          <Button
            type="submit"
            disabled={isJoining || !gameCode.trim() || !playerName.trim() || playerName.length < 2}
            size="lg"
            className="w-full"
          >
            {isJoining ? 'Joining...' : 'Join Game'}
          </Button>
        </form>
      </div>
    </div>
  );
}
