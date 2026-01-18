import { MetadataRoute } from 'next';
import { GAMES } from '@/shared/constants';

const BASE_URL = 'https://ddangit.vercel.app';

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    ...GAMES.map((game) => ({
      url: `${BASE_URL}${game.path}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    })),
    // Game guide pages
    ...GAMES.map((game) => ({
      url: `${BASE_URL}${game.path}/guide`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    })),
  ];
}
