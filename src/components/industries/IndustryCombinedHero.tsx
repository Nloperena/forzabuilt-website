import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import VideoSkeleton from '../common/VideoSkeleton';
import ImageSkeleton from '../common/ImageSkeleton';
import OptimizedImage from '../common/OptimizedImage';

interface IndustryCombinedHeroProps {
  videoUrl: string;
  posterUrl?: string;
  title: string;
  logo?: string;
  children: React.ReactNode;
}

const IndustryCombinedHero: React.FC<IndustryCombinedHeroProps> = ({ 
  videoUrl, 
  posterUrl,
  title, 
  logo, 
  children 
}) => {
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [minTimeElapsed, setMinTimeElapsed] = useState(false);
  const [iconLoaded, setIconLoaded] = useState(false);

  useEffect(() => {
    // 0.5s minimum wait for the WebP poster
    const timer = setTimeout(() => setMinTimeElapsed(true), 500);
    
    const timeout = setTimeout(() => {
      if (!videoLoaded) {
        setVideoLoaded(true);
      }
    }, 5000);
    return () => {
      clearTimeout(timer);
      clearTimeout(timeout);
    };
  }, [videoLoaded]);

  const showVideo = videoLoaded && minTimeElapsed;

  const handleVideoLoad = () => setVideoLoaded(true);
  const handleVideoError = () => setVideoLoaded(true);
  const handleIconLoad = () => setIconLoaded(true);
  const handleIconError = () => setIconLoaded(true);

  return (
    <>
      {/* Fixed/Sticky Video Section */}
      <section className="relative h-[55vh] md:h-[80vh] overflow-hidden bg-gradient-to-b from-[#2c476e] to-[#81899f] shadow-2xl md:pt-12 2xl:pt-0">
        {/* Poster Image Layer */}
        <div className="absolute inset-0 z-0">
          {posterUrl ? (
            <OptimizedImage
              src={posterUrl}
              alt=""
              width={1920}
              height={1080}
              className={`w-full h-full object-cover transition-opacity duration-500 ${showVideo ? 'opacity-0' : 'opacity-100'}`}
              loading="eager"
              decoding="sync"
            />
          ) : (
            <VideoSkeleton />
          )}
        </div>
        
        {/* Video Background */}
        <video
          key={videoUrl}
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          poster={posterUrl}
          onLoadedData={handleVideoLoad}
          onCanPlay={handleVideoLoad}
          onError={handleVideoError}
          className={`absolute inset-0 w-full h-full object-cover relative z-10 transition-opacity duration-700 ${
            showVideo ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <source src={videoUrl} type="video/mp4" />
        </video>

        {/* Overlays */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#2c476e] to-[#81899f] -z-10" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#2c476e]/60 to-[#81899f]/60 z-[2]" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent z-[2]" />

        {/* Centered Title & Logo (Fixed behavior) */}
        <div className="absolute inset-0 flex flex-col items-center justify-center z-[20] pointer-events-none px-4">
            <motion.div 
            className="w-full flex items-center justify-center"
            style={{ 
                gap: 'clamp(1rem, 2vw, 2rem)'
            }}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.3 }}
            >
            <h1
                className="font-black mb-0 leading-none font-kallisto text-white text-center"
                style={{ 
                textShadow: '2px 2px 8px rgba(0, 0, 0, 0.8), 0 0 20px rgba(0, 0, 0, 0.5)',
                fontSize: 'clamp(2rem, 5vw + 0.5rem, 6rem)'
                }}
            >
                {title.toUpperCase()}
            </h1>
            {logo && (
                <div className="relative hidden md:block" style={{ width: 'clamp(4rem, 8vw, 12rem)', height: 'clamp(4rem, 8vw, 12rem)' }}>
                {!iconLoaded && <ImageSkeleton className="rounded-lg" />}
                <motion.img
                    src={logo}
                    alt={`${title} icon`}
                    className="w-auto h-full object-contain transition-opacity duration-500"
                    style={{ 
                    filter: 'drop-shadow(2px 2px 4px rgba(0,0,0,0.8))',
                    opacity: iconLoaded ? 1 : 0
                    }}
                    loading="lazy"
                    onLoad={handleIconLoad}
                    onError={handleIconError}
                />
                </div>
            )}
            </motion.div>
        </div>
      </section>

      {/* Sliding Content */}
      <div className="relative pointer-events-auto z-30 -mt-40 md:-mt-56 lg:-mt-64 xl:-mt-68">
        {children}
      </div>
    </>
  );
};

export default IndustryCombinedHero;

