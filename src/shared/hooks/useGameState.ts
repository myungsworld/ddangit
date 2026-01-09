'use client';

import { useState, useCallback } from 'react';
import { GameState, GameStatus } from '../types';

export function useGameState<T>(initialData: T) {
  const [state, setState] = useState<GameState<T>>({
    status: 'idle',
    score: 0,
    data: initialData,
  });

  const setStatus = useCallback((status: GameStatus) => {
    setState((prev) => ({ ...prev, status }));
  }, []);

  const setScore = useCallback((score: number) => {
    setState((prev) => ({ ...prev, score }));
  }, []);

  const updateData = useCallback((data: Partial<T>) => {
    setState((prev) => ({ ...prev, data: { ...prev.data, ...data } }));
  }, []);

  const reset = useCallback(() => {
    setState({
      status: 'idle',
      score: 0,
      data: initialData,
    });
  }, [initialData]);

  return {
    ...state,
    setStatus,
    setScore,
    updateData,
    reset,
  };
}
