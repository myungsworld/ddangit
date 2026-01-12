import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export const alt = 'ddangit - Quick Games';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'system-ui, sans-serif',
        }}
      >
        {/* Game Icons */}
        <div
          style={{
            display: 'flex',
            gap: '24px',
            marginBottom: '40px',
            fontSize: '64px',
          }}
        >
          <span>🧱</span>
          <span>🧩</span>
          <span>⚡</span>
          <span>🔗</span>
          <span>📦</span>
          <span>🎨</span>
        </div>

        {/* Title */}
        <div
          style={{
            fontSize: '96px',
            fontWeight: 'bold',
            color: 'white',
            marginBottom: '16px',
            letterSpacing: '-2px',
          }}
        >
          ddangit
        </div>

        {/* Subtitle */}
        <div
          style={{
            fontSize: '36px',
            color: '#94a3b8',
            marginBottom: '48px',
          }}
        >
          Quick Games
        </div>

        {/* Game Tags */}
        <div
          style={{
            display: 'flex',
            gap: '16px',
          }}
        >
          {['Sand Tetris', 'Block Blast', 'Reaction', 'Color Chain', 'Tariff Dodge', 'Color Match'].map((game) => (
            <div
              key={game}
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                padding: '12px 24px',
                borderRadius: '24px',
                color: '#e2e8f0',
                fontSize: '20px',
              }}
            >
              {game}
            </div>
          ))}
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
