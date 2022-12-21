import { useCallback, useEffect, useState } from 'react';

import { DateTime } from 'luxon';

const formattedTimeout = (seconds: number) => DateTime.fromSeconds(seconds).toFormat('mm:ss');

export const useTimer = (count?: number, delay = 1000) => {
  const [currentCount, setCurrentCount] = useState<number | undefined>(count);
  const [isRunning, setIsRunning] = useState<boolean>(false);

  const decreaseCount = () => {
    if (currentCount && currentCount > 0) {
      setCurrentCount(currentCount - 1);
    } else {
      setIsRunning(false);
    }
  };

  const memoizedDecreaseCount = useCallback(decreaseCount, [currentCount]);

  const startTimer = () => {
    setIsRunning(true);
  };

  const stopTimer = () => {
    setIsRunning(false);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setCurrentCount(count);
  };

  useEffect(() => {
    if (isRunning) {
      const interval = setInterval(() => {
        memoizedDecreaseCount();
      }, delay);

      return () => {
        clearInterval(interval);
      };
    }
  }, [currentCount, isRunning, memoizedDecreaseCount, delay]);

  return {
    currentCount,
    formattedTimeout: typeof currentCount === 'number' ? formattedTimeout(currentCount) : undefined,
    startTimer: useCallback(startTimer, []),
    stopTimer,
    resetTimer,
  };
};
