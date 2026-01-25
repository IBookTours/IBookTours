// ============================================
// TEXT REVEAL ANIMATION COMPONENT
// ============================================

import { interpolate, useCurrentFrame, spring, useVideoConfig } from 'remotion';

interface TextRevealProps {
  text: string;
  delay?: number;
  fontSize?: number;
  fontWeight?: number;
  color?: string;
  centered?: boolean;
}

export const TextReveal: React.FC<TextRevealProps> = ({
  text,
  delay = 0,
  fontSize = 48,
  fontWeight = 700,
  color = '#1d3557',
  centered = true,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const adjustedFrame = frame - delay;

  const words = text.split(' ');

  return (
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: centered ? 'center' : 'flex-start',
        gap: fontSize * 0.3,
      }}
    >
      {words.map((word, i) => {
        const wordDelay = i * 3;
        const wordFrame = adjustedFrame - wordDelay;

        const translateY = spring({
          frame: wordFrame,
          fps,
          config: {
            damping: 100,
            stiffness: 200,
          },
        });

        const opacity = interpolate(wordFrame, [0, 10], [0, 1], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        });

        return (
          <span
            key={i}
            style={{
              fontFamily: 'Plus Jakarta Sans, sans-serif',
              fontSize,
              fontWeight,
              color,
              opacity,
              transform: `translateY(${interpolate(translateY, [0, 1], [30, 0])}px)`,
              display: 'inline-block',
            }}
          >
            {word}
          </span>
        );
      })}
    </div>
  );
};
