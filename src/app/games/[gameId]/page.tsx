import { notFound } from 'next/navigation';
import { use } from 'react';
import { GameLayout } from '@/shared/components/game';
import { generateGameMetadata, getGameById, getGameIds } from '@/shared/constants';
import { GameRenderer } from './GameRenderer';

type Params = Promise<{ gameId: string }>;

// 빌드 시 정적 경로 생성 (SEO 유지)
export function generateStaticParams() {
  return getGameIds().map((id) => ({ gameId: id }));
}

// 동적 메타데이터 생성
export async function generateMetadata({ params }: { params: Params }) {
  const { gameId } = await params;
  return generateGameMetadata(gameId);
}

export default function GamePage({ params }: { params: Params }) {
  const { gameId } = use(params);

  const game = getGameById(gameId);
  if (!game) notFound();

  return (
    <GameLayout gameId={game.id} color={game.color}>
      <div className="w-full max-w-lg mx-auto">
        <GameRenderer gameId={gameId} />
      </div>
    </GameLayout>
  );
}
