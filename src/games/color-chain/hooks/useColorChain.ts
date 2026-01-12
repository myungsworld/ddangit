'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { ColorChainData, Circle } from '../types';
import { GAME_CONFIG, COLORS } from '../constants';

const initialData: ColorChainData = {
  phase: 'waiting',
  score: 0,
  chain: 0,
  lastColor: null,
  circles: [],
  timeLeft: GAME_CONFIG.gameDuration,
  penalty: 0,
};

let circleIdCounter = 0;

function randomVelocity(): number {
  const speed = GAME_CONFIG.moveSpeed;
  return (Math.random() - 0.5) * 2 * speed;
}

function createCircle(existingCircles: Circle[]): Circle {
  const color = COLORS[Math.floor(Math.random() * COLORS.length)];
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

function generateCircles(count: number): Circle[] {
  const circles: Circle[] = [];
  for (let i = 0; i < count; i++) {
    circles.push(createCircle(circles));
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

    // 벽에 부딪히면 반사
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

  const startGame = useCallback(() => {
    circleIdCounter = 0;
    setData({
      ...initialData,
      phase: 'playing',
      circles: generateCircles(GAME_CONFIG.circleCount),
      timeLeft: GAME_CONFIG.gameDuration,
    });
  }, []);

  const handleCircleClick = useCallback(
    (circle: Circle) => {
      if (data.phase !== 'playing' || data.penalty > 0) return;

      setData((prev) => {
        const isSameColor = prev.lastColor === circle.color;
        const isFirstClick = prev.lastColor === null;

        // 화면에 같은 색이 있는지 확인 (클릭한 것 제외)
        const sameColorExists = prev.circles.some(
          (c) => c.id !== circle.id && c.color === prev.lastColor
        );

        if (isFirstClick || isSameColor) {
          // 체인 유지 또는 시작
          const newChain = isFirstClick ? 1 : prev.chain + 1;
          const points = Math.pow(2, newChain - 1);
          const newCircles = prev.circles.filter((c) => c.id !== circle.id);
          newCircles.push(createCircle(newCircles));

          return {
            ...prev,
            score: prev.score + points,
            chain: newChain,
            lastColor: circle.color,
            circles: newCircles,
          };
        } else if (!sameColorExists) {
          // 같은 색이 화면에 없으면 → 새 체인 시작 (페널티 없음)
          const newCircles = prev.circles.filter((c) => c.id !== circle.id);
          newCircles.push(createCircle(newCircles));

          return {
            ...prev,
            score: prev.score + 1,
            chain: 1,
            lastColor: circle.color,
            circles: newCircles,
          };
        } else {
          // 같은 색이 있는데 다른 색 클릭 → 페널티
          const newCircles = prev.circles.filter((c) => c.id !== circle.id);
          newCircles.push(createCircle(newCircles));

          return {
            ...prev,
            chain: 0,
            lastColor: null,
            circles: newCircles,
            penalty: GAME_CONFIG.penaltyTime,
          };
        }
      });
    },
    [data.phase, data.penalty]
  );

  const reset = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (penaltyRef.current) clearInterval(penaltyRef.current);
    if (moveRef.current) clearInterval(moveRef.current);
    setData(initialData);
  }, []);

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
    };
  }, []);

  return {
    ...data,
    startGame,
    handleCircleClick,
    reset,
  };
}
