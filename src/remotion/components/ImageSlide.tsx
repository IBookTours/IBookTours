// ============================================
// IMAGE SLIDE ANIMATION COMPONENT
// ============================================

import { AbsoluteFill, Img, interpolate, useCurrentFrame, spring, useVideoConfig } from 'remotion';

interface ImageSlideProps {
  src: string;
  delay?: number;
  duration?: number;
  zoomIn?: boolean;
  overlay?: boolean;
}

export const ImageSlide: React.FC<ImageSlideProps> = ({
  src,
  delay = 0,
  duration = 90,
  zoomIn = true,
  overlay = true,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const adjustedFrame = frame - delay;

  // Fade in at start
  const opacity = interpolate(
    adjustedFrame,
    [0, 15, duration - 15, duration],
    [0, 1, 1, 0],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    }
  );

  // Ken Burns zoom effect
  const scale = zoomIn
    ? interpolate(adjustedFrame, [0, duration], [1, 1.15], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
      })
    : 1;

  if (adjustedFrame < 0 || adjustedFrame > duration) {
    return null;
  }

  return (
    <AbsoluteFill style={{ opacity }}>
      <Img
        src={src}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          transform: `scale(${scale})`,
        }}
      />
      {overlay && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(to bottom, rgba(29, 53, 87, 0.3) 0%, rgba(29, 53, 87, 0.5) 100%)',
          }}
        />
      )}
    </AbsoluteFill>
  );
};
