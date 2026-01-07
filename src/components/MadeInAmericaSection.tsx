import React, { useState, useRef, useEffect } from 'react';
import { useGradientMode } from '@/contexts/GradientModeContext';
import { getFontSize } from '@/styles/typography';
import OptimizedImage from './common/OptimizedImage';

// Video skeleton with blue dots
const VideoSkeleton: React.FC = () => (
  <div className="absolute inset-0 w-full h-full flex items-center justify-center bg-gray-200 z-0">
    <div className="flex space-x-2">
      <div className="w-3 h-3 bg-[#1B3764] rounded-full skeleton-dot"></div>
      <div className="w-3 h-3 bg-[#1B3764] rounded-full skeleton-dot"></div>
      <div className="w-3 h-3 bg-[#1B3764] rounded-full skeleton-dot"></div>
    </div>
  </div>
);

const MadeInAmericaSection: React.FC = () => {
  const { mode } = useGradientMode();
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [minTimeElapsed, setMinTimeElapsed] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [shouldLoadVideo, setShouldLoadVideo] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  // 0.5s minimum wait for the WebP poster when section is near viewport
  useEffect(() => {
    if (shouldLoadVideo) {
      const timer = setTimeout(() => setMinTimeElapsed(true), 500);
      return () => clearTimeout(timer);
    }
  }, [shouldLoadVideo]);

  const showVideo = isVideoLoaded && minTimeElapsed;

  // Intersection observer for visibility - start loading video when close to viewport
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setIsVisible(entry.isIntersecting);
          // Start loading video when section is near viewport (within 200px)
          if (entry.isIntersecting) {
            setShouldLoadVideo(true);
          }
        });
      },
      { 
        threshold: 0.1,
        rootMargin: '200px' // Start loading before fully in view
      }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Control video playback based on visibility
  useEffect(() => {
    if (videoRef.current && shouldLoadVideo) {
      if (isVisible) {
        videoRef.current.play().catch(() => {});
      } else {
        videoRef.current.pause();
      }
    }
  }, [isVisible, shouldLoadVideo]);

  return (
    <>
      <section ref={sectionRef} className="bg-[rgb(243_245_247)]">
        <div className="max-w-[100rem] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 2xl:px-12 pt-8 sm:pt-10 md:pt-12 lg:pt-16 xl:pt-20 pb-8 sm:pb-10 md:pb-12 lg:pb-16 xl:pb-20">
          {/* Top Content Area - Text and Flag */}
          <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] xl:grid-cols-[1.3fr_1fr] gap-3 sm:gap-4 md:gap-5 lg:gap-6 xl:gap-8 items-start">
            {/* Left side - Made in America Video - Takes up more space */}
            <div className="flex justify-center lg:justify-start h-full">
              <div className="w-full h-full aspect-video lg:aspect-auto overflow-hidden rounded-xl lg:rounded-xl shadow-lg relative bg-gray-200">
                {/* Poster Image Layer */}
                <div className="absolute inset-0 z-0">
                  <img
                    src="/images/homepage-heroes/madeinaamerica-hero.webp"
                    alt=""
                    className={`w-full h-full object-cover transition-opacity duration-500 ${showVideo ? 'opacity-0' : 'opacity-100'}`}
                    loading="eager"
                    decoding="sync"
                  />
                </div>
                
                {/* Background Video - only load when near viewport */}
                {shouldLoadVideo && (
                  <video
                    ref={videoRef}
                    src="/videos/backgrounds/WebOptimized/Manufactured in America_Optimized.mp4#t=0.001"
                    autoPlay
                    loop
                    muted
                    playsInline
                    preload="none"
                    poster="/images/homepage-heroes/madeinaamerica-hero.webp"
                    aria-label="Made in America manufacturing facility video"
                    onCanPlay={() => setIsVideoLoaded(true)}
                    onLoadedData={() => setIsVideoLoaded(true)}
                    className={`absolute inset-0 z-10 w-full h-full object-cover transition-opacity duration-500 ${showVideo ? 'opacity-100' : 'opacity-0'}`}
                    style={{
                      objectPosition: 'center',
                    }}
                  >
                    <track kind="captions" src="" label="No captions" default />
                  </video>
                )}
              </div>
            </div>

            {/* Right side - Text content - Scales down on smaller screens */}
            <div className="p-0 sm:p-1 lg:p-2 xl:p-3 flex flex-col h-full">
              <div className="flex flex-col h-full justify-between">
                {/* Title aligned with top of video */}
                <div className="text-center lg:text-left">
                  <h2
                    className={`font-normal max-w-none mb-2 sm:mb-3 md:mb-4 ${
                      mode === 'light2' ? 'text-[#2c476e]' : 'text-[#2c476e]'
                    } font-poppins`}
                    style={{ 
                      ...getFontSize('sectionHeading'),
                      lineHeight: '1.1'
                    }}
                  >
                    Proudly Manufactured<br />
                    in America
                  </h2>
                  {/* Paragraph text */}
                  <p className={`mb-2 sm:mb-3 md:mb-4 text-xs sm:text-sm md:text-base lg:text-base leading-relaxed ${
                    mode === 'light2' ? 'text-[#2c476e]/90' : 'text-[#2c476e]/90'
                  } font-poppins`}>
                    Real people, making real products, making a real difference! We don't just resell & re-label someone else's products, we actually make them.<br /><br />We proudly manufacture our products in the USA*, in America's heartland. From R&D to manufacturing, our vertical integration gives us full control over quality, consistency, and availability.
                  </p>
                </div>
                
                {/* American Flag Icon with Asterisk - Aligned with bottom of video */}
                <div className="flex justify-center lg:justify-start mt-2 sm:mt-3 md:mt-4">
                  <OptimizedImage 
                    src="/images/misc/Flag Icon with asterisk 1.png" 
                    alt="PROUDLY MADE IN AMERICA" 
                    width={256}
                    height={113}
                    mobileWidth={256}
                    className="h-16 w-auto object-contain"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

    </>
  );
};

export default MadeInAmericaSection;
