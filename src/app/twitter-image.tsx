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
        {/* Game Icon */}
        <div style={{ fontSize: '120px', marginBottom: '24px' }}>
          🎮
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
          }}
        >
          Quick Games
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
