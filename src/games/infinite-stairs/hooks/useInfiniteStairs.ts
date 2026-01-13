'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { Direction, GamePhase, Stair } from '../types';
import { GAME_CONFIG } from '../constants';

interface GameState {
  phase: GamePhase;
  stairs: Stair[];
  currentStairIndex: number;
  score: number;
  timeLeft: number;
  playerPosition: number; // 0 = 중앙, -1 왼쪽, +1 오른쪽 등
}

// 계단 하나 생성
function createStair(id: number): Stair {
  return {
    id,
    direction: Math.random() > 0.5 ? 'left' : 'right',
  };
}

// 초기 계단들 생성
function createInitialStairs(count: number): Stair[] {
  return Array.from({ length: count }, (_, i) => createStair(i));
}

export function useInfiniteStairs() {
  const [state, setState] = useState<GameState>(() => ({
    phase: 'ready',
    stairs: createInitialStairs(GAME_CONFIG.visibleStairs),
    currentStairIndex: 0,
    score: 0,
    timeLeft: GAME_CONFIG.initialTime,
    playerPosition: 0,
  }));

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const lastInputTimeRef = useRef<number>(0);

  // 타이머 정리
  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  // 게임 시작
  const startGame = useCallback(() => {
    clearTimer();
    setState({
      phase: 'playing',
      stairs: createInitialStairs(GAME_CONFIG.visibleStairs),
      currentStairIndex: 0,
      score: 0,
      timeLeft: GAME_CONFIG.initialTime,
      playerPosition: 0,
    });
    lastInputTimeRef.current = Date.now();
  }, [clearTimer]);

  // 리셋
  const reset = useCallback(() => {
    clearTimer();
    setState({
      phase: 'ready',
      stairs: createInitialStairs(GAME_CONFIG.visibleStairs),
      currentStairIndex: 0,
      score: 0,
      timeLeft: GAME_CONFIG.initialTime,
      playerPosition: 0,
    });
  }, [clearTimer]);

  // 입력 처리
  const handleInput = useCallback((inputDir: Direction) => {
    setState((prev) => {
      if (prev.phase !== 'playing') return prev;

      const nextStair = prev.stairs[0];
      if (!nextStair) return prev;

      // 틀리면 떨어짐
      if (nextStair.direction !== inputDir) {
        return { ...prev, phase: 'falling' };
      }

      // 맞음
      const now = Date.now();
      const timeSinceLastInput = now - lastInputTimeRef.current;
      lastInputTimeRef.current = now;

      // 시간 보너스 (빠른 입력 시)
      const timeBonus = timeSinceLastInput < 300 ? GAME_CONFIG.timeBonus : 0;
      const newTimeLeft = Math.min(15, prev.timeLeft + timeBonus);

      // 새 계단 추가, 기존 첫번째 계단 제거
      const newStairs = [...prev.stairs.slice(1), createStair(prev.currentStairIndex + GAME_CONFIG.visibleStairs)];

      // 플레이어 위치 업데이트
      const newPlayerPosition = prev.playerPosition + (inputDir === 'left' ? -1 : 1);

      return {
        ...prev,
        stairs: newStairs,
        currentStairIndex: prev.currentStairIndex + 1,
        score: prev.score + 1,
        timeLeft: newTimeLeft,
        playerPosition: newPlayerPosition,
      };
    });
  }, []);

  // 타이머
  useEffect(() => {
    if (state.phase !== 'playing') {
      clearTimer();
      return;
    }

    timerRef.current = setInterval(() => {
      setState((prev) => {
        if (prev.phase !== 'playing') return prev;
        const newTime = Math.max(0, prev.timeLeft - 0.1);
        if (newTime <= 0) {
          return { ...prev, phase: 'gameover', timeLeft: 0 };
        }
        return { ...prev, timeLeft: newTime };
      });
    }, 100);

    return clearTimer;
  }, [state.phase, clearTimer]);

  // 떨어진 후 게임오버
  useEffect(() => {
    if (state.phase !== 'falling') return;
    const timeout = setTimeout(() => {
      setState((prev) => ({ ...prev, phase: 'gameover' }));
    }, 600);
    return () => clearTimeout(timeout);
  }, [state.phase]);

  // 키보드
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (state.phase === 'ready' && (e.key === ' ' || e.key === 'ArrowLeft' || e.key === 'ArrowRight')) {
        startGame();
        return;
      }
      if (state.phase === 'playing') {
        if (e.key === 'ArrowLeft' || e.key === 'a') handleInput('left');
        if (e.key === 'ArrowRight' || e.key === 'd') handleInput('right');
      }
      if (state.phase === 'gameover' && (e.key === ' ' || e.key === 'Enter')) {
        reset();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [state.phase, startGame, handleInput, reset]);

  // 다음 계단 방향 (캐릭터가 바라볼 방향)
  const nextDirection = state.stairs[0]?.direction || 'right';

  return {
    phase: state.phase,
    stairs: state.stairs,
    floor: state.currentStairIndex + 1,
    score: state.score,
    timeLeft: state.timeLeft,
    playerPosition: state.playerPosition,
    nextDirection,
    startGame,
    handleInput,
    reset,
  };
}
