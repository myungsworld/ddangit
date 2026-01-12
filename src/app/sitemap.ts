import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://ddangit.vercel.app';

  const games = [
    'reaction-speed',
    'aim-trainer',
    'sand-tetris',
    'block-blast',
  ];

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    ...games.map((game) => ({
      url: `${baseUrl}/games/${game}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    })),
  ];
}
