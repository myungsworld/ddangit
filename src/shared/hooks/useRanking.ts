'use client';

import { useState, useCallback } from 'react';
import { RankEntry } from '@/lib/ranking/types';

interface RankCheckResult {
  isTopRank: boolean;
  rank: number | null;
  currentTop3: RankEntry[];
}

interface UseRankingReturn {
  // 상태
  isChecking: boolean;
  isSubmitting: boolean;
  rankResult: RankCheckResult | null;
  submitResult: { success: boolean; rank: number | null } | null;
  todayRanking: RankEntry[];
  error: string | null;

  // 액션
  checkRank: (gameId: string, score: number) => Promise<RankCheckResult | null>;
  submitScore: (gameId: string, score: number, nickname: string) => Promise<boolean>;
  fetchRanking: (gameId: string) => Promise<void>;
  reset: () => void;
}

export function useRanking(): UseRankingReturn {
  const [isChecking, setIsChecking] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [rankResult, setRankResult] = useState<RankCheckResult | null>(null);
  const [submitResult, setSubmitResult] = useState<{ success: boolean; rank: number | null } | null>(null);
  const [todayRanking, setTodayRanking] = useState<RankEntry[]>([]);
  const [error, setError] = useState<string | null>(null);

  // 랭킹 체크
  const checkRank = useCallback(async (gameId: string, score: number): Promise<RankCheckResult | null> => {
    setIsChecking(true);
    setError(null);

    try {
      const res = await fetch('/api/ranking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ gameId, score, action: 'check' }),
      });

      if (!res.ok) throw new Error('Failed to check rank');

      const result: RankCheckResult = await res.json();
      setRankResult(result);
      setTodayRanking(result.currentTop3);
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      return null;
    } finally {
      setIsChecking(false);
    }
  }, []);

  // 점수 제출
  const submitScore = useCallback(async (gameId: string, score: number, nickname: string): Promise<boolean> => {
    setIsSubmitting(true);
    setError(null);

    try {
      const res = await fetch('/api/ranking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ gameId, score, nickname, action: 'submit' }),
      });

      if (!res.ok) throw new Error('Failed to submit score');

      const result = await res.json();
      setSubmitResult(result);

      // 제출 후 랭킹 다시 조회
      await fetchRanking(gameId);

      return result.success;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      return false;
    } finally {
      setIsSubmitting(false);
    }
  }, []);

  // 오늘 랭킹 조회
  const fetchRanking = useCallback(async (gameId: string): Promise<void> => {
    try {
      const res = await fetch(`/api/ranking?gameId=${gameId}`);
      if (!res.ok) throw new Error('Failed to fetch ranking');

      const { ranking } = await res.json();
      setTodayRanking(ranking);
    } catch (err) {
      console.error('Failed to fetch ranking:', err);
    }
  }, []);

  // 상태 초기화
  const reset = useCallback(() => {
    setRankResult(null);
    setSubmitResult(null);
    setError(null);
  }, []);

  return {
    isChecking,
    isSubmitting,
    rankResult,
    submitResult,
    todayRanking,
    error,
    checkRank,
    submitScore,
    fetchRanking,
    reset,
  };
}
