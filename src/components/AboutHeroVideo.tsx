import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const AboutHeroVideo: React.FC = () => {
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [minTimeElapsed, setMinTimeElapsed] = useState(false);
  const videoRef = React.useRef<HTMLVideoElement>(null);

  useEffect(() => {
    // 0.5s minimum wait for the WebP poster
    const timer = setTimeout(() => setMinTimeElapsed(true), 500);
    return () => clearTimeout(timer);
  }, []);

  const showVideo = videoLoaded && minTimeElapsed;

  return (
    <div className="absolute inset-0 w-full h-full">
      {/* Poster Image Layer */}
      <div className="absolute inset-0 z-0">
        <img
          src="/images/homepage-heroes/about-hero.webp"
          alt=""
          className={`w-full h-full object-cover transition-opacity duration-700 ${showVideo ? 'opacity-0' : 'opacity-100'}`}
          loading="eager"
          decoding="sync"
        />
      </div>
      
      {/* Background Video */}
      <video
        ref={videoRef}
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        poster="/images/homepage-heroes/about-hero.webp"
        onLoadedData={() => setVideoLoaded(true)}
        onCanPlay={() => setVideoLoaded(true)}
        className={`absolute inset-0 w-full h-full object-cover relative z-10 transition-opacity duration-700 ${
          showVideo ? 'opacity-100' : 'opacity-0'
        }`}
        style={{ 
          objectFit: 'cover',
          width: '100%',
          height: '100%',
          minWidth: '100%',
          minHeight: '100%'
        }}
      >
        <source src="/videos/backgrounds/WebOptimized/Forza Building Video for Desktop_Optimized.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Blue overlay on top of video for text contrast */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#2c476e]/60 to-[#81899f]/60" style={{ zIndex: 2 }} />
    </div>
  );
};

export default AboutHeroVideo;

