'use client';

import Link from 'next/link';
import { ReactNode, useEffect, useState } from 'react';
import { Button } from '../ui/Button';
import { NicknameModal } from './NicknameModal';
import { RankingBoard } from './RankingBoard';
import { useRanking } from '@/shared/hooks';

interface GameResultProps {
  title: string;
  score: string;
  scoreValue: number; // 랭킹 비교용 숫자 값
  gameId: string;     // 랭킹 저장용 게임 ID
  subtitle?: string;
  children?: ReactNode;
  onRetry: () => void;
  onShare?: () => void;
  color: string;
}

export function GameResult({
  title,
  score,
  scoreValue,
  gameId,
  subtitle,
  children,
  onRetry,
  onShare,
  color,
}: GameResultProps) {
  const {
    isChecking,
    isSubmitting,
    rankResult,
    todayRanking,
    checkRank,
    submitScore,
    fetchRanking,
    reset: resetRanking,
  } = useRanking();

  const [showNicknameModal, setShowNicknameModal] = useState(false);
  const [submittedRank, setSubmittedRank] = useState<number | null>(null);

  // 결과 표시 시 랭킹 체크 (0점 이상이면 랭킹 체크, 아니면 랭킹만 조회)
  useEffect(() => {
    if (gameId) {
      if (scoreValue > 0) {
        checkRank(gameId, scoreValue);
      } else {
        fetchRanking(gameId);
      }
    }
  }, [gameId, scoreValue, checkRank, fetchRanking]);

  const handleRetry = () => {
    resetRanking();
    setShowNicknameModal(false);
    setSubmittedRank(null);
    onRetry();
  };

  const handleNicknameSubmit = async (nickname: string) => {
    const success = await submitScore(gameId, scoreValue, nickname);
    if (success && rankResult?.rank) {
      setSubmittedRank(rankResult.rank);
    }
    setShowNicknameModal(false);
  };

  const canSubmitRank = rankResult?.isTopRank && !submittedRank && !showNicknameModal;

  return (
    <>
      {showNicknameModal && rankResult?.rank && (
        <NicknameModal
          rank={rankResult.rank}
          score={score}
          color={color}
          onSubmit={handleNicknameSubmit}
          onSkip={() => setShowNicknameModal(false)}
          isSubmitting={isSubmitting}
        />
      )}

      <div className="w-full max-w-md mx-auto text-center p-8">
        <div className="mb-8">
          <p className="text-gray-500 uppercase tracking-widest text-sm mb-2">{title}</p>
          <div className="text-6xl font-bold mb-4" style={{ color }}>
            {score}
          </div>
          {subtitle && <p className="text-gray-400">{subtitle}</p>}
        </div>

        {children && <div className="mb-6">{children}</div>}

        {/* 랭킹 진입 버튼 */}
        {canSubmitRank && (
          <button
            onClick={() => setShowNicknameModal(true)}
            className="w-full py-3 mb-6 rounded-lg font-bold text-white transition-transform hover:scale-105"
            style={{ backgroundColor: color }}
          >
            🏆 You&apos;re #{rankResult.rank}! Enter your name
          </button>
        )}

        {/* 오늘의 랭킹 (항상 표시) */}
        {!isChecking && (
          <div className="mb-6">
            <RankingBoard
              ranking={todayRanking}
              highlightRank={submittedRank}
              color={color}
            />
          </div>
        )}

        <div className="flex flex-col gap-4">
          <div className="flex gap-4 justify-center">
            <Button onClick={handleRetry} variant="primary" size="lg">
              Retry
            </Button>
            {onShare && (
              <Button onClick={onShare} variant="secondary" size="lg">
                Share
              </Button>
            )}
          </div>
          <Link
            href="/"
            className="text-gray-500 hover:text-gray-300 transition-colors text-sm"
          >
            ← Try other games
          </Link>
        </div>
      </div>
    </>
  );
}
