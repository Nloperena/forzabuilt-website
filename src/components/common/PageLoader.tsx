import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const PageLoader: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if site has been loaded before in this session
    const hasLoadedBefore = sessionStorage.getItem('forzabuilt_has_loaded');
    
    // Skip loader if already loaded in this session
    if (hasLoadedBefore) {
      setIsVisible(false);
      return;
    }

    // Show loader for first load
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
          <div className="flex flex-col items-center gap-4 sm:gap-6 md:gap-8">
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
                className="relative w-48 h-48 sm:w-64 sm:h-64 md:w-80 md:h-80 lg:w-96 lg:h-96 xl:w-[36rem] xl:h-[36rem] z-10"
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

            <div className="flex flex-col items-center gap-4 sm:gap-5 md:gap-6">
              {/* Progress Bar / Indicator */}
              <div className="w-48 sm:w-64 md:w-80 lg:w-[28rem] h-1 bg-gray-100 rounded-full overflow-hidden relative">
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
                className="text-[#1B3764] font-poppins text-xs sm:text-sm md:text-base font-medium tracking-[0.2em] sm:tracking-[0.3em] md:tracking-[0.4em] uppercase pl-[0.2em] sm:pl-[0.3em] md:pl-[0.4em]"
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

