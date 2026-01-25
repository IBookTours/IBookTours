// ============================================
// LOGO ANIMATION COMPONENT
// ============================================

import { AbsoluteFill, interpolate, useCurrentFrame, spring, useVideoConfig } from 'remotion';

interface LogoProps {
  delay?: number;
}

export const Logo: React.FC<LogoProps> = ({ delay = 0 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const adjustedFrame = frame - delay;

  const scale = spring({
    frame: adjustedFrame,
    fps,
    config: {
      damping: 100,
      stiffness: 200,
    },
  });

  const opacity = interpolate(adjustedFrame, [0, 15], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill
      style={{
        justifyContent: 'center',
        alignItems: 'center',
        opacity,
      }}
    >
      <div
        style={{
          transform: `scale(${scale})`,
          display: 'flex',
          alignItems: 'center',
          gap: 16,
        }}
      >
        {/* Logo Icon */}
        <svg
          width={80}
          height={80}
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="50" cy="50" r="45" fill="#E63946" />
          <path
            d="M35 45L50 30L65 45M50 30V70"
            stroke="white"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>

        {/* Logo Text */}
        <span
          style={{
            fontFamily: 'Plus Jakarta Sans, sans-serif',
            fontSize: 64,
            fontWeight: 800,
            color: '#1d3557',
          }}
        >
          ITravel
        </span>
      </div>
    </AbsoluteFill>
  );
};
