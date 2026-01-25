// ============================================
// DESTINATION CARD ANIMATION COMPONENT
// ============================================

import { Img, interpolate, useCurrentFrame, spring, useVideoConfig } from 'remotion';

interface DestinationCardProps {
  name: string;
  image: string;
  price?: string;
  delay?: number;
  x?: number;
  y?: number;
}

export const DestinationCard: React.FC<DestinationCardProps> = ({
  name,
  image,
  price,
  delay = 0,
  x = 0,
  y = 0,
}) => {
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
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width: 350,
        borderRadius: 20,
        overflow: 'hidden',
        background: 'white',
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.2)',
        opacity,
        transform: `scale(${scale})`,
      }}
    >
      <div style={{ position: 'relative', height: 200 }}>
        <Img
          src={image}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
        />
        {price && (
          <div
            style={{
              position: 'absolute',
              top: 16,
              right: 16,
              background: '#E63946',
              color: 'white',
              padding: '8px 16px',
              borderRadius: 20,
              fontFamily: 'Plus Jakarta Sans, sans-serif',
              fontWeight: 700,
              fontSize: 18,
            }}
          >
            {price}
          </div>
        )}
      </div>
      <div style={{ padding: 20 }}>
        <h3
          style={{
            fontFamily: 'Plus Jakarta Sans, sans-serif',
            fontSize: 24,
            fontWeight: 700,
            color: '#1d3557',
            margin: 0,
          }}
        >
          {name}
        </h3>
      </div>
    </div>
  );
};
