import React, { useState, useEffect, useRef } from 'react';
import VideoSkeleton from './common/VideoSkeleton';

const ScalableHeroVideoSection: React.FC = () => {
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [minTimeElapsed, setMinTimeElapsed] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLElement>(null);
  const [videoAspectRatio, setVideoAspectRatio] = useState<number | null>(null);
  
  // 0.5s minimum wait for the WebP poster
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => setMinTimeElapsed(true), 500);
      return () => clearTimeout(timer);
    }
  }, [isVisible]);

  const showVideo = isVideoLoaded && minTimeElapsed;

  // Use IntersectionObserver to only load video when visible
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setIsVisible(entry.isIntersecting);
        });
      },
      { threshold: 0.1 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Control playback based on visibility
  useEffect(() => {
    if (videoRef.current) {
      if (isVisible) {
        videoRef.current.play().catch(() => {});
      } else {
        videoRef.current.pause();
      }
    }
  }, [isVisible]);

  useEffect(() => {
    if (!isVisible) return;
    
    // Short fallback timeout
    const timeout = setTimeout(() => {
      if (!isVideoLoaded) {
        setIsVideoLoaded(true);
      }
    }, 2000);

    return () => clearTimeout(timeout);
  }, [isVideoLoaded, isVisible]);

  useEffect(() => {
    if (!isVisible || !videoRef.current) return;
    
    const video = videoRef.current;
    
    const handleLoadedMetadata = () => {
      if (video.videoWidth && video.videoHeight) {
        const aspectRatio = video.videoWidth / video.videoHeight;
        setVideoAspectRatio(aspectRatio);
      }
    };
    
    const handleCanPlay = () => {
      setIsVideoLoaded(true);
      if (video.videoWidth && video.videoHeight && !videoAspectRatio) {
        const aspectRatio = video.videoWidth / video.videoHeight;
        setVideoAspectRatio(aspectRatio);
      }
      if (isVisible) {
        video.play().catch(() => {});
      }
    };
    
    video.addEventListener('canplay', handleCanPlay);
    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    
    video.load();
    
    return () => {
      video.removeEventListener('canplay', handleCanPlay);
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
    };
  }, [videoAspectRatio, isVisible]);

  const handleVideoLoad = () => {
    setIsVideoLoaded(true);
  };

  const handleVideoError = (e: React.SyntheticEvent<HTMLVideoElement, Event>) => {
    console.error('Slogan Slam video failed to load:', e);
    setIsVideoLoaded(true);
  };

  // Default aspect ratio (16:9) if video metadata hasn't loaded yet
  const aspectRatioStyle = videoAspectRatio 
    ? { aspectRatio: `${videoAspectRatio}` }
    : { aspectRatio: '16 / 9' };

  return (
    <section ref={containerRef} className="relative w-full overflow-hidden bg-gradient-to-b from-[#2c476e] to-[#81899f] shadow-2xl">
      {/* Container that maintains video aspect ratio */}
      <div 
        className="relative w-full"
        style={aspectRatioStyle}
      >
        {/* Poster Image Layer */}
        <div className="absolute inset-0 z-0">
          <img
            src="/images/homepage-heroes/eagle-hero.webp"
            alt=""
            className={`w-full h-full object-cover transition-opacity duration-500 ${showVideo ? 'opacity-0' : 'opacity-100'}`}
            loading="lazy"
          />
        </div>
        
        {/* Background Video - only render when visible */}
        {isVisible && (
          <video
            ref={videoRef}
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            poster="/images/homepage-heroes/eagle-hero.webp"
            onLoadedData={handleVideoLoad}
            onCanPlay={handleVideoLoad}
            onError={handleVideoError}
            className={`absolute inset-0 w-full h-full transition-opacity duration-500 relative z-10 ${
              showVideo ? 'opacity-100' : 'opacity-0'
            }`}
            style={{ 
              objectFit: 'contain',
              objectPosition: 'center'
            }}
          >
            <source src="/videos/backgrounds/WebOptimized/Forza Slogan Slam Final_Optimized.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        )}

        {/* Fallback background gradient */}
        <div 
          className="absolute inset-0 bg-gradient-to-b from-[#2c476e] to-[#81899f]" 
          style={{ zIndex: 0 }} 
        />
      </div>
    </section>
  );
};

export default ScalableHeroVideoSection;

