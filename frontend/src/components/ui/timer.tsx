import React from 'react';
import { Clock } from 'lucide-react';

interface TimerProps {
  timeRemaining: number;
  totalTime: number;
  isRunning: boolean;
}

export const Timer: React.FC<TimerProps> = ({ timeRemaining, totalTime, isRunning }) => {
  const percentage = (timeRemaining / totalTime) * 100;

  const getTimerColor = () => {
    if (percentage > 50) return 'text-green-600';
    if (percentage > 25) return 'text-orange-600';
    return 'text-red-600';
  };

  const getProgressColor = () => {
    if (percentage > 50) return 'bg-green-500';
    if (percentage > 25) return 'bg-orange-500';
    return 'bg-red-500';
  };

  return (
    <>
      <div className="flex-1 flex gap-2 items-center justify-between">
        <Clock className={`w-6 h-6 ${getTimerColor()} ${isRunning ? 'animate-pulse' : ''}`} />
        <span className={`text-2xl font-bold ${getTimerColor()}`}>{timeRemaining}s</span>
      </div>

      <div className="w-full bg-gray-200 rounded-full h-3">
        <div
          className={`h-3 rounded-full transition-all duration-1000 ${getProgressColor()}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </>
  );
};
