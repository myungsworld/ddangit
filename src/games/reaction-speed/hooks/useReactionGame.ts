'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { ReactionGameData, ReactionGamePhase } from '../types';
import { GAME_CONFIG } from '../constants';

const initialData: ReactionGameData = {
  phase: 'waiting',
  startTime: null,
  reactionTime: null,
  attempts: [],
};

export function useReactionGame() {
  const [data, setData] = useState<ReactionGameData>(initialData);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const setPhase = useCallback((phase: ReactionGamePhase) => {
    setData((prev) => ({ ...prev, phase }));
  }, []);

  const startGame = useCallback(() => {
    setPhase('ready');

    // 랜덤 딜레이 후 'go' 상태로 변경
    const delay =
      Math.random() * (GAME_CONFIG.maxDelay - GAME_CONFIG.minDelay) +
      GAME_CONFIG.minDelay;

    timeoutRef.current = setTimeout(() => {
      setData((prev) => ({
        ...prev,
        phase: 'go',
        startTime: Date.now(),
      }));
    }, delay);
  }, [setPhase]);

  const handleClick = useCallback(() => {
    if (data.phase === 'waiting') {
      startGame();
      return;
    }

    if (data.phase === 'ready') {
      // 너무 일찍 클릭
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      setPhase('early');
      return;
    }

    if (data.phase === 'go' && data.startTime) {
      const reactionTime = Date.now() - data.startTime;
      const newAttempts = [...data.attempts, reactionTime];

      if (newAttempts.length >= GAME_CONFIG.totalAttempts) {
        // 게임 종료
        setData((prev) => ({
          ...prev,
          phase: 'result',
          reactionTime,
          attempts: newAttempts,
        }));
      } else {
        // 다음 시도
        setData((prev) => ({
          ...prev,
          phase: 'waiting',
          reactionTime,
          attempts: newAttempts,
          startTime: null,
        }));
      }
      return;
    }

    if (data.phase === 'early') {
      // 다시 시작
      setPhase('waiting');
      return;
    }

    if (data.phase === 'result') {
      // 리셋
      setData(initialData);
    }
  }, [data.phase, data.startTime, data.attempts, startGame, setPhase]);

  const reset = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setData(initialData);
  }, []);

  const averageTime =
    data.attempts.length > 0
      ? Math.round(
          data.attempts.reduce((a, b) => a + b, 0) / data.attempts.length
        )
      : 0;

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return {
    ...data,
    averageTime,
    handleClick,
    reset,
    currentAttempt: data.attempts.length + 1,
    totalAttempts: GAME_CONFIG.totalAttempts,
  };
}
