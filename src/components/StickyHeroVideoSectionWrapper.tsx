import React from 'react';
import { GradientModeProvider } from '@/contexts/GradientModeContext';
import StickyHeroVideoSection from './StickyHeroVideoSection';

interface StickyHeroVideoSectionWrapperProps {
  children?: React.ReactNode;
}

const StickyHeroVideoSectionWrapper: React.FC<StickyHeroVideoSectionWrapperProps> = ({ children }) => {
  return (
    <GradientModeProvider>
      <StickyHeroVideoSection>
        {children}
      </StickyHeroVideoSection>
    </GradientModeProvider>
  );
};

export default StickyHeroVideoSectionWrapper;



