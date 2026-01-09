'use client';

export type AdSize = 'banner' | 'rectangle' | 'leaderboard';
export type AdPosition = 'top' | 'bottom' | 'inline';

interface AdSlotProps {
  size?: AdSize;
  position?: AdPosition;
  className?: string;
}

const sizeStyles: Record<AdSize, string> = {
  banner: 'h-14',           // 320x50 mobile banner
  rectangle: 'h-64',        // 300x250 medium rectangle
  leaderboard: 'h-24',      // 728x90 leaderboard
};

const positionStyles: Record<AdPosition, string> = {
  top: 'sticky top-0 z-40',
  bottom: 'sticky bottom-0 z-40',
  inline: '',
};

export function AdSlot({
  size = 'banner',
  position = 'inline',
  className = ''
}: AdSlotProps) {
  return (
    <div className={`p-2 ${positionStyles[position]} ${className}`}>
      <div
        className={`
          ${sizeStyles[size]}
          w-full max-w-lg mx-auto
          bg-gray-900 rounded-xl
          flex items-center justify-center
          text-gray-600 text-xs
        `}
      >
        {/* Replace with actual AdSense code */}
        Ad
      </div>
    </div>
  );
}
