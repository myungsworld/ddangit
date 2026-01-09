'use client';

import { useState, useCallback } from 'react';
import { TypingGameData } from '../types';
import { getRandomSentence } from '../constants';

const initialData: TypingGameData = {
  phase: 'idle',
  text: '',
  userInput: '',
  startTime: null,
  endTime: null,
  errors: 0,
};

export function useTypingGame() {
  const [data, setData] = useState<TypingGameData>(initialData);

  // 게임 시작
  const startGame = useCallback(() => {
    setData({
      phase: 'playing',
      text: getRandomSentence(),
      userInput: '',
      startTime: null,
      endTime: null,
      errors: 0,
    });
  }, []);

  // 입력 처리
  const handleInput = useCallback((value: string) => {
    if (data.phase !== 'playing') return;

    setData((prev) => {
      // 첫 입력 시 타이머 시작
      const startTime = prev.startTime ?? Date.now();

      // 오타 계산 (현재 입력과 원본 비교)
      let errors = 0;
      for (let i = 0; i < value.length; i++) {
        if (value[i] !== prev.text[i]) {
          errors++;
        }
      }

      // 완료 체크
      if (value === prev.text) {
        return {
          ...prev,
          userInput: value,
          startTime,
          endTime: Date.now(),
          errors,
          phase: 'result',
        };
      }

      return {
        ...prev,
        userInput: value,
        startTime,
        errors,
      };
    });
  }, [data.phase]);

  // 리셋
  const reset = useCallback(() => {
    setData(initialData);
  }, []);

  // WPM 계산 (Words Per Minute)
  const calculateWPM = (): number => {
    if (!data.startTime || !data.endTime) return 0;
    const timeInMinutes = (data.endTime - data.startTime) / 60000;
    const wordCount = data.text.split(' ').length;
    return Math.round(wordCount / timeInMinutes);
  };

  // 정확도 계산
  const calculateAccuracy = (): number => {
    if (data.text.length === 0) return 100;
    const correctChars = data.text.length - data.errors;
    return Math.round((correctChars / data.text.length) * 100);
  };

  // 걸린 시간 (초)
  const getTimeInSeconds = (): number => {
    if (!data.startTime || !data.endTime) return 0;
    return Math.round((data.endTime - data.startTime) / 1000 * 10) / 10;
  };

  return {
    ...data,
    wpm: calculateWPM(),
    accuracy: calculateAccuracy(),
    timeInSeconds: getTimeInSeconds(),
    startGame,
    handleInput,
    reset,
  };
}
