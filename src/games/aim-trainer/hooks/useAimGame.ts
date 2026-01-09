'use client';

import { useState, useCallback } from 'react';
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

// 랜덤 타겟 위치 생성
function generateTarget(id: number): Target {
  const padding = GAME_CONFIG.padding;
  return {
    id,
    x: padding + Math.random() * (100 - padding * 2),
    y: padding + Math.random() * (100 - padding * 2),
  };
}

export function useAimGame() {
  const [data, setData] = useState<AimGameData>(initialData);
  const [targetSpawnTime, setTargetSpawnTime] = useState<number>(0);

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
