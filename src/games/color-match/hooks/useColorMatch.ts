'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { GameState, Question, ColorDef } from '../types';
import { GAME_CONFIG, COLORS, STORAGE_KEY } from '../constants';

// 로컬 스토리지에서 최고 점수 로드
function loadHighScore(): number {
  if (typeof window === 'undefined') return 0;
  const saved = localStorage.getItem(STORAGE_KEY);
  return saved ? parseInt(saved, 10) : 0;
}

// 최고 점수 저장
function saveHighScore(score: number): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, score.toString());
}

// 랜덤 색상 선택 (특정 색상 제외 가능)
function getRandomColor(exclude?: ColorDef): ColorDef {
  const available = exclude
    ? COLORS.filter(c => c.id !== exclude.id)
    : COLORS;
  return available[Math.floor(Math.random() * available.length)];
}

// 문제 생성
function generateQuestion(): Question {
  const displayColor = getRandomColor(); // 텍스트 내용 (예: "빨강")
  const textColor = getRandomColor(displayColor); // 실제 글자색 (정답)

  return {
    text: displayColor.name.ko, // 또는 언어에 따라 변경
    textColor,
    displayColor,
  };
}

// 선택지 생성 (정답 포함 4개)
function generateOptions(answer: ColorDef): ColorDef[] {
  const options = [answer];

  while (options.length < 4) {
    const color = getRandomColor();
    if (!options.find(o => o.id === color.id)) {
      options.push(color);
    }
  }

  // 셔플
  return options.sort(() => Math.random() - 0.5);
}

// 초기 상태
function createInitialState(): GameState {
  return {
    phase: 'ready',
    score: 0,
    highScore: loadHighScore(),
    streak: 0,
    bestStreak: 0,
    timeLeft: GAME_CONFIG.totalTime,
    currentQuestion: null,
    options: [],
    lastAnswer: null,
  };
}

export function useColorMatch() {
  const [state, setState] = useState<GameState>(createInitialState);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // 타이머 정리
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  // 새 문제 세팅
  const setNewQuestion = useCallback(() => {
    const question = generateQuestion();
    const options = generateOptions(question.textColor);

    setState(prev => ({
      ...prev,
      currentQuestion: question,
      options,
      lastAnswer: null,
    }));
  }, []);

  // 게임 시작
  const startGame = useCallback(() => {
    const question = generateQuestion();
    const options = generateOptions(question.textColor);

    setState(prev => ({
      ...prev,
      phase: 'playing',
      score: 0,
      streak: 0,
      bestStreak: 0,
      timeLeft: GAME_CONFIG.totalTime,
      currentQuestion: question,
      options,
      lastAnswer: null,
    }));

    // 타이머 시작
    timerRef.current = setInterval(() => {
      setState(prev => {
        const newTime = prev.timeLeft - 1;

        if (newTime <= 0) {
          if (timerRef.current) {
            clearInterval(timerRef.current);
          }
          return {
            ...prev,
            timeLeft: 0,
            phase: 'ending',
          };
        }

        return {
          ...prev,
          timeLeft: newTime,
        };
      });
    }, 1000);
  }, []);

  // 정답 선택
  const selectAnswer = useCallback((colorId: string) => {
    setState(prev => {
      if (prev.phase !== 'playing' || !prev.currentQuestion) return prev;

      const isCorrect = colorId === prev.currentQuestion.textColor.id;

      const newStreak = isCorrect ? prev.streak + 1 : 0;
      const newBestStreak = Math.max(prev.bestStreak, newStreak);
      const scoreGain = isCorrect
        ? GAME_CONFIG.baseScore + (prev.streak * GAME_CONFIG.streakBonus)
        : 0;
      const newScore = prev.score + scoreGain;

      // 최고 점수 업데이트
      let highScore = prev.highScore;
      if (newScore > highScore) {
        highScore = newScore;
        saveHighScore(highScore);
      }

      // 새 문제 생성
      const question = generateQuestion();
      const options = generateOptions(question.textColor);

      return {
        ...prev,
        score: newScore,
        highScore,
        streak: newStreak,
        bestStreak: newBestStreak,
        currentQuestion: question,
        options,
        lastAnswer: isCorrect ? 'correct' : 'wrong',
      };
    });
  }, []);

  // 게임 종료 처리 (애니메이션 후)
  const finishGame = useCallback(() => {
    setState(prev => ({
      ...prev,
      phase: 'gameover',
    }));
  }, []);

  // 리셋
  const resetGame = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    setState(createInitialState());
  }, []);

  return {
    // 상태
    phase: state.phase,
    score: state.score,
    highScore: state.highScore,
    streak: state.streak,
    bestStreak: state.bestStreak,
    timeLeft: state.timeLeft,
    currentQuestion: state.currentQuestion,
    options: state.options,
    lastAnswer: state.lastAnswer,

    // 액션
    startGame,
    selectAnswer,
    finishGame,
    resetGame,

    // 게임 데이터
    gameData: {
      score: state.score,
      highScore: state.highScore,
      bestStreak: state.bestStreak,
    },
  };
}
