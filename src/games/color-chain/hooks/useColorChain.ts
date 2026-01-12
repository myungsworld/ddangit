'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { ColorChainData, Circle } from '../types';
import {
  GAME_CONFIG,
  getLevelForScore,
  getColorsForLevel,
  getCircleCountForLevel,
  getTimeBonusForLevel,
} from '../constants';

const initialData: ColorChainData = {
  phase: 'waiting',
  score: 0,
  chain: 0,
  lastColor: null,
  circles: [],
  timeLeft: GAME_CONFIG.gameDuration,
  penalty: 0,
  level: 0,
  levelUpMessage: null,
};

let circleIdCounter = 0;

function randomVelocity(): number {
  const speed = GAME_CONFIG.moveSpeed;
  return (Math.random() - 0.5) * 2 * speed;
}

function createCircle(existingCircles: Circle[], level: number): Circle {
  const colors = getColorsForLevel(level);
  const color = colors[Math.floor(Math.random() * colors.length)];
  const padding = 15;

  let x: number, y: number;
  let attempts = 0;
  const maxAttempts = 50;

  do {
    x = padding + Math.random() * (100 - 2 * padding);
    y = padding + Math.random() * (100 - 2 * padding);
    attempts++;
  } while (
    attempts < maxAttempts &&
    existingCircles.some((c) => Math.hypot(c.x - x, c.y - y) < 15)
  );

  return {
    id: circleIdCounter++,
    color,
    x,
    y,
    vx: randomVelocity(),
    vy: randomVelocity(),
  };
}

function generateCircles(count: number, level: number): Circle[] {
  const circles: Circle[] = [];
  for (let i = 0; i < count; i++) {
    circles.push(createCircle(circles, level));
  }
  return circles;
}

function moveCircles(circles: Circle[]): Circle[] {
  const padding = 5;
  const max = 95;

  return circles.map((c) => {
    let newX = c.x + c.vx;
    let newY = c.y + c.vy;
    let newVx = c.vx;
    let newVy = c.vy;

    if (newX < padding || newX > max) {
      newVx = -newVx;
      newX = Math.max(padding, Math.min(max, newX));
    }
    if (newY < padding || newY > max) {
      newVy = -newVy;
      newY = Math.max(padding, Math.min(max, newY));
    }

    return { ...c, x: newX, y: newY, vx: newVx, vy: newVy };
  });
}

export function useColorChain() {
  const [data, setData] = useState<ColorChainData>(initialData);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const penaltyRef = useRef<NodeJS.Timeout | null>(null);
  const moveRef = useRef<NodeJS.Timeout | null>(null);
  const levelUpRef = useRef<NodeJS.Timeout | null>(null);

  const startGame = useCallback(() => {
    circleIdCounter = 0;
    const initialLevel = 0;
    setData({
      ...initialData,
      phase: 'playing',
      circles: generateCircles(getCircleCountForLevel(initialLevel), initialLevel),
      timeLeft: GAME_CONFIG.gameDuration,
      level: initialLevel,
    });
  }, []);

  const handleCircleClick = useCallback(
    (circle: Circle) => {
      if (data.phase !== 'playing' || data.penalty > 0) return;

      setData((prev) => {
        const isSameColor = prev.lastColor === circle.color;
        const isFirstClick = prev.lastColor === null;

        const sameColorExists = prev.circles.some(
          (c) => c.id !== circle.id && c.color === prev.lastColor
        );

        let newScore = prev.score;
        let newChain = prev.chain;
        let newLastColor = prev.lastColor;
        let newPenalty = prev.penalty;
        let newLevel = prev.level;
        let newTimeLeft = prev.timeLeft;
        let levelUpMessage: string | null = null;

        // 새 공 생성 (기존 공 제거 후)
        const newCircles = prev.circles.filter((c) => c.id !== circle.id);

        if (isFirstClick || isSameColor) {
          newChain = isFirstClick ? 1 : prev.chain + 1;
          const points = Math.pow(2, newChain - 1);
          newScore = prev.score + points;
          newLastColor = circle.color;
        } else if (!sameColorExists) {
          newScore = prev.score + 1;
          newChain = 1;
          newLastColor = circle.color;
        } else {
          newChain = 0;
          newLastColor = null;
          newPenalty = GAME_CONFIG.penaltyTime;
        }

        // 레벨업 체크
        const calculatedLevel = getLevelForScore(newScore);
        if (calculatedLevel > prev.level) {
          newLevel = calculatedLevel;
          const timeBonus = getTimeBonusForLevel(newLevel);
          newTimeLeft = prev.timeLeft + timeBonus;

          // 새 색상이 추가되었는지 확인
          const prevColors = getColorsForLevel(prev.level).length;
          const newColors = getColorsForLevel(newLevel).length;
          if (newColors > prevColors) {
            levelUpMessage = 'newColor';
          } else {
            levelUpMessage = 'levelUp';
          }
        }

        // 공 개수 맞추기 (레벨업으로 공이 늘어났을 수 있음)
        const targetCircleCount = getCircleCountForLevel(newLevel);
        while (newCircles.length < targetCircleCount) {
          newCircles.push(createCircle(newCircles, newLevel));
        }

        return {
          ...prev,
          score: newScore,
          chain: newChain,
          lastColor: newLastColor,
          circles: newCircles,
          penalty: newPenalty,
          level: newLevel,
          timeLeft: newTimeLeft,
          levelUpMessage,
        };
      });
    },
    [data.phase, data.penalty]
  );

  const reset = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (penaltyRef.current) clearInterval(penaltyRef.current);
    if (moveRef.current) clearInterval(moveRef.current);
    if (levelUpRef.current) clearTimeout(levelUpRef.current);
    setData(initialData);
  }, []);

  // 레벨업 메시지 타이머
  useEffect(() => {
    if (data.levelUpMessage) {
      levelUpRef.current = setTimeout(() => {
        setData((prev) => ({ ...prev, levelUpMessage: null }));
      }, 1500);
    }
    return () => {
      if (levelUpRef.current) clearTimeout(levelUpRef.current);
    };
  }, [data.levelUpMessage]);

  // 공 이동 타이머
  useEffect(() => {
    if (data.phase === 'playing') {
      moveRef.current = setInterval(() => {
        setData((prev) => ({
          ...prev,
          circles: moveCircles(prev.circles),
        }));
      }, GAME_CONFIG.moveInterval);
    }

    return () => {
      if (moveRef.current) clearInterval(moveRef.current);
    };
  }, [data.phase]);

  // 게임 타이머
  useEffect(() => {
    if (data.phase === 'playing') {
      timerRef.current = setInterval(() => {
        setData((prev) => {
          if (prev.timeLeft <= 1) {
            return { ...prev, phase: 'result', timeLeft: 0 };
          }
          return { ...prev, timeLeft: prev.timeLeft - 1 };
        });
      }, 1000);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [data.phase]);

  // 페널티 타이머
  useEffect(() => {
    if (data.penalty > 0) {
      penaltyRef.current = setInterval(() => {
        setData((prev) => ({
          ...prev,
          penalty: Math.max(0, prev.penalty - 0.1),
        }));
      }, 100);
    }

    return () => {
      if (penaltyRef.current) clearInterval(penaltyRef.current);
    };
  }, [data.penalty > 0]);

  // Cleanup
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (penaltyRef.current) clearInterval(penaltyRef.current);
      if (moveRef.current) clearInterval(moveRef.current);
      if (levelUpRef.current) clearTimeout(levelUpRef.current);
    };
  }, []);

  return {
    ...data,
    startGame,
    handleCircleClick,
    reset,
  };
}
