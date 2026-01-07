import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import VideoSkeleton from './common/VideoSkeleton';

const EagleHeroVideo: React.FC = () => {
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [isInView, setIsInView] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  // Control playback based on visibility
  useEffect(() => {
    if (videoRef.current) {
      if (isInView) {
        videoRef.current.play().catch(() => {});
      } else {
        videoRef.current.pause();
      }
    }
  }, [isInView]);

  useEffect(() => {
    // Start loading video immediately
    if (videoRef.current) {
      videoRef.current.load();
    }
    
    // Short fallback timeout - video should load fast since it's optimized
    const timeout = setTimeout(() => {
      if (!isVideoLoaded) {
        setIsVideoLoaded(true);
      }
    }, 2000);

    return () => clearTimeout(timeout);
  }, [isVideoLoaded]);

  const handleVideoLoad = () => {
    setIsVideoLoaded(true);
  };

  const handleVideoError = () => {
    setIsVideoLoaded(true);
  };

  return (
    <section ref={sectionRef} className="relative h-[50vh] md:h-[75vh] overflow-hidden bg-gradient-to-b from-[#2c476e] to-[#81899f] shadow-2xl md:pt-12 2xl:pt-0">
      {/* Poster Image Layer */}
      <div className="absolute inset-0 z-0">
        <img
          src="/images/homepage-heroes/eagle-hero.webp"
          alt=""
          className={`w-full h-full object-cover transition-opacity duration-500 ${isVideoLoaded ? 'opacity-0' : 'opacity-100'}`}
          loading="eager"
          decoding="sync"
          // @ts-ignore
          fetchpriority="high"
        />
      </div>
      
      {/* Background Video - loads immediately with high priority */}
      <motion.video
        ref={videoRef}
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        poster="/images/homepage-heroes/eagle-hero.webp"
        // @ts-ignore - fetchpriority is valid but not in React types yet
        fetchpriority="high"
        onLoadedData={handleVideoLoad}
        onCanPlay={handleVideoLoad}
        onError={handleVideoError}
        initial={{ scale: 1.1, opacity: 0 }}
        animate={{ 
          scale: isVideoLoaded ? 1 : 1.1,
          opacity: isVideoLoaded ? 1 : 0,
          transition: { duration: 1.5, ease: [0.22, 1, 0.36, 1] }
        }}
        className="absolute inset-0 w-full h-full object-cover"
        style={{ 
          zIndex: 1,
          objectFit: 'cover',
          width: '100%',
          height: '100%',
          minWidth: '100%',
          minHeight: '100%'
        }}
      >
        <source src="/videos/backgrounds/WebOptimized/Eagle Header Video_Optimized.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </motion.video>

      {/* Fallback background - always visible */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#2c476e] to-[#81899f]" style={{ zIndex: 0 }} />

      {/* Blue overlay on top of video */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 1 }}
        className="absolute inset-0 bg-gradient-to-b from-[#2c476e]/60 to-[#81899f]/60" 
        style={{ zIndex: 2 }} 
      />
    </section>
  );
};

export default EagleHeroVideo;

