import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useSpring } from 'framer-motion';
import OptimizedImage from './OptimizedImage';

/**
 * IntroLoader Component
 * 
 * A premium, cinematic loading/intro screen that masks the website on initial load.
 * Appears only once per session to provide a high-end brand introduction.
 * Automatically dismisses once the window is fully loaded (window.onload).
 */
const IntroLoader: React.FC = () => {
  const [stage, setStage] = useState<'loading' | 'completing' | 'done'>('loading');
  const [isMounted, setIsMounted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [windowLoaded, setWindowLoaded] = useState(false);
  const loaderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsMounted(true);
    
    // Check if it's the first visit in this session
    const hasSeenIntro = sessionStorage.getItem('hasSeenIntro');
    if (hasSeenIntro) {
      setStage('done');
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

    // Progress simulation while waiting for load
    let progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 90) {
          if (windowLoaded) {
            clearInterval(progressInterval);
            return 100;
          }
          return 90; // Stay at 90 until window actually loads
        }
        return prev + (Math.random() * 15);
      });
    }, 200);

    // Minimum time to show intro for brand impact
    const minIntroTime = 2500;
    const startTime = Date.now();

    const checkReady = setInterval(() => {
      const elapsed = Date.now() - startTime;
      if (windowLoaded && elapsed >= minIntroTime) {
        clearInterval(checkReady);
        setStage('completing');
        
        // Final transition delay
        setTimeout(() => {
          setStage('done');
          sessionStorage.setItem('hasSeenIntro', 'true');
          
          // Unlock scroll and reveal body
          document.documentElement.classList.remove('intro-loading');
          document.body.style.overflow = '';
          document.body.style.height = '';
          
          // Emit custom event for other components to know intro is finished
          window.dispatchEvent(new CustomEvent('introFinished'));
        }, 800);
      }
    }, 100);

    return () => {
      window.removeEventListener('load', handleLoad);
      clearInterval(progressInterval);
      clearInterval(checkReady);
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
      scale: 0.8, 
      opacity: 0, 
      filter: 'blur(10px)',
      y: 20 
    },
    animate: { 
      scale: 1, 
      opacity: 1, 
      filter: 'blur(0px)',
      y: 0,
      transition: { 
        duration: 1.5, 
        ease: [0.22, 1, 0.36, 1] 
      }
    },
    exit: {
      scale: 1.1,
      opacity: 0,
      filter: 'blur(20px)',
      transition: { duration: 0.6, ease: "easeIn" }
    }
  };

  const mottoVariants = {
    initial: { opacity: 0, letterSpacing: '0.2em' },
    animate: { 
      opacity: 1, 
      letterSpacing: '0.4em',
      transition: { 
        delay: 0.8, 
        duration: 1.2, 
        ease: "easeOut" 
      }
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
          className="fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-[#000a12] overflow-hidden"
        >
          {/* Deep Cinematic Background */}
          <div className="absolute inset-0">
            {/* Base Gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#001524] via-[#000a12] to-black" />
            
            {/* Subtle Animated Glow */}
            <motion.div 
              animate={{ 
                opacity: [0.1, 0.2, 0.1],
                scale: [1, 1.1, 1],
              }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#2c476e] rounded-full blur-[120px] pointer-events-none"
            />

            {/* Grid Pattern Overlay */}
            <div className="absolute inset-0 opacity-[0.03]" 
              style={{ 
                backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', 
                backgroundSize: '40px 40px' 
              }} 
            />
          </div>

          <div className="relative z-10 flex flex-col items-center max-w-lg w-full px-6">
            {/* Logo Section */}
            <motion.div
              variants={logoVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="relative mb-12"
            >
              {/* Logo Glow */}
              <motion.div
                animate={{ opacity: [0.3, 0.6, 0.3] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="absolute inset-0 blur-2xl bg-[#F16022]/20 rounded-full scale-150"
              />
              
              <OptimizedImage 
                src="/logos/Forza-Eagle-Logo-White.svg" 
                alt="ForzaBuilt" 
                width={320}
                height={128}
                className="h-24 md:h-32 w-auto relative z-10 drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]"
              />
            </motion.div>

            {/* Brand Motto */}
            <div className="overflow-hidden mb-12">
              <motion.h2
                variants={mottoVariants}
                initial="initial"
                animate="animate"
                className="text-white font-poppins text-xs md:text-sm font-light uppercase tracking-[0.4em] text-center"
              >
                Engineered for Performance
              </motion.h2>
            </div>

            {/* Sophisticated Progress Bar */}
            <div className="relative w-full h-[2px] bg-white/5 overflow-hidden rounded-full">
              {/* Ghost track */}
              <div className="absolute inset-0 bg-white/5" />
              
              {/* Active track */}
              <motion.div
                initial={{ width: "0%" }}
                animate={{ 
                  width: `${progress}%`,
                  transition: { duration: 0.4, ease: "easeOut" }
                }}
                className="absolute top-0 left-0 h-full bg-[#F16022] shadow-[0_0_10px_#F16022]"
              />
              
              {/* Pulse effect on bar */}
              <motion.div
                animate={{ 
                  left: ["-100%", "100%"],
                  opacity: [0, 1, 0]
                }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-0 w-20 h-full bg-gradient-to-r from-transparent via-white/40 to-transparent"
              />
            </div>

            <div className="mt-4 flex justify-between items-center w-full">
              <motion.span 
                animate={{ opacity: [0.4, 0.8, 0.4] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="text-[9px] uppercase tracking-[0.2em] text-white/50 font-medium"
              >
                {progress < 100 ? 'System Check: Active' : 'Initialization: Complete'}
              </motion.span>
              
              <span className="text-[10px] tabular-nums text-[#F16022] font-semibold tracking-wider">
                {Math.round(progress)}%
              </span>
            </div>
          </div>

          {/* Reveal transition mask - sophisticated diagonal sweep */}
          <AnimatePresence>
            {stage === 'completing' && (
              <motion.div
                initial={{ x: "-100%" }}
                animate={{ x: "100%" }}
                transition={{ duration: 1.2, ease: [0.7, 0, 0.3, 1] }}
                className="absolute inset-0 bg-white z-20 pointer-events-none"
              />
            )}
          </AnimatePresence>

          {/* Curtain panels for reveal */}
          <motion.div 
            initial={{ scaleY: 1 }}
            animate={stage === 'completing' ? { scaleY: 0 } : { scaleY: 1 }}
            transition={{ delay: 0.2, duration: 0.8, ease: [0.77, 0, 0.175, 1] }}
            className="absolute inset-0 bg-black z-[15] origin-top pointer-events-none opacity-50"
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default IntroLoader;

