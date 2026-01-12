'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { TariffDodgeData, Tariff, PlayerCharacter } from '../types';
import {
  GAME_CONFIG,
  TARIFF_PERCENTS,
  LEVEL_CONFIG,
  PLAYER_CHARACTERS,
  getLevelForScore,
} from '../constants';

function getRandomCharacter(): PlayerCharacter {
  return PLAYER_CHARACTERS[Math.floor(Math.random() * PLAYER_CHARACTERS.length)];
}

const initialData: TariffDodgeData = {
  phase: 'waiting',
  score: 0,
  playerX: 50,
  playerCharacter: getRandomCharacter(),
  tariffs: [],
  level: 0,
  hitTariff: null,
};

let tariffIdCounter = 0;

function createTariff(level: number): Tariff {
  const config = LEVEL_CONFIG[level] || LEVEL_CONFIG[LEVEL_CONFIG.length - 1];
  return {
    id: tariffIdCounter++,
    x: 10 + Math.random() * 80,
    y: -10,
    percent: TARIFF_PERCENTS[Math.floor(Math.random() * TARIFF_PERCENTS.length)],
    speed: config.tariffSpeed * (0.8 + Math.random() * 0.4),
  };
}

export function useTariffDodge() {
  const [data, setData] = useState<TariffDodgeData>(initialData);
  const gameLoopRef = useRef<NodeJS.Timeout | null>(null);
  const spawnRef = useRef<NodeJS.Timeout | null>(null);
  const scoreRef = useRef<NodeJS.Timeout | null>(null);
  const keysPressed = useRef<Set<string>>(new Set());
  const targetX = useRef<number | null>(null);

  const startGame = useCallback(() => {
    tariffIdCounter = 0;
    setData({
      ...initialData,
      phase: 'playing',
      playerX: 50,
      playerCharacter: getRandomCharacter(),
      tariffs: [],
    });
  }, []);

  const setTargetPosition = useCallback((xPercent: number) => {
    targetX.current = Math.max(5, Math.min(95, xPercent));
  }, []);

  const clearTargetPosition = useCallback(() => {
    targetX.current = null;
  }, []);

  const movePlayer = useCallback((direction: 'left' | 'right') => {
    setData((prev) => {
      if (prev.phase !== 'playing') return prev;
      const newX = direction === 'left'
        ? Math.max(5, prev.playerX - GAME_CONFIG.moveSpeed)
        : Math.min(95, prev.playerX + GAME_CONFIG.moveSpeed);
      return { ...prev, playerX: newX };
    });
  }, []);

  const reset = useCallback(() => {
    if (gameLoopRef.current) clearInterval(gameLoopRef.current);
    if (spawnRef.current) clearInterval(spawnRef.current);
    if (scoreRef.current) clearInterval(scoreRef.current);
    targetX.current = null;
    setData({
      ...initialData,
      playerCharacter: getRandomCharacter(),
    });
  }, []);

  // 키보드 입력 처리
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (data.phase !== 'playing') return;
      keysPressed.current.add(e.key);
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      keysPressed.current.delete(e.key);
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [data.phase]);

  // 게임 루프
  useEffect(() => {
    if (data.phase !== 'playing') return;

    gameLoopRef.current = setInterval(() => {
      // 키 입력에 따른 이동
      if (keysPressed.current.has('ArrowLeft') || keysPressed.current.has('a')) {
        movePlayer('left');
      }
      if (keysPressed.current.has('ArrowRight') || keysPressed.current.has('d')) {
        movePlayer('right');
      }

      setData((prev) => {
        if (prev.phase !== 'playing') return prev;

        // 터치/마우스 타겟 위치로 빠르게 이동
        let newPlayerX = prev.playerX;
        if (targetX.current !== null) {
          const diff = targetX.current - prev.playerX;
          if (Math.abs(diff) > 1) {
            // 빠른 반응을 위해 0.3으로 증가
            newPlayerX = prev.playerX + diff * 0.3;
          } else {
            newPlayerX = targetX.current;
          }
        }

        // 관세 이동
        const movedTariffs = prev.tariffs.map((t) => ({
          ...t,
          y: t.y + t.speed,
        }));

        // 충돌 감지
        const playerLeft = newPlayerX - 5;
        const playerRight = newPlayerX + 5;
        const playerTop = GAME_CONFIG.playerY - 5;
        const playerBottom = GAME_CONFIG.playerY + 5;

        for (const tariff of movedTariffs) {
          const tariffLeft = tariff.x - 4;
          const tariffRight = tariff.x + 4;
          const tariffTop = tariff.y - 4;
          const tariffBottom = tariff.y + 4;

          if (
            playerLeft < tariffRight &&
            playerRight > tariffLeft &&
            playerTop < tariffBottom &&
            playerBottom > tariffTop
          ) {
            return {
              ...prev,
              phase: 'result',
              playerX: newPlayerX,
              hitTariff: tariff.percent,
              tariffs: movedTariffs,
            };
          }
        }

        // 화면 밖으로 나간 관세 제거
        const filteredTariffs = movedTariffs.filter((t) => t.y < 110);

        return {
          ...prev,
          playerX: newPlayerX,
          tariffs: filteredTariffs,
        };
      });
    }, 16);

    return () => {
      if (gameLoopRef.current) clearInterval(gameLoopRef.current);
    };
  }, [data.phase, movePlayer]);

  // 관세 생성
  useEffect(() => {
    if (data.phase !== 'playing') return;

    const config = LEVEL_CONFIG[data.level] || LEVEL_CONFIG[LEVEL_CONFIG.length - 1];

    spawnRef.current = setInterval(() => {
      setData((prev) => ({
        ...prev,
        tariffs: [...prev.tariffs, createTariff(prev.level)],
      }));
    }, config.spawnInterval);

    return () => {
      if (spawnRef.current) clearInterval(spawnRef.current);
    };
  }, [data.phase, data.level]);

  // 점수 증가 (생존 시간)
  useEffect(() => {
    if (data.phase !== 'playing') return;

    scoreRef.current = setInterval(() => {
      setData((prev) => {
        const newScore = prev.score + 1;
        const newLevel = getLevelForScore(newScore);
        return {
          ...prev,
          score: newScore,
          level: newLevel,
        };
      });
    }, 1000);

    return () => {
      if (scoreRef.current) clearInterval(scoreRef.current);
    };
  }, [data.phase]);

  // Cleanup
  useEffect(() => {
    return () => {
      if (gameLoopRef.current) clearInterval(gameLoopRef.current);
      if (spawnRef.current) clearInterval(spawnRef.current);
      if (scoreRef.current) clearInterval(scoreRef.current);
    };
  }, []);

  return {
    ...data,
    startGame,
    movePlayer,
    setTargetPosition,
    clearTargetPosition,
    reset,
  };
}
