'use client';

import dynamic from 'next/dynamic';
import { ComponentType } from 'react';

// 동적 import로 코드 스플리팅 - 각 게임은 필요할 때만 로드됨
export const GAME_COMPONENTS: Record<string, ComponentType> = {
  'sand-tetris': dynamic(
    () => import('./sand-tetris').then((m) => ({ default: m.SandTetrisGame })),
    { ssr: false }
  ),
  'block-blast': dynamic(
    () => import('./block-blast').then((m) => ({ default: m.BlockBlastGame })),
    { ssr: false }
  ),
  'reaction-speed': dynamic(
    () => import('./reaction-speed').then((m) => ({ default: m.ReactionGame })),
    { ssr: false }
  ),
  'color-chain': dynamic(
    () => import('./color-chain').then((m) => ({ default: m.ColorChainGame })),
    { ssr: false }
  ),
  'tariff-dodge': dynamic(
    () => import('./tariff-dodge').then((m) => ({ default: m.TariffDodgeGame })),
    { ssr: false }
  ),
  'color-match': dynamic(
    () => import('./color-match').then((m) => ({ default: m.ColorMatchGame })),
    { ssr: false }
  ),
};

/**
 * 새 게임 추가 시 여기에 등록:
 * 'game-id': dynamic(
 *   () => import('./game-id').then((m) => ({ default: m.GameComponent })),
 *   { ssr: false }
 * ),
 */
