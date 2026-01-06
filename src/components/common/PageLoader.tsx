import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const PageLoader: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if site has been loaded before in this session
    const hasLoadedBefore = sessionStorage.getItem('forzabuilt_has_loaded');
    const isHomePage = window.location.pathname === '/';
    
    // Skip loader if already loaded in this session AND not on homepage
    if (hasLoadedBefore && !isHomePage) {
      setIsVisible(false);
      return;
    }

    // Show loader for first load or every time visiting homepage
    setIsVisible(true);

    // Hide loader after page is fully loaded
    const handleLoad = () => {
      // Mark as loaded in sessionStorage
      sessionStorage.setItem('forzabuilt_has_loaded', 'true');
      
      // Reduced delay for snappier transition
      setTimeout(() => {
        setIsVisible(false);
      }, 400);
    };

    if (document.readyState === 'complete') {
      handleLoad();
    } else {
      window.addEventListener('load', handleLoad);
    }

    // Safety timeout - hide anyway after 5 seconds
    const safetyTimeout = setTimeout(() => {
      sessionStorage.setItem('forzabuilt_has_loaded', 'true');
      setIsVisible(false);
    }, 5000);

    return () => {
      window.removeEventListener('load', handleLoad);
      clearTimeout(safetyTimeout);
    };
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ 
            opacity: 0,
            transition: { duration: 0.6, ease: "easeInOut" }
          }}
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-white"
        >
          <div className="flex flex-col items-center gap-3 sm:gap-[18px] md:gap-6">
            {/* Logo Animation */}
            <div className="relative">
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ 
                  scale: 1,
                  opacity: 1,
                }}
                transition={{ 
                  duration: 0.5,
                  ease: "easeOut"
                }}
                className="relative w-[98px] h-[98px] sm:w-[123px] sm:h-[123px] md:w-[147px] md:h-[147px] lg:w-[172px] lg:h-[172px] xl:w-[197px] xl:h-[197px] z-10"
              >
                <img 
                  src="/logos/Forza-Eagle-Logo-Blue.svg" 
                  alt="Forza Logo" 
                  className="w-full h-full object-contain"
                  // @ts-ignore
                  fetchpriority="high"
                  loading="eager"
                />
              </motion.div>
              
              {/* Subtle pulse ring around logo */}
              <motion.div 
                animate={{ 
                  scale: [1, 1.1],
                  opacity: [0.3, 0]
                }}
                transition={{ 
                  duration: 1.2,
                  repeat: Infinity,
                  ease: "linear"
                }}
                className="absolute inset-0 rounded-full border border-[#1B3764] z-0"
              />
            </div>

            <div className="flex flex-col items-center gap-3 sm:gap-[15px] md:gap-[18px]">
              {/* Progress Bar / Indicator */}
              <div className="w-[98px] sm:w-[123px] md:w-[147px] lg:w-[172px] xl:w-[197px] h-1 bg-gray-100 rounded-full overflow-hidden relative">
                <motion.div 
                  animate={{ 
                    x: ["-100%", "100%"]
                  }}
                  transition={{ 
                    duration: 1.2, 
                    ease: "easeInOut",
                    repeat: Infinity
                  }}
                  className="absolute inset-0 bg-[#1B3764]"
                />
              </div>
              
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-[#1B3764] font-poppins text-[9.2px] sm:text-[10.7px] md:text-[12.3px] font-medium tracking-[0.2em] sm:tracking-[0.3em] md:tracking-[0.4em] uppercase pl-[0.2em] sm:pl-[0.3em] md:pl-[0.4em]"
              >
                Performance. Elevated.
              </motion.p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PageLoader;

