'use client';

import { useInfiniteStairs } from '../hooks/useInfiniteStairs';
import { GAME_CONFIG, RANK_THRESHOLDS } from '../constants';
import { GameResult } from '@/shared/components/game';
import { useLanguage } from '@/shared/contexts/LanguageContext';

function getRankKey(score: number): string {
  if (score >= RANK_THRESHOLDS.godlike) return 'godlike';
  if (score >= RANK_THRESHOLDS.insane) return 'insane';
  if (score >= RANK_THRESHOLDS.fast) return 'fast';
  if (score >= RANK_THRESHOLDS.good) return 'good';
  if (score >= RANK_THRESHOLDS.average) return 'average';
  if (score >= RANK_THRESHOLDS.slow) return 'slow';
  return 'verySlow';
}

// RGB 색상 보간 함수
function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

function lerpColor(color1: [number, number, number], color2: [number, number, number], t: number): string {
  const r = Math.round(lerp(color1[0], color2[0], t));
  const g = Math.round(lerp(color1[1], color2[1], t));
  const b = Math.round(lerp(color1[2], color2[2], t));
  return `rgb(${r}, ${g}, ${b})`;
}

// 환경 단계 정의
interface EnvironmentStage {
  floor: number;
  topColor: [number, number, number];
  bottomColor: [number, number, number];
  stairTop: [number, number, number];
  stairBottom: [number, number, number];
}

const STAGES: EnvironmentStage[] = [
  { floor: 1, topColor: [135, 206, 235], bottomColor: [144, 238, 144], stairTop: [139, 69, 19], stairBottom: [101, 67, 33] }, // 땅 - 하늘+초록
  { floor: 30, topColor: [135, 206, 250], bottomColor: [176, 224, 230], stairTop: [200, 200, 200], stairBottom: [160, 160, 160] }, // 낮은 하늘
  { floor: 60, topColor: [70, 130, 180], bottomColor: [135, 206, 235], stairTop: [220, 220, 220], stairBottom: [180, 180, 180] }, // 높은 하늘
  { floor: 90, topColor: [255, 140, 100], bottomColor: [255, 200, 150], stairTop: [255, 180, 200], stairBottom: [200, 150, 180] }, // 노을
  { floor: 120, topColor: [75, 0, 130], bottomColor: [255, 100, 80], stairTop: [180, 130, 200], stairBottom: [130, 80, 160] }, // 성층권
  { floor: 150, topColor: [25, 25, 60], bottomColor: [75, 0, 130], stairTop: [100, 100, 180], stairBottom: [60, 60, 130] }, // 우주 초입
  { floor: 200, topColor: [10, 10, 30], bottomColor: [30, 10, 50], stairTop: [148, 0, 211], stairBottom: [75, 0, 130] }, // 깊은 우주
];

// 장식 정의
interface Decoration {
  emoji: string;
  top: string;
  left: string;
  baseOpacity: number;
  size: string;
  minFloor: number;
  maxFloor: number;
}

const DECORATIONS: Decoration[] = [
  // 땅 (1-40)
  { emoji: '🌳', top: '70%', left: '10%', baseOpacity: 0.7, size: '2rem', minFloor: 1, maxFloor: 40 },
  { emoji: '🏠', top: '75%', left: '85%', baseOpacity: 0.6, size: '1.5rem', minFloor: 1, maxFloor: 35 },
  { emoji: '🌿', top: '80%', left: '30%', baseOpacity: 0.5, size: '1.2rem', minFloor: 1, maxFloor: 30 },
  // 하늘 (20-80)
  { emoji: '☁️', top: '20%', left: '15%', baseOpacity: 0.8, size: '3rem', minFloor: 20, maxFloor: 80 },
  { emoji: '☁️', top: '40%', left: '80%', baseOpacity: 0.6, size: '2.5rem', minFloor: 25, maxFloor: 85 },
  { emoji: '✈️', top: '30%', left: '5%', baseOpacity: 0.5, size: '1.5rem', minFloor: 30, maxFloor: 70 },
  { emoji: '🌤️', top: '10%', left: '70%', baseOpacity: 0.9, size: '2rem', minFloor: 15, maxFloor: 60 },
  // 노을/성층권 (60-130)
  { emoji: '🌅', top: '55%', left: '80%', baseOpacity: 0.8, size: '2.5rem', minFloor: 70, maxFloor: 110 },
  { emoji: '🎈', top: '35%', left: '20%', baseOpacity: 0.6, size: '1.8rem', minFloor: 50, maxFloor: 100 },
  { emoji: '🦅', top: '45%', left: '65%', baseOpacity: 0.5, size: '1.5rem', minFloor: 40, maxFloor: 90 },
  // 우주 (100+)
  { emoji: '⭐', top: '15%', left: '20%', baseOpacity: 0.9, size: '1rem', minFloor: 100, maxFloor: 999 },
  { emoji: '⭐', top: '35%', left: '85%', baseOpacity: 0.8, size: '0.8rem', minFloor: 110, maxFloor: 999 },
  { emoji: '✨', top: '25%', left: '50%', baseOpacity: 0.7, size: '0.7rem', minFloor: 120, maxFloor: 999 },
  { emoji: '🌙', top: '12%', left: '75%', baseOpacity: 0.9, size: '2rem', minFloor: 130, maxFloor: 999 },
  { emoji: '⭐', top: '50%', left: '10%', baseOpacity: 0.6, size: '0.9rem', minFloor: 140, maxFloor: 999 },
  // 깊은 우주 (150+)
  { emoji: '🪐', top: '18%', left: '70%', baseOpacity: 0.7, size: '2.5rem', minFloor: 160, maxFloor: 999 },
  { emoji: '🛸', top: '40%', left: '8%', baseOpacity: 0.5, size: '1.5rem', minFloor: 180, maxFloor: 999 },
  { emoji: '🌌', top: '25%', left: '45%', baseOpacity: 0.3, size: '6rem', minFloor: 200, maxFloor: 999 },
];

