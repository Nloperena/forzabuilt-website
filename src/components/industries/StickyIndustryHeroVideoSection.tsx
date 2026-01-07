import React, { useState, useEffect } from 'react';
import VideoSkeleton from '../common/VideoSkeleton';

interface StickyIndustryHeroVideoSectionProps {
  videoUrl: string;
  posterUrl?: string;
  industryTitle: string;
  children?: React.ReactNode;
}

const StickyIndustryHeroVideoSection: React.FC<StickyIndustryHeroVideoSectionProps> = ({ 
  videoUrl, 
  posterUrl,
  industryTitle,
  children 
}) => {
  const [videoLoaded, setVideoLoaded] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (!videoLoaded) {
        setVideoLoaded(true);
      }
    }, 5000);

    return () => {
      clearTimeout(timeout);
    };
  }, [videoLoaded]);

  const handleVideoLoad = () => {
    setVideoLoaded(true);
  };

  const handleVideoError = () => {
    setVideoLoaded(true);
  };

  return (
    <>
      {/* Sticky Video Background Section */}
      <section className="sticky top-0 h-[50vh] md:h-[75vh] overflow-hidden bg-gradient-to-b from-[#2c476e] to-[#81899f] shadow-2xl md:pt-12 2xl:pt-0" style={{ zIndex: 1 }}>
        {/* Poster Image Layer */}
        <div className="absolute inset-0 z-0">
          {posterUrl ? (
            <img
              src={posterUrl}
              alt=""
              className={`w-full h-full object-cover transition-opacity duration-500 ${videoLoaded ? 'opacity-0' : 'opacity-100'}`}
              loading="eager"
              decoding="sync"
            />
          ) : (
            <VideoSkeleton />
          )}
        </div>
        
        {/* Background Video */}
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
            videoLoaded ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <source src={videoUrl} type="video/mp4" />
          Your browser does not support the video tag.
        </video>

        {/* Fallback background - always visible */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#2c476e] to-[#81899f]" style={{ zIndex: 0 }} />

        {/* Blue overlay on top of video */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#2c476e]/60 to-[#81899f]/60" style={{ zIndex: 2 }} />
      </section>

      {/* Content that will slide over the sticky video background */}
      <div className="relative pointer-events-auto" style={{ zIndex: 10 }}>
        {children}
      </div>
    </>
  );
};

export default StickyIndustryHeroVideoSection;

