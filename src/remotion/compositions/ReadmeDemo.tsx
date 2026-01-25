// ============================================
// README DEMO VIDEO COMPOSITION
// ============================================
// 30-second demo video for the README

import {
  AbsoluteFill,
  Sequence,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import { Logo, TextReveal, ImageSlide, DestinationCard } from '../components';

// Brand colors
const colors = {
  oxford: '#1d3557',
  cerulean: '#457b9d',
  powder: '#a8dadc',
  honeydew: '#f1faee',
  red: '#E63946',
};

// Destination images (using Unsplash)
const destinations = [
  {
    name: 'Albanian Riviera',
    image: 'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=800&q=80',
    price: 'From €899',
  },
  {
    name: 'Berat UNESCO',
    image: 'https://images.unsplash.com/photo-1580822184713-fc5400e7fe10?w=800&q=80',
    price: 'From €599',
  },
  {
    name: 'Albanian Alps',
    image: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=800&q=80',
    price: 'From €749',
  },
];

export const ReadmeDemo: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  return (
    <AbsoluteFill style={{ background: colors.honeydew }}>
      {/* Scene 1: Logo Intro (0-3s / frames 0-90) */}
      <Sequence from={0} durationInFrames={90}>
        <AbsoluteFill
          style={{
            background: `linear-gradient(135deg, ${colors.honeydew} 0%, ${colors.powder} 100%)`,
          }}
        >
          <Logo delay={10} />
        </AbsoluteFill>
      </Sequence>

      {/* Scene 2: Hero Showcase (3-8s / frames 90-240) */}
      <Sequence from={90} durationInFrames={150}>
        <ImageSlide
          src="https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=1920&q=80"
          delay={0}
          duration={150}
          overlay={true}
        />
        <AbsoluteFill
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'column',
            gap: 30,
          }}
        >
          <TextReveal
            text="Discover Albania"
            delay={15}
            fontSize={96}
            fontWeight={800}
            color="white"
          />
          <TextReveal
            text="Your next adventure awaits"
            delay={30}
            fontSize={40}
            fontWeight={500}
            color="rgba(255, 255, 255, 0.9)"
          />
        </AbsoluteFill>
      </Sequence>

      {/* Scene 3: Features Grid (8-15s / frames 240-450) */}
      <Sequence from={240} durationInFrames={210}>
        <AbsoluteFill
          style={{
            background: colors.honeydew,
            justifyContent: 'center',
            alignItems: 'center',
            padding: 80,
          }}
        >
          <div style={{ textAlign: 'center', marginBottom: 60 }}>
            <TextReveal
              text="Book Tours & Packages"
              delay={10}
              fontSize={64}
              fontWeight={700}
              color={colors.oxford}
            />
          </div>
          <div style={{ display: 'flex', gap: 40 }}>
            {destinations.map((dest, i) => (
              <DestinationCard
                key={dest.name}
                name={dest.name}
                image={dest.image}
                price={dest.price}
                delay={30 + i * 15}
                x={140 + i * 400}
                y={280}
              />
            ))}
          </div>
        </AbsoluteFill>
      </Sequence>

      {/* Scene 4: Mobile View (15-20s / frames 450-600) */}
      <Sequence from={450} durationInFrames={150}>
        <AbsoluteFill
          style={{
            background: `linear-gradient(135deg, ${colors.cerulean} 0%, ${colors.oxford} 100%)`,
            justifyContent: 'center',
            alignItems: 'center',
            gap: 80,
          }}
        >
          {/* Phone mockup */}
          <div
            style={{
              width: 300,
              height: 600,
              background: '#111',
              borderRadius: 40,
              padding: 12,
              boxShadow: '0 40px 100px rgba(0, 0, 0, 0.3)',
            }}
          >
            <div
              style={{
                width: '100%',
                height: '100%',
                borderRadius: 30,
                overflow: 'hidden',
                background: colors.honeydew,
              }}
            >
              <ImageSlide
                src="https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=400&q=80"
                delay={0}
                duration={150}
                zoomIn={false}
                overlay={false}
              />
            </div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <TextReveal
              text="Mobile Responsive"
              delay={30}
              fontSize={56}
              fontWeight={700}
              color="white"
            />
            <TextReveal
              text="Book anywhere, anytime"
              delay={50}
              fontSize={32}
              fontWeight={500}
              color="rgba(255, 255, 255, 0.85)"
            />
          </div>
        </AbsoluteFill>
      </Sequence>

      {/* Scene 5: Dark/Light Mode (20-25s / frames 600-750) */}
      <Sequence from={600} durationInFrames={150}>
        <AbsoluteFill
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            gap: 60,
          }}
        >
          <div style={{ display: 'flex', gap: 40 }}>
            {/* Light mode mockup */}
            <div
              style={{
                width: 400,
                height: 300,
                background: colors.honeydew,
                borderRadius: 20,
                padding: 30,
                boxShadow: '0 20px 60px rgba(0, 0, 0, 0.15)',
              }}
            >
              <div
                style={{
                  fontFamily: 'Plus Jakarta Sans, sans-serif',
                  fontSize: 28,
                  fontWeight: 700,
                  color: colors.oxford,
                }}
              >
                Light Mode
              </div>
            </div>
            {/* Dark mode mockup */}
            <div
              style={{
                width: 400,
                height: 300,
                background: '#1a1a2e',
                borderRadius: 20,
                padding: 30,
                boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
              }}
            >
              <div
                style={{
                  fontFamily: 'Plus Jakarta Sans, sans-serif',
                  fontSize: 28,
                  fontWeight: 700,
                  color: '#e0e0e0',
                }}
              >
                Dark Mode
              </div>
            </div>
          </div>
          <TextReveal
            text="Choose Your Theme"
            delay={30}
            fontSize={48}
            fontWeight={700}
            color={colors.oxford}
          />
        </AbsoluteFill>
      </Sequence>

      {/* Scene 6: CTA (25-30s / frames 750-900) */}
      <Sequence from={750} durationInFrames={150}>
        <AbsoluteFill
          style={{
            background: `linear-gradient(135deg, ${colors.red} 0%, #c53030 100%)`,
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'column',
            gap: 40,
          }}
        >
          <TextReveal
            text="Start Exploring"
            delay={10}
            fontSize={80}
            fontWeight={800}
            color="white"
          />
          <TextReveal
            text="itravel.vercel.app"
            delay={30}
            fontSize={36}
            fontWeight={600}
            color="rgba(255, 255, 255, 0.9)"
          />
          {/* GitHub badge */}
          <div
            style={{
              marginTop: 30,
              background: 'rgba(255, 255, 255, 0.15)',
              padding: '16px 32px',
              borderRadius: 50,
              display: 'flex',
              alignItems: 'center',
              gap: 12,
            }}
          >
            <svg
              width={32}
              height={32}
              viewBox="0 0 24 24"
              fill="white"
            >
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
            </svg>
            <span
              style={{
                fontFamily: 'Plus Jakarta Sans, sans-serif',
                fontSize: 24,
                fontWeight: 600,
                color: 'white',
              }}
            >
              View on GitHub
            </span>
          </div>
        </AbsoluteFill>
      </Sequence>
    </AbsoluteFill>
  );
};
