import React, { useRef, useCallback, useState, useEffect } from 'react';
import { industries } from '../data/industries';
import VideoSkeleton from './common/VideoSkeleton';
import OptimizedImage from './common/OptimizedImage';

// Individual industry card with hover-to-play video
const IndustryCard: React.FC<{
  industry: typeof industries[0];
  isMobile?: boolean;
}> = ({ industry, isMobile = false }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoReady, setVideoReady] = useState(false);

  // Check if video is already ready (cached)
  useEffect(() => {
    if (videoRef.current && videoRef.current.readyState >= 3) {
      setVideoReady(true);
    }
  }, []);

  const handleMouseEnter = useCallback(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(() => {});
    }
  }, []);

  const handleMouseLeave = useCallback(() => {
    if (videoRef.current) {
      videoRef.current.pause();
      // Reset to beginning for consistent thumbnail
      videoRef.current.currentTime = 0;
    }
  }, []);

  const handleCanPlay = () => {
    setVideoReady(true);
  };

  return (
    <a 
      className="block w-full h-full" 
      href={`/industries/${industry.title.toLowerCase()}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div 
        className={`aspect-[6/4] ${isMobile ? 'rounded-xl' : 'rounded-xl lg:rounded-xl'} overflow-hidden transition-all duration-300 hover:scale-105 group cursor-pointer w-full border-0 shadow-lg text-white relative`}
        style={{ backgroundColor: industry.color || '#1b3764' }}
      >
        {/* Loading State / Background Placeholder */}
        {!videoReady && (
          <div className="absolute inset-0 z-0">
            <div 
              className="w-full h-full animate-pulse opacity-50" 
              style={{ backgroundColor: industry.color || '#1b3764' }}
            />
          </div>
        )}

        <div className="relative w-full h-full overflow-hidden">
          {/* Video - shows first frame as thumbnail, plays on hover */}
          <video 
            ref={videoRef}
            loop 
            muted 
            playsInline 
            preload="none"
            aria-label={`${industry.title} industry background video`}
            onLoadedData={handleCanPlay}
            onCanPlay={handleCanPlay}
            onError={handleCanPlay} // Remove skeleton on error to show background color
            className={`w-full h-full object-cover transition-opacity duration-500 ${videoReady ? 'opacity-100' : 'opacity-0'}`}
          >
            <source src={`${industry.videoUrl}#t=0.001`} type="video/mp4" />
            <track kind="captions" src="" label="No captions" default />
          </video>
          
          {/* Gradient overlay - fades on hover */}
          <div 
            className="absolute inset-0 pointer-events-none transition-opacity duration-300 group-hover:opacity-0" 
            style={{ 
              zIndex: 9, 
              background: 'linear-gradient(to top, rgba(27, 55, 100, 0.85) 0%, rgba(27, 55, 100, 0.7) 10%, rgba(27, 55, 100, 0.5) 20%, rgba(27, 55, 100, 0.3) 30%, rgba(27, 55, 100, 0.15) 40%, transparent 50%)' 
            }}
          />
          
          {/* Industry title and logo */}
          <div 
            className={isMobile 
              ? "absolute bottom-0 left-0 pt-2 pr-2 pb-2 pl-2" 
              : "absolute bottom-0 left-0 pt-1.5 sm:pt-2 md:pt-2.5 lg:pt-3 pr-1.5 sm:pr-2 md:pr-2.5 lg:pr-3 pb-0 pl-0"
            } 
            style={{ zIndex: 10 }}
          >
            <div className={isMobile ? "flex items-center gap-1.5 sm:gap-2" : "flex items-center gap-1 sm:gap-1.5 md:gap-2 lg:gap-2.5"}>
              {industry.logo && (
                <OptimizedImage 
                  src={industry.logo} 
                  alt={`${industry.title} logo`} 
                  width={128}
                  height={128}
                  mobileWidth={64}
                  sizes="(max-width: 640px) 40px, 56px"
                  className={isMobile 
                    ? "w-8 h-8 sm:w-10 sm:h-10 transition-transform duration-150" 
                    : "w-10 h-10 md:w-12 md:h-12 lg:w-14 lg:h-14 xl:w-14 xl:h-14 2xl:w-16 2xl:h-16 transition-transform duration-150"
                  } 
                  style={{ filter: 'drop-shadow(rgba(0, 0, 0, 0.8) 0px 2px 4px)' }} 
                />
              )}
              <h3 
                className={isMobile 
                  ? "font-poppins font-normal text-left leading-none cursor-pointer transition-all duration-300 group-hover:font-bold text-base sm:text-lg" 
                  : "font-poppins font-normal text-left leading-none cursor-pointer transition-all duration-300 group-hover:font-bold text-base md:text-lg lg:text-xl"
                } 
                style={{ color: 'rgb(255, 255, 255)', textShadow: 'rgba(0, 0, 0, 0.8) 1px 1px 2px' }}
              >
                {industry.title}
              </h3>
            </div>
          </div>
        </div>
      </div>
    </a>
  );
};

const IndustryCardsSection = ({ industries: industriesProp }: { industries?: typeof industries }) => {
  const displayIndustries = industriesProp || industries;
  
  return (
    <section className="pt-2 md:pt-3 lg:pt-4 bg-white w-full relative z-20">
      <div className="w-full bg-white pt-4 md:pt-6 px-4 mx-auto max-w-7xl 2xl:max-w-[1600px] relative z-10">
        <div className="text-center relative z-10">
          <h2 className="font-regular text-[#2c476e] mb-6 sm:mb-8 leading-tight font-poppins" style={{ fontSize: 'clamp(22px, 0.5rem + 2vw, 44px)' }}>
            Industries We Serve
          </h2>
        </div>
      </div>

      <div className="w-full px-4 sm:px-6 md:px-8 lg:px-12 xl:px-24 2xl:px-32">
        {/* Mobile View */}
        <div className="block md:hidden">
          <div className="grid grid-cols-2 gap-3 sm:gap-4 max-w-lg mx-auto">
            {displayIndustries.map((industry) => (
              <IndustryCard key={`mobile-${industry.title}`} industry={industry} isMobile={true} />
            ))}
          </div>
          <div className="text-center mt-6 mb-4">
            <p className="text-sm sm:text-base font-poppins text-gray-600">
              Don't see your industry? <a href="/contact" className="text-[#F2611D] hover:text-[#F2611D]/80 font-medium transition-colors hover:underline underline-offset-4">Contact Us</a>
            </p>
          </div>
        </div>

        {/* Desktop View */}
        <div className="sr-only md:not-sr-only md:flex w-full flex-col items-center">
          <div className="grid grid-cols-3 gap-4 md:gap-6 lg:gap-8 xl:gap-10 2xl:gap-12 w-full max-w-[1000px] lg:max-w-[1100px] xl:max-w-[1200px] 2xl:max-w-[1400px] mb-3 md:mb-4 mx-auto py-2 sm:py-3 md:py-3 lg:py-4">
            {displayIndustries.map((industry) => (
              <div key={`desktop-${industry.title}`} className="block">
                <IndustryCard industry={industry} isMobile={false} />
              </div>
            ))}
          </div>
          <div className="hidden md:block w-full text-center mt-4 md:mt-6 lg:mt-6 pb-8 md:pb-12 lg:pb-14">
            <p className="font-poppins text-gray-600 font-normal text-sm md:text-base">
              Don't see your industry? <a href="/contact" className="text-[#F2611D] hover:text-[#F2611D]/80 font-medium transition-colors hover:underline underline-offset-4">Contact us</a>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default IndustryCardsSection;
