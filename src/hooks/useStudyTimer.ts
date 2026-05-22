import { useCallback, useEffect, useMemo, useState } from 'react';

export function useStudyTimer(initialSeconds = 25 * 60) {
  const [secondsLeft, setSecondsLeft] = useState(initialSeconds);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    if (!isRunning) return undefined;
    const timer = setInterval(() => {
      setSecondsLeft((current) => {
        if (current <= 1) {
          setIsRunning(false);
          return 0;
        }
        return current - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [isRunning]);

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;
  const formatted = useMemo(() => `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`, [minutes, seconds]);

  const reset = useCallback(() => {
    setIsRunning(false);
    setSecondsLeft(initialSeconds);
  }, [initialSeconds]);

  return {
    secondsLeft,
    elapsedSeconds: initialSeconds - secondsLeft,
    formatted,
    isRunning,
    start: () => setIsRunning(true),
    pause: () => setIsRunning(false),
    reset
  };
}
