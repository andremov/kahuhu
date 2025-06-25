import { useState, useEffect, useCallback } from 'react';

export const useTimer = (initialTime: number, onTimeUp?: () => void) => {
  const [timeRemaining, setTimeRemaining] = useState(initialTime);
  const [isRunning, setIsRunning] = useState(false);

  const start = useCallback(() => {
    setIsRunning(true);
  }, []);

  const stop = useCallback(() => {
    setIsRunning(false);
  }, []);

  const reset = useCallback((newTime: number) => {
    setTimeRemaining(newTime);
    setIsRunning(false);
  }, []);

  useEffect(() => {
    setTimeRemaining(initialTime);
  }, [initialTime]);

  useEffect(() => {
    if (!isRunning || timeRemaining <= 0) {
      if (timeRemaining <= 0 && isRunning) {
        onTimeUp?.();
        setIsRunning(false);
      }
      return;
    }

    const interval = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          setIsRunning(false);
          onTimeUp?.();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning, timeRemaining, onTimeUp]);

  return {
    timeRemaining,
    isRunning,
    start,
    stop,
    reset,
  };
};