import { Metadata } from 'next';
import { getGameById } from './games';

const BASE_URL = 'https://ddangit.vercel.app';

/**
 * 게임별 SEO 메타데이터 생성
 * games.ts의 seo 정보를 사용하여 Next.js Metadata 객체 생성
 */
export function generateGameMetadata(gameId: string): Metadata {
  const game = getGameById(gameId);

  if (!game) {
    return {
      title: 'Game Not Found | ddangit',
      description: 'The requested game was not found.',
    };
  }

  return {
    title: game.seo.title,
    description: game.seo.description,
    openGraph: {
      title: game.seo.title,
      description: game.seo.description,
      url: `${BASE_URL}${game.path}`,
    },
    twitter: {
      card: 'summary_large_image',
      title: game.seo.title,
      description: game.seo.description,
    },
  };
}
