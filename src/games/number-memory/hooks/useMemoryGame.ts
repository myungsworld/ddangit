'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { MemoryGameData } from '../types';
import { GAME_CONFIG, generateNumber, getShowTime } from '../constants';

const initialData: MemoryGameData = {
  phase: 'idle',
  level: GAME_CONFIG.startLevel,
  currentNumber: '',
  userInput: '',
  highestLevel: 0,
};

export function useMemoryGame() {
  const [data, setData] = useState<MemoryGameData>(initialData);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // 게임 시작
  const startGame = useCallback(() => {
    const number = generateNumber(GAME_CONFIG.startLevel);
    setData({
      phase: 'showing',
      level: GAME_CONFIG.startLevel,
      currentNumber: number,
      userInput: '',
      highestLevel: 0,
    });
  }, []);

  // 다음 레벨
  const nextLevel = useCallback(() => {
    const nextLevelNum = data.level + 1;
    const number = generateNumber(nextLevelNum);
    setData((prev) => ({
      ...prev,
      phase: 'showing',
      level: nextLevelNum,
      currentNumber: number,
      userInput: '',
    }));
  }, [data.level]);

  // 숫자 표시 후 입력 모드로 전환
  useEffect(() => {
    if (data.phase === 'showing') {
      const showTime = getShowTime(data.level);
      timeoutRef.current = setTimeout(() => {
        setData((prev) => ({ ...prev, phase: 'input' }));
      }, showTime);
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [data.phase, data.level]);

  // 입력 처리
  const handleInput = useCallback((digit: string) => {
    if (data.phase !== 'input') return;

    const newInput = data.userInput + digit;
    setData((prev) => ({ ...prev, userInput: newInput }));

    // 입력 완료 체크
    if (newInput.length === data.currentNumber.length) {
      if (newInput === data.currentNumber) {
        // 정답
        setData((prev) => ({
          ...prev,
          phase: 'correct',
          highestLevel: Math.max(prev.highestLevel, prev.level),
        }));
      } else {
        // 오답
        setData((prev) => ({
          ...prev,
          phase: 'wrong',
          highestLevel: Math.max(prev.highestLevel, prev.level - 1),
        }));
      }
    }
  }, [data.phase, data.userInput, data.currentNumber]);

  // 입력 삭제
  const handleDelete = useCallback(() => {
    if (data.phase !== 'input') return;
    setData((prev) => ({
      ...prev,
      userInput: prev.userInput.slice(0, -1),
    }));
  }, [data.phase]);

  // 결과 화면으로
  const showResult = useCallback(() => {
    setData((prev) => ({ ...prev, phase: 'result' }));
  }, []);

  // 리셋
  const reset = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setData(initialData);
  }, []);

  return {
    ...data,
    startGame,
    nextLevel,
    handleInput,
    handleDelete,
    showResult,
    reset,
  };
}
