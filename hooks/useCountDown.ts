import { useCallback, useEffect, useState } from 'react';

export function useCountdown(initialSeconds = 60) {
  const [secondsLeft, setSecondsLeft] = useState(initialSeconds);
  const [isRunning, setIsRunning] = useState(true);

  useEffect(() => {
    if (!isRunning || secondsLeft <= 0) return;

    const interval = setInterval(() => {
      setSecondsLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning, secondsLeft]);

  const restart = useCallback(
    (seconds = initialSeconds) => {
      setSecondsLeft(seconds);
      setIsRunning(true);
    },
    [initialSeconds]
  );

  const stop = useCallback(() => {
    setIsRunning(false);
  }, []);

  return {
    secondsLeft,
    isDisabled: secondsLeft > 0,
    restart,
    stop,
  };
}
