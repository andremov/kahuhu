import React from 'react';

interface ProgressBarProps {
  current: number;
  total: number;
  className?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ current, total, className = '' }) => {
  const percentage = (current / total) * 100;

  return (
    <div className={`w-full bg-gray-200 rounded-full h-full overflow-hidden relative ${className}`}>
      <div
        className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-500 ease-out"
        style={{ width: `${percentage}%` }}
      />
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-xs font-semibold text-white drop-shadow-sm">
          {current} / {total}
        </span>
      </div>
    </div>
  );
};
