// ============================================
// REMOTION ROOT COMPONENT
// ============================================
// Entry point for Remotion video compositions

import { Composition } from 'remotion';
import { ReadmeDemo } from './compositions/ReadmeDemo';
import { PromoVideo } from './compositions/PromoVideo';

export const RemotionRoot: React.FC = () => {
  return (
    <>
      {/* README Demo Video - 30 seconds at 30fps */}
      <Composition
        id="ReadmeDemo"
        component={ReadmeDemo}
        durationInFrames={900}
        fps={30}
        width={1920}
        height={1080}
      />

      {/* Promotional Video - 60 seconds at 30fps */}
      <Composition
        id="PromoVideo"
        component={PromoVideo}
        durationInFrames={1800}
        fps={30}
        width={1920}
        height={1080}
      />
    </>
  );
};
