import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useGradientMode } from '@/contexts/GradientModeContext';
import EagleHeroVideo from './EagleHeroVideo';
import { getFontSize } from '@/styles/typography';

interface StickyHeroVideoSectionProps {
  children?: React.ReactNode;
}

const StickyHeroVideoSection: React.FC<StickyHeroVideoSectionProps> = ({ children }) => {
  const { mode } = useGradientMode();
  const [introFinished, setIntroFinished] = useState(false);

  useEffect(() => {
    // Check if intro has already been seen in this session
    const hasSeenIntro = sessionStorage.getItem('hasSeenIntro');
    if (hasSeenIntro) {
      setIntroFinished(true);
    }

    const handleIntroFinished = () => {
      setIntroFinished(true);
    };

    window.addEventListener('introFinished', handleIntroFinished);
    return () => window.removeEventListener('introFinished', handleIntroFinished);
  }, []);

  return (
      <div className="relative">
      {/* Sticky Video Background Section */}
      <div className="sticky top-0" style={{ zIndex: 1 }}>
        <EagleHeroVideo />
        
        {/* Text Overlay - centered on mobile and desktop */}
        <div className="absolute inset-0 flex flex-col items-center justify-center px-4 pointer-events-none text-center" style={{ zIndex: 20, padding: '0 0 4rem 0' }}>
          <motion.h1 
            initial={{ y: 30, opacity: 0 }}
            animate={introFinished ? { y: 0, opacity: 1 } : { y: 30, opacity: 0 }}
            transition={{ delay: 0.8, duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
            className={`font-regular text-white leading-tight ${
              mode === 'light2' ? 'font-poppins' : 'font-kallisto'
            }`} 
            style={getFontSize('hero')}
          >
            {mode === 'light2' ? (
              <>
                High-Performing<br />
                Industrial Adhesive, Tape<br />
                & Sealant Solutions
              </>
            ) : (
              <>
                <span className="block">High-Performing Industrial Adhesive,</span>
                <span className="block">Tape & Sealant Solutions</span>
              </>
            )}
          </motion.h1>
        </div>
      </div>

      {/* Scrollable content that slides over the sticky video */}
      <div className="relative pointer-events-auto" style={{ zIndex: 10 }}>
        {children}
      </div>
    </div>
  );
};

export default StickyHeroVideoSection;
