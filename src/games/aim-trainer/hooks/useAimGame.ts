'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { AimGameData, Target } from '../types';
import { GAME_CONFIG } from '../constants';

const initialData: AimGameData = {
  phase: 'idle',
  target: null,
  hits: 0,
  misses: 0,
  startTime: null,
  hitTimes: [],
};

// 랜덤 속도 생성
function randomSpeed(): number {
  const { minSpeed, maxSpeed } = GAME_CONFIG;
  const speed = minSpeed + Math.random() * (maxSpeed - minSpeed);
  return Math.random() > 0.5 ? speed : -speed;
}

// 랜덤 타겟 위치 생성
function generateTarget(id: number): Target {
  const padding = GAME_CONFIG.padding;
  return {
    id,
    x: padding + Math.random() * (100 - padding * 2),
    y: padding + Math.random() * (100 - padding * 2),
    vx: randomSpeed(),
    vy: randomSpeed(),
  };
}

export function useAimGame() {
  const [data, setData] = useState<AimGameData>(initialData);
  const [targetSpawnTime, setTargetSpawnTime] = useState<number>(0);
  const animationRef = useRef<number>(0);

  // 타겟 이동 애니메이션
  useEffect(() => {
    if (data.phase !== 'playing' || !data.target) {
      return;
    }

    const animate = () => {
      setData((prev) => {
        if (!prev.target || prev.phase !== 'playing') return prev;

        const padding = GAME_CONFIG.padding;
        let { x, y, vx, vy } = prev.target;

        // 위치 업데이트
        x += vx;
        y += vy;

        // 벽에 부딪히면 반사
        if (x < padding || x > 100 - padding) {
          vx = -vx;
          x = Math.max(padding, Math.min(100 - padding, x));
        }
        if (y < padding || y > 100 - padding) {
          vy = -vy;
          y = Math.max(padding, Math.min(100 - padding, y));
        }

        return {
          ...prev,
          target: { ...prev.target, x, y, vx, vy },
        };
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationRef.current);
    };
  }, [data.phase, data.target?.id]);

  // 게임 시작
  const startGame = useCallback(() => {
    const now = Date.now();
    setTargetSpawnTime(now);
    setData({
      phase: 'playing',
      target: generateTarget(1),
      hits: 0,
      misses: 0,
      startTime: now,
      hitTimes: [],
    });
  }, []);

  // 타겟 클릭 (명중)
  const hitTarget = useCallback(() => {
    const hitTime = Date.now() - targetSpawnTime;

    setData((prev) => {
      const newHits = prev.hits + 1;
      const newHitTimes = [...prev.hitTimes, hitTime];

      // 모든 타겟 완료
      if (newHits >= GAME_CONFIG.totalTargets) {
        return {
          ...prev,
          phase: 'result',
          target: null,
          hits: newHits,
          hitTimes: newHitTimes,
        };
      }

      // 다음 타겟 생성
      return {
        ...prev,
        target: generateTarget(newHits + 1),
        hits: newHits,
        hitTimes: newHitTimes,
      };
    });

    setTargetSpawnTime(Date.now());
  }, [targetSpawnTime]);

  // 빈 공간 클릭 (미스)
  const miss = useCallback(() => {
    if (data.phase !== 'playing') return;
    setData((prev) => ({
      ...prev,
      misses: prev.misses + 1,
    }));
  }, [data.phase]);

  // 리셋
  const reset = useCallback(() => {
    cancelAnimationFrame(animationRef.current);
    setData(initialData);
  }, []);

  // 평균 반응 시간
  const averageTime = data.hitTimes.length > 0
    ? Math.round(data.hitTimes.reduce((a, b) => a + b, 0) / data.hitTimes.length)
    : 0;

  // 정확도
  const accuracy = data.hits + data.misses > 0
    ? Math.round((data.hits / (data.hits + data.misses)) * 100)
    : 0;

  return {
    ...data,
    averageTime,
    accuracy,
    startGame,
    hitTarget,
    miss,
    reset,
    totalTargets: GAME_CONFIG.totalTargets,
  };
}
