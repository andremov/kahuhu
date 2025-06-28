import { useEffect } from 'react';
import { useAppStore } from '../../store/app-store';
import { LoadingSpinner } from '../ui/loading-spinner';

interface ConnectingScreenProps {
  isConnected: boolean;
  onJoinGame: (gameCode: string, playerName: string) => void;
}

export default function ConnectingScreen({ onJoinGame, isConnected }: ConnectingScreenProps) {
  const { playerName, joinedGameCode, setGamePhase, setCurrentScreen } = useAppStore();

  // Handle connection state
  useEffect(() => {
    if (!isConnected) {
      return;
    }

    if (!joinedGameCode || !playerName) {
      console.error('No game code or player name provided');
      setCurrentScreen('home');
      return;
    }

    console.log(`Joining game with code: ${joinedGameCode} as player: ${playerName}`);

    onJoinGame(joinedGameCode, playerName);
    setTimeout(() => setGamePhase('lobby'), 100);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isConnected]);

  return (
    <div className="flex items-center justify-center h-screen text-white flex-col">
      <LoadingSpinner />
      <h1 className="text-4xl font-bold mt-4 mb-2">Connecting...</h1>
      <p className="text-lg">Please wait while we establish a connection.</p>
    </div>
  );
}
