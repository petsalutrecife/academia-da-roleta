import React, { useEffect, useState } from 'react';
import { AnimatedLogo } from './AnimatedLogo';

interface QuizSplashScreenProps {
  onComplete: () => void;
}

export const QuizSplashScreen: React.FC<QuizSplashScreenProps> = ({ onComplete }) => {
  const [visible, setVisible] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);
  const [logoScale, setLogoScale] = useState(0.85);
  const [logoOpacity, setLogoOpacity] = useState(0);

  useEffect(() => {
    // Stage 2: Logo Fade-In and Scale-Up starting slightly after mount
    const logoEntranceTimer = setTimeout(() => {
      setLogoOpacity(1);
      setLogoScale(1);
    }, 100);

    // Stage 4: Trigger fade-out transition at 2.7s
    const fadeOutTimer = setTimeout(() => {
      setFadeOut(true);
    }, 2700);

    // Unmount and trigger completion at 3.2s (total duration 3.2s)
    const completeTimer = setTimeout(() => {
      setVisible(false);
      onComplete();
    }, 3200);

    return () => {
      clearTimeout(logoEntranceTimer);
      clearTimeout(fadeOutTimer);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  if (!visible) return null;

  return (
    <div
      className="no-print"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 999999, // Ensure it covers everything
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        // Sophisticated navy background with subtle central light glow
        background: 'radial-gradient(circle at center, #0a2863 0%, #071a44 60%, #030d24 100%)',
        opacity: fadeOut ? 0 : 1,
        transition: 'opacity 0.5s cubic-bezier(0.25, 1, 0.5, 1)', // Smooth fade-out
        pointerEvents: fadeOut ? 'none' : 'auto', // Allow clicks behind it while fading
      }}
    >
      {/* Subtle background glow element for extra luxury visual identity */}
      <div
        style={{
          position: 'absolute',
          width: '500px',
          height: '500px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(18, 61, 132, 0.4) 0%, rgba(10, 40, 99, 0) 70%)',
          pointerEvents: 'none',
          zIndex: 1,
          animation: 'pulseGlow 4s ease-in-out infinite alternate',
        }}
      />

      {/* Styled Logo Component */}
      <div
        style={{
          zIndex: 2,
          opacity: logoOpacity,
          transform: `scale(${logoScale})`,
          transition: 'opacity 1s ease-out, transform 1s cubic-bezier(0.34, 1.56, 0.64, 1)', // Elastic pop scale
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <AnimatedLogo
          size={320} // Slightly larger for the splash screen presentation
          spinDuration={2} // Giro de apresentação: 2s (approx 1.8 to 2.2s)
          introMode={true}
        />
      </div>

      {/* Keyframe animation for subtle background glow pulse */}
      <style>{`
        @keyframes pulseGlow {
          0% { transform: scale(0.9); opacity: 0.8; }
          100% { transform: scale(1.1); opacity: 1.2; }
        }
      `}</style>
    </div>
  );
};
