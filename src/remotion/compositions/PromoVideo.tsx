// ============================================
// PROMOTIONAL VIDEO COMPOSITION
// ============================================
// 60-second promotional video for marketing

import {
  AbsoluteFill,
  Sequence,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
  Img,
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

// Destination images
const destinations = [
  {
    name: 'Albanian Riviera',
    image: 'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=800&q=80',
    price: 'From €899',
  },
  {
    name: 'Berat UNESCO City',
    image: 'https://images.unsplash.com/photo-1580822184713-fc5400e7fe10?w=800&q=80',
    price: 'From €599',
  },
  {
    name: 'Albanian Alps',
    image: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=800&q=80',
    price: 'From €749',
  },
];

// Testimonials
const testimonials = [
  {
    name: 'Sarah M.',
    text: 'An unforgettable experience!',
    rating: 5,
  },
  {
    name: 'John D.',
    text: 'Best tour company in Albania',
    rating: 5,
  },
];

// Partner logos (using placeholder SVGs)
const partners = ['Amadeus', 'Stripe', 'Google', 'Booking'];

export const PromoVideo: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill style={{ background: colors.honeydew }}>
      {/* Scene 1: Cinematic Intro (0-5s / frames 0-150) */}
      <Sequence from={0} durationInFrames={150}>
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
          }}
        >
          <Logo delay={30} />
        </AbsoluteFill>
      </Sequence>

      {/* Scene 2: Problem Statement (5-12s / frames 150-360) */}
      <Sequence from={150} durationInFrames={210}>
        <AbsoluteFill
          style={{
            background: colors.oxford,
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'column',
            gap: 40,
          }}
        >
          <TextReveal
            text="Planning your dream trip"
            delay={15}
            fontSize={64}
            fontWeight={700}
            color="white"
          />
          <TextReveal
            text="shouldn't be complicated"
            delay={45}
            fontSize={64}
            fontWeight={700}
            color={colors.powder}
          />
          <div
            style={{
              marginTop: 40,
              opacity: interpolate(frame - 180, [0, 30], [0, 1], {
                extrapolateLeft: 'clamp',
                extrapolateRight: 'clamp',
              }),
            }}
          >
            <TextReveal
              text="That's why we created ITravel"
              delay={90}
              fontSize={36}
              fontWeight={500}
              color="rgba(255, 255, 255, 0.8)"
            />
          </div>
        </AbsoluteFill>
      </Sequence>

      {/* Scene 3: Solution - Features (12-25s / frames 360-750) */}
      <Sequence from={360} durationInFrames={390}>
        <AbsoluteFill
          style={{
            background: colors.honeydew,
          }}
        >
          {/* Browse Destinations - frames 360-480 */}
          <Sequence from={0} durationInFrames={120}>
            <AbsoluteFill
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'column',
                gap: 30,
              }}
            >
              <TextReveal
                text="Browse Destinations"
                delay={10}
                fontSize={56}
                fontWeight={700}
                color={colors.oxford}
              />
              <div
                style={{
                  display: 'flex',
                  gap: 30,
                  marginTop: 40,
                }}
              >
                {destinations.map((dest, i) => (
                  <div
                    key={dest.name}
                    style={{
                      opacity: interpolate(frame - 390 - i * 15, [0, 20], [0, 1], {
                        extrapolateLeft: 'clamp',
                        extrapolateRight: 'clamp',
                      }),
                      transform: `translateY(${interpolate(
                        frame - 390 - i * 15,
                        [0, 20],
                        [30, 0],
                        {
                          extrapolateLeft: 'clamp',
                          extrapolateRight: 'clamp',
                        }
                      )}px)`,
                    }}
                  >
                    <DestinationCard
                      name={dest.name}
                      image={dest.image}
                      price={dest.price}
                      delay={0}
                      x={0}
                      y={0}
                    />
                  </div>
                ))}
              </div>
            </AbsoluteFill>
          </Sequence>

          {/* Book Packages - frames 480-600 */}
          <Sequence from={120} durationInFrames={120}>
            <AbsoluteFill
              style={{
                background: colors.cerulean,
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'column',
                gap: 30,
              }}
            >
              <TextReveal
                text="Book Vacation Packages"
                delay={10}
                fontSize={56}
                fontWeight={700}
                color="white"
              />
              <TextReveal
                text="Flight + Hotel + Tours"
                delay={30}
                fontSize={36}
                fontWeight={500}
                color="rgba(255, 255, 255, 0.85)"
              />
            </AbsoluteFill>
          </Sequence>

          {/* Day Tours - frames 600-720 */}
          <Sequence from={240} durationInFrames={120}>
            <AbsoluteFill
              style={{
                background: colors.powder,
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'column',
                gap: 30,
              }}
            >
              <TextReveal
                text="Guided Day Tours"
                delay={10}
                fontSize={56}
                fontWeight={700}
                color={colors.oxford}
              />
              <TextReveal
                text="Expert local guides"
                delay={30}
                fontSize={36}
                fontWeight={500}
                color={colors.cerulean}
              />
            </AbsoluteFill>
          </Sequence>
        </AbsoluteFill>
      </Sequence>

      {/* Scene 4: Social Proof - Testimonials (25-35s / frames 750-1050) */}
      <Sequence from={750} durationInFrames={300}>
        <AbsoluteFill
          style={{
            background: colors.honeydew,
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'column',
            gap: 50,
          }}
        >
          <TextReveal
            text="Trusted by Travelers"
            delay={10}
            fontSize={56}
            fontWeight={700}
            color={colors.oxford}
          />
          <div
            style={{
              display: 'flex',
              gap: 40,
              marginTop: 30,
            }}
          >
            {testimonials.map((t, i) => (
              <div
                key={t.name}
                style={{
                  width: 400,
                  padding: 40,
                  background: 'white',
                  borderRadius: 24,
                  boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)',
                  opacity: interpolate(frame - 780 - i * 30, [0, 30], [0, 1], {
                    extrapolateLeft: 'clamp',
                    extrapolateRight: 'clamp',
                  }),
                }}
              >
                {/* Stars */}
                <div style={{ display: 'flex', gap: 4, marginBottom: 16 }}>
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <span key={j} style={{ fontSize: 24 }}>
                      ⭐
                    </span>
                  ))}
                </div>
                <p
                  style={{
                    fontFamily: 'Plus Jakarta Sans, sans-serif',
                    fontSize: 24,
                    color: colors.oxford,
                    fontStyle: 'italic',
                    margin: 0,
                  }}
                >
                  "{t.text}"
                </p>
                <p
                  style={{
                    fontFamily: 'Plus Jakarta Sans, sans-serif',
                    fontSize: 18,
                    color: colors.cerulean,
                    marginTop: 16,
                    fontWeight: 600,
                  }}
                >
                  - {t.name}
                </p>
              </div>
            ))}
          </div>
        </AbsoluteFill>
      </Sequence>

      {/* Scene 5: Partner Logos (35-42s / frames 1050-1260) */}
      <Sequence from={1050} durationInFrames={210}>
        <AbsoluteFill
          style={{
            background: 'white',
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'column',
            gap: 50,
          }}
        >
          <TextReveal
            text="Powered By"
            delay={10}
            fontSize={48}
            fontWeight={600}
            color={colors.cerulean}
          />
          <div
            style={{
              display: 'flex',
              gap: 60,
              alignItems: 'center',
            }}
          >
            {partners.map((p, i) => (
              <div
                key={p}
                style={{
                  padding: '20px 40px',
                  background: colors.honeydew,
                  borderRadius: 16,
                  opacity: interpolate(frame - 1080 - i * 15, [0, 20], [0, 1], {
                    extrapolateLeft: 'clamp',
                    extrapolateRight: 'clamp',
                  }),
                }}
              >
                <span
                  style={{
                    fontFamily: 'Plus Jakarta Sans, sans-serif',
                    fontSize: 28,
                    fontWeight: 700,
                    color: colors.oxford,
                  }}
                >
                  {p}
                </span>
              </div>
            ))}
          </div>
        </AbsoluteFill>
      </Sequence>

      {/* Scene 6: Call to Action (42-50s / frames 1260-1500) */}
      <Sequence from={1260} durationInFrames={240}>
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
            text="Book Your Adventure"
            delay={15}
            fontSize={80}
            fontWeight={800}
            color="white"
          />
          <TextReveal
            text="Today"
            delay={40}
            fontSize={80}
            fontWeight={800}
            color="rgba(255, 255, 255, 0.9)"
          />
          <div
            style={{
              marginTop: 40,
              background: 'white',
              padding: '20px 50px',
              borderRadius: 50,
              opacity: interpolate(frame - 1320, [0, 30], [0, 1], {
                extrapolateLeft: 'clamp',
                extrapolateRight: 'clamp',
              }),
            }}
          >
            <span
              style={{
                fontFamily: 'Plus Jakarta Sans, sans-serif',
                fontSize: 28,
                fontWeight: 700,
                color: colors.red,
              }}
            >
              itravel.vercel.app
            </span>
          </div>
        </AbsoluteFill>
      </Sequence>

      {/* Scene 7: Logo + Contact (50-60s / frames 1500-1800) */}
      <Sequence from={1500} durationInFrames={300}>
        <AbsoluteFill
          style={{
            background: colors.honeydew,
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'column',
            gap: 50,
          }}
        >
          <Logo delay={15} />
          <div
            style={{
              marginTop: 40,
              display: 'flex',
              gap: 30,
              opacity: interpolate(frame - 1560, [0, 30], [0, 1], {
                extrapolateLeft: 'clamp',
                extrapolateRight: 'clamp',
              }),
            }}
          >
            {/* Social icons placeholder */}
            {['Website', 'Instagram', 'Facebook'].map((s, i) => (
              <div
                key={s}
                style={{
                  padding: '12px 24px',
                  background: colors.oxford,
                  borderRadius: 30,
                }}
              >
                <span
                  style={{
                    fontFamily: 'Plus Jakarta Sans, sans-serif',
                    fontSize: 18,
                    fontWeight: 600,
                    color: 'white',
                  }}
                >
                  {s}
                </span>
              </div>
            ))}
          </div>
          <p
            style={{
              fontFamily: 'Plus Jakarta Sans, sans-serif',
              fontSize: 24,
              color: colors.cerulean,
              marginTop: 30,
              opacity: interpolate(frame - 1590, [0, 30], [0, 1], {
                extrapolateLeft: 'clamp',
                extrapolateRight: 'clamp',
              }),
            }}
          >
            Discover the beauty of Albania
          </p>
        </AbsoluteFill>
      </Sequence>
    </AbsoluteFill>
  );
};