// 층수에 따른 환경 계산 (부드러운 보간)
function getEnvironment(floor: number) {
  // 현재 층수에 해당하는 스테이지 찾기
  let stageIndex = 0;
  for (let i = 0; i < STAGES.length - 1; i++) {
    if (floor >= STAGES[i].floor && floor < STAGES[i + 1].floor) {
      stageIndex = i;
      break;
    }
    if (floor >= STAGES[STAGES.length - 1].floor) {
      stageIndex = STAGES.length - 2;
    }
  }

  const currentStage = STAGES[stageIndex];
  const nextStage = STAGES[Math.min(stageIndex + 1, STAGES.length - 1)];

  // 두 스테이지 사이의 진행도 (0~1)
  const range = nextStage.floor - currentStage.floor;
  const progress = range > 0 ? Math.min(1, (floor - currentStage.floor) / range) : 0;

  // 색상 보간
  const topColor = lerpColor(currentStage.topColor, nextStage.topColor, progress);
  const bottomColor = lerpColor(currentStage.bottomColor, nextStage.bottomColor, progress);
  const stairTopColor = lerpColor(currentStage.stairTop, nextStage.stairTop, progress);
  const stairBottomColor = lerpColor(currentStage.stairBottom, nextStage.stairBottom, progress);

  // 장식 opacity 계산 (페이드 인/아웃)
  const visibleDecorations = DECORATIONS.map((deco) => {
    let opacity = 0;
    const fadeRange = 15; // 페이드 인/아웃 범위

    if (floor >= deco.minFloor && floor <= deco.maxFloor) {
      // 페이드 인
      if (floor < deco.minFloor + fadeRange) {
        opacity = ((floor - deco.minFloor) / fadeRange) * deco.baseOpacity;
      }
      // 페이드 아웃
      else if (floor > deco.maxFloor - fadeRange) {
        opacity = ((deco.maxFloor - floor) / fadeRange) * deco.baseOpacity;
      }
      // 완전히 보임
      else {
        opacity = deco.baseOpacity;
      }
    }

    return { ...deco, opacity: Math.max(0, Math.min(1, opacity)) };
  }).filter((d) => d.opacity > 0.01);

  return {
    background: `linear-gradient(180deg, ${topColor} 0%, ${bottomColor} 100%)`,
    stairColor: `linear-gradient(180deg, ${stairTopColor} 0%, ${stairBottomColor} 100%)`,
    currentStairColor: `linear-gradient(180deg, ${lerpColor(currentStage.stairTop, nextStage.stairTop, progress * 0.7)} 0%, ${stairTopColor} 100%)`,
    decorations: visibleDecorations,
  };
}

