import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import OptimizedImage from './OptimizedImage';

/**
 * IntroLoader Component - "Precision Engineering" Edition
 * 
 * A high-end cinematic intro screen designed to reinforce ForzaBuilt's 
 * industrial brand identity. Features a pressure-gauge style progress bar 
 * and metallic sheen effects.
 * 
 * Dispatches 'introFinished' to reveal hidden content in:
 * - HeaderWrapper.tsx
 * - StickyHeroVideoSection.tsx
 * - EagleHeroVideo.tsx
 */
const IntroLoader: React.FC = () => {
  // Check if intro has already been seen in this session immediately
  const [stage, setStage] = useState<'loading' | 'completing' | 'done'>(() => {
    if (typeof window !== 'undefined' && sessionStorage.getItem('hasSeenIntro')) {
      return 'done';
    }
    return 'loading';
  });
  
  const [isMounted, setIsMounted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [windowLoaded, setWindowLoaded] = useState(false);
  const loaderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsMounted(true);
    
    // Safety check: if stage is already done, just dispatch and exit
    if (stage === 'done') {
      window.dispatchEvent(new CustomEvent('introFinished'));
      return;
    }

    // Lock scroll while intro is playing
    document.documentElement.classList.add('intro-loading');
    document.body.style.overflow = 'hidden';
    document.body.style.height = '100vh';

    // Track window load state
    const handleLoad = () => {
      setWindowLoaded(true);
    };

    if (document.readyState === 'complete') {
      setWindowLoaded(true);
    } else {
      window.addEventListener('load', handleLoad);
    }

    // Safety timeout: Ensure intro finishes even if window load event doesn't fire
    // 5 seconds is plenty for initial assets
    const safetyTimeout = setTimeout(() => {
      if (!windowLoaded) {
        console.log('IntroLoader: Safety timeout triggered');
        setWindowLoaded(true);
      }
    }, 5000);

    // Industrial Pressure Gauge Progress Simulation
    // Moves in "steps" to feel like machinery checking systems
    let progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 92) {
          if (windowLoaded) {
            clearInterval(progressInterval);
            return 100;
          }
          return 92; // Hold at 92% until heavy assets are ready
        }
        // Varied increments for a mechanical feel
        const increment = Math.random() > 0.7 ? 12 : 5;
        return Math.min(prev + increment, 92);
      });
    }, 250);

    // Minimum time to show intro for brand impact (2.8s total cinematic experience)
    const minIntroTime = 2800;
    const startTime = Date.now();

    const checkReady = setInterval(() => {
      const elapsed = Date.now() - startTime;
      
      // Use a local check for windowLoaded to avoid dependency issues
      const isActuallyLoaded = windowLoaded || document.readyState === 'complete';
      
      if (isActuallyLoaded && elapsed >= minIntroTime && progress >= 100) {
        clearInterval(checkReady);
        setStage('completing');
        
        // Phase-out delay for the reveal animation
        setTimeout(() => {
          setStage('done');
          sessionStorage.setItem('hasSeenIntro', 'true');
          
          // Unlock scroll and reveal body
          document.documentElement.classList.remove('intro-loading');
          document.body.style.overflow = '';
          document.body.style.height = '';
          
          // CRITICAL: Signal to other components that the stage is set
          window.dispatchEvent(new CustomEvent('introFinished'));
        }, 1000); // 1s reveal sweep
      }
    }, 100);

    return () => {
      window.removeEventListener('load', handleLoad);
      clearInterval(progressInterval);
      clearInterval(checkReady);
      clearTimeout(safetyTimeout);
      document.documentElement.classList.remove('intro-loading');
      document.body.style.overflow = '';
      document.body.style.height = '';
    };
  }, [windowLoaded]);

  // Don't render anything during SSR or if intro already seen
  if (!isMounted || stage === 'done') return null;

  const containerVariants = {
    loading: { opacity: 1 },
    completing: { 
      opacity: 1,
      transition: { duration: 0.8 }
    },
    exit: {
      opacity: 0,
      transition: { duration: 0.8, ease: [0.43, 0.13, 0.23, 0.96] }
    }
  };

  const logoVariants = {
    initial: { 
      scale: 0.85, 
      opacity: 0, 
      filter: 'blur(8px)',
    },
    animate: { 
      scale: 1, 
      opacity: 1, 
      filter: 'blur(0px)',
      transition: { 
        duration: 1.8, 
        ease: [0.22, 1, 0.36, 1] 
      }
    },
    exit: {
      scale: 1.05,
      opacity: 0,
      filter: 'blur(15px)',
      transition: { duration: 0.6, ease: "easeIn" }
    }
  };

  return (
    <AnimatePresence mode="wait">
      {stage !== 'done' && (
        <motion.div
          ref={loaderRef}
          key="intro-loader"
          variants={containerVariants}
          initial="loading"
          animate={stage}
          exit="exit"
          className="fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-[#0a1628] overflow-hidden"
        >
          {/* Industrial Cinematic Background */}
          <div className="absolute inset-0">
            {/* Deep Navy to Black Radial Gradient */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#1B3764]/20 via-[#0a1628] to-black" />
            
            {/* Subtle Metallic Sheen - Moving slowly */}
            <motion.div 
              animate={{ 
                x: ['-100%', '100%'],
                opacity: [0, 0.05, 0],
              }}
              transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12 pointer-events-none"
            />

            {/* Industrial Mesh/Grid Overlay */}
            <div className="absolute inset-0 opacity-[0.05]" 
              style={{ 
                backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', 
                backgroundSize: '50px 50px' 
              }} 
            />
          </div>

          <div className="relative z-10 flex flex-col items-center max-w-lg w-full px-8">
            {/* Centerpiece: The Logo */}
            <motion.div
              variants={logoVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="relative mb-16"
            >
              {/* Dynamic Logo Aura */}
              <motion.div
                animate={{ 
                  opacity: [0.2, 0.4, 0.2],
                  scale: [1.2, 1.4, 1.2]
                }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute inset-0 blur-3xl bg-[#F2611D]/15 rounded-full"
              />
              
              <OptimizedImage 
                src="/logos/Forza-Eagle-Logo-White.svg" 
                alt="ForzaBuilt" 
                width={360}
                height={140}
                className="h-28 md:h-36 w-auto relative z-10 drop-shadow-[0_0_20px_rgba(255,255,255,0.1)]"
              />
            </motion.div>

            {/* Tagline Reveal */}
            <div className="overflow-hidden mb-16">
              <motion.h2
                initial={{ opacity: 0, y: 10 }}
                animate={{ 
                  opacity: 1, 
                  y: 0,
                  transition: { delay: 1, duration: 1 }
                }}
                className="text-white font-poppins text-xs md:text-sm font-medium uppercase tracking-[0.5em] text-center opacity-80"
              >
                Engineered for Performance
              </motion.h2>
            </div>

            {/* Precision Gauge Bar */}
            <div className="relative w-full h-[3px] bg-white/10 overflow-hidden rounded-full border border-white/5">
              {/* Internal Pressure/Progress */}
              <motion.div
                initial={{ width: "0%" }}
                animate={{ 
                  width: `${progress}%`,
                  transition: { duration: 0.5, ease: "easeOut" }
                }}
                className="absolute top-0 left-0 h-full bg-[#F2611D] shadow-[0_0_12px_#F2611D]"
              />
              
              {/* Moving Precision Scanner */}
              <motion.div
                animate={{ 
                  left: ["-20%", "120%"],
                }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="absolute top-0 w-24 h-full bg-gradient-to-r from-transparent via-white/40 to-transparent"
              />
            </div>

            {/* System Status Display */}
            <div className="mt-6 flex justify-between items-end w-full">
              <div className="flex flex-col gap-1">
                <motion.span 
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="text-[9px] uppercase tracking-[0.2em] text-[#F2611D] font-bold"
                >
                  {progress < 100 ? 'Analyzing Systems' : 'Optimization Complete'}
                </motion.span>
                <span className="text-[8px] uppercase tracking-[0.1em] text-white/30 font-medium">
                  Protocol: FB-OPTIMIZE-V2
                </span>
              </div>
              
              <div className="flex flex-col items-end">
                <span className="text-[12px] tabular-nums text-white font-light tracking-widest flex items-baseline gap-1">
                  <span className="text-[#F2611D] font-bold">{Math.round(progress)}</span>
                  <span className="text-[8px] opacity-40">%</span>
                </span>
              </div>
            </div>
          </div>

          {/* Reveal Animation: The Precision Cut (Horizontal Wipe) */}
          <AnimatePresence>
            {stage === 'completing' && (
              <motion.div
                initial={{ x: "-100%" }}
                animate={{ x: "100%" }}
                transition={{ duration: 1.4, ease: [0.7, 0, 0.3, 1] }}
                className="absolute inset-0 bg-white z-50 pointer-events-none"
              >
                {/* Wipe Trail Glow */}
                <div className="absolute right-full top-0 bottom-0 w-40 bg-gradient-to-r from-transparent to-white/30 blur-xl" />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Masking Panels */}
          <motion.div 
            initial={{ scaleX: 1 }}
            animate={stage === 'completing' ? { scaleX: 0 } : { scaleX: 1 }}
            transition={{ delay: 0.3, duration: 0.9, ease: [0.77, 0, 0.175, 1] }}
            className="absolute inset-0 bg-black z-[20] origin-right pointer-events-none opacity-40"
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default IntroLoader;