export function InfiniteStairsGame() {
  const { t } = useLanguage();
  const {
    phase,
    stairs,
    floor,
    score,
    timeLeft,
    playerPosition,
    nextDirection,
    startGame,
    handleInput,
    reset,
  } = useInfiniteStairs();

  const isFalling = phase === 'falling';

  // 게임오버 화면
  if (phase === 'gameover') {
    const rankKey = getRankKey(score);
    const rankLabel = t(`games.infinite-stairs.ranks.${rankKey}`);
    return (
      <GameResult
        title={t('games.infinite-stairs.floor')}
        score={`${floor}${t('games.infinite-stairs.floorUnit')}`}
        scoreValue={score}
        gameId={GAME_CONFIG.id}
        subtitle={rankLabel}
        color={GAME_CONFIG.color}
        onRetry={reset}
        onShare={() => {
          if (navigator.share) {
            navigator.share({
              title: t('games.infinite-stairs.name'),
              text: `${floor}${t('games.infinite-stairs.floorUnit')} - ${rankLabel}`,
              url: window.location.href,
            });
          }
        }}
      >
        <div className="text-gray-400 text-sm">
          {t('games.infinite-stairs.totalScore')}: {score}
        </div>
      </GameResult>
    );
  }

  // 대기 화면
  if (phase === 'ready') {
    return (
      <div
        className="w-full h-full min-h-[60vh] flex flex-col items-center justify-center cursor-pointer rounded-3xl relative overflow-hidden"
        style={{ background: 'linear-gradient(180deg, #87CEEB 0%, #E0F0FF 100%)' }}
        onClick={startGame}
      >
        {/* 미리보기 계단 */}
        <div className="relative w-48 h-40 mb-6">
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className="absolute w-16 h-4 rounded"
              style={{
                background: 'linear-gradient(180deg, #ddd 0%, #aaa 100%)',
                bottom: `${20 + i * 28}px`,
                left: '50%',
                transform: `translateX(calc(-50% + ${(i % 2 === 0 ? -1 : 1) * 30}px))`,
              }}
            />
          ))}
          <div className="absolute text-3xl" style={{ bottom: '16px', left: '20%' }}>
            🏃
          </div>
        </div>

        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          {t('games.infinite-stairs.name')}
        </h1>
        <p className="text-gray-600 text-center mb-6 px-4 text-sm whitespace-pre-line">
          {t('games.infinite-stairs.description')}
        </p>
        <div className="px-6 py-3 bg-indigo-500 rounded-xl text-white font-bold shadow-lg">
          {t('common.tapToStart')}
        </div>
        <div className="mt-3 text-gray-500 text-xs">← → / A D</div>
      </div>
    );
  }

  // 플레이 화면
  // 환경 설정
  const env = getEnvironment(floor);

  // 계단 위치 계산
  const STAIR_WIDTH = 60;
  const STAIR_HEIGHT = 16;
  const STAIR_GAP_Y = 36;
  const STAIR_GAP_X = 40;

  // 플레이어 위치를 기준으로 계단 x 좌표 계산
  // 계단들의 누적 x 좌표 계산
  const stairPositions: number[] = [];
  let cumulativeX = 0;
  for (let i = 0; i < stairs.length; i++) {
    // 첫 번째 계단은 플레이어의 다음 위치
    if (i === 0) {
      cumulativeX = playerPosition + (stairs[i].direction === 'left' ? -1 : 1);
    } else {
      cumulativeX = stairPositions[i - 1] + (stairs[i].direction === 'left' ? -1 : 1);
    }
    stairPositions.push(cumulativeX);
  }

  // 화면 중앙에 플레이어 고정, 계단들이 이동
  const centerOffset = -playerPosition * STAIR_GAP_X;

  return (
    <div
      className="w-full h-full min-h-[60vh] flex flex-col rounded-3xl overflow-hidden relative select-none transition-all duration-1000"
      style={{ background: env.background }}
    >
      {/* 환경별 배경 장식 */}
      {env.decorations.map((deco) => (
        <div
          key={`deco-${deco.emoji}-${deco.top}-${deco.left}`}
          className="absolute pointer-events-none transition-opacity duration-1000"
          style={{
            top: deco.top,
            left: deco.left,
            opacity: deco.opacity,
            fontSize: deco.size,
          }}
        >
          {deco.emoji}
        </div>
      ))}

      {/* HUD */}
      <div className="absolute top-4 left-4 right-4 flex justify-between z-20">
        <div className="bg-black/40 backdrop-blur-sm px-3 py-1 rounded-lg shadow">
          <span className="text-xl font-bold text-white">{floor}</span>
          <span className="text-sm text-white/70 ml-1">{t('games.infinite-stairs.floorUnit')}</span>
        </div>
        <div
          className={`px-3 py-1 rounded-lg shadow text-xl font-bold backdrop-blur-sm ${
            timeLeft <= 3 ? 'bg-red-500/80 text-white animate-pulse' : 'bg-black/40 text-white'
          }`}
        >
          {timeLeft.toFixed(1)}s
        </div>
      </div>

      {/* 게임 영역 + 터치 영역 */}
      <div className="flex-1 relative overflow-hidden flex">
        {/* 왼쪽 터치 영역 */}
        <div
          className="absolute left-0 top-0 w-1/2 h-full z-10"
          onClick={() => !isFalling && handleInput('left')}
        />
        {/* 오른쪽 터치 영역 */}
        <div
          className="absolute right-0 top-0 w-1/2 h-full z-10"
          onClick={() => !isFalling && handleInput('right')}
        />

        {/* 계단 컨테이너 */}
        <div
          className="absolute w-full h-full"
          style={{
            transition: 'transform 0.1s ease-out',
            transform: `translateX(${centerOffset}px)`,
          }}
        >
          {/* 현재 플레이어가 서 있는 발판 */}
          <div
            className="absolute"
            style={{
              width: STAIR_WIDTH,
              height: STAIR_HEIGHT,
              bottom: '104px',
              left: '50%',
              transform: `translateX(calc(-50% + ${playerPosition * STAIR_GAP_X}px))`,
            }}
          >
            {/* 그림자 */}
            <div
              className="absolute rounded"
              style={{
                width: STAIR_WIDTH,
                height: STAIR_HEIGHT,
                background: 'rgba(0,0,0,0.15)',
                top: 3,
                left: 2,
              }}
            />
            {/* 발판 */}
            <div
              className="absolute rounded transition-all duration-500"
              style={{
                width: STAIR_WIDTH,
                height: STAIR_HEIGHT,
                background: env.currentStairColor,
              }}
            />
          </div>

          {/* 계단들 */}
          {stairs.map((stair, index) => {
            const stairX = stairPositions[index] * STAIR_GAP_X;
            const stairY = 140 + index * STAIR_GAP_Y;
            const isNext = index === 0;

            return (
              <div
                key={stair.id}
                className="absolute"
                style={{
                  width: STAIR_WIDTH,
                  height: STAIR_HEIGHT,
                  bottom: `${stairY}px`,
                  left: '50%',
                  transform: `translateX(calc(-50% + ${stairX}px))`,
                }}
              >
                {/* 그림자 */}
                <div
                  className="absolute rounded"
                  style={{
                    width: STAIR_WIDTH,
                    height: STAIR_HEIGHT,
                    background: 'rgba(0,0,0,0.15)',
                    top: 3,
                    left: 2,
                  }}
                />
                {/* 계단 */}
                <div
                  className="absolute rounded flex items-center justify-center transition-all duration-500"
                  style={{
                    width: STAIR_WIDTH,
                    height: STAIR_HEIGHT,
                    background: env.stairColor,
                    border: isNext ? '2px solid rgba(255,255,255,0.8)' : 'none',
                    boxShadow: isNext ? '0 0 10px rgba(255,255,255,0.5)' : 'none',
                  }}
                >
                  {isNext && (
                    <span className="text-white font-bold text-sm drop-shadow-md">
                      {stair.direction === 'left' ? '◀' : '▶'}
                    </span>
                  )}
                </div>
              </div>
            );
          })}

          {/* 플레이어 */}
          <div
            className="absolute z-10"
            style={{
              bottom: isFalling ? '-100px' : '120px',
              left: '50%',
              transform: `translateX(calc(-50% + ${playerPosition * STAIR_GAP_X}px))`,
              transition: isFalling ? 'bottom 0.5s ease-in' : 'transform 0.08s ease-out',
            }}
          >
            <div
              className="text-4xl"
              style={{
                // 🏃‍♂️ 이모지는 오른쪽을 향함. 왼쪽 가려면 뒤집기
                transform: nextDirection === 'left' ? 'scaleX(1)' : 'scaleX(-1)',
                filter: 'drop-shadow(1px 2px 1px rgba(0,0,0,0.3))',
              }}
            >
              {isFalling ? '😱' : '🏃‍♂️'}
            </div>
          </div>
        </div>
      </div>

      {/* 컨트롤 버튼 - 데스크톱에서만 표시 */}
      <div className="hidden sm:flex p-4 justify-center gap-6">
        <button
          className="w-28 h-16 bg-indigo-500 hover:bg-indigo-400 active:bg-indigo-600 rounded-xl text-3xl text-white shadow-lg active:scale-95 transition-transform"
          onClick={() => handleInput('left')}
          disabled={isFalling}
        >
          ◀
        </button>
        <button
          className="w-28 h-16 bg-indigo-500 hover:bg-indigo-400 active:bg-indigo-600 rounded-xl text-3xl text-white shadow-lg active:scale-95 transition-transform"
          onClick={() => handleInput('right')}
          disabled={isFalling}
        >
          ▶
        </button>
      </div>

      {/* 모바일 터치 힌트 */}
      <div className="sm:hidden p-2 flex justify-between text-white/40 text-xs px-4">
        <span>◀ 왼쪽 터치</span>
        <span>오른쪽 터치 ▶</span>
      </div>

      {/* 떨어질 때 효과 */}
      {isFalling && (
        <div className="absolute inset-0 bg-red-500/20 pointer-events-none animate-pulse" />
      )}
    </div>
  );
}
