import React, { useState, useEffect } from 'react';
import ImageSkeleton from '../common/ImageSkeleton';

interface ProductCategoryFamilyHeroProps {
  category: 'bond' | 'seal' | 'tape' | 'ruggedred';
  children?: React.ReactNode;
}

/**
 * SOLID HEADER VERSION
 * Uses simple solid background images with baked-in logos/text.
 * No floating HTML elements.
 */
const ProductCategoryFamilyHero_Solid: React.FC<ProductCategoryFamilyHeroProps> = ({ category, children }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const bgRef = React.useRef<HTMLImageElement>(null);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    // Safety timeout
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 3000);

    if (bgRef.current?.complete) {
      setIsLoaded(true);
    }

    return () => {
      window.removeEventListener('resize', checkMobile);
      clearTimeout(timer);
    };
  }, [category]);

  const handleLoad = () => {
    setIsLoaded(true);
  };

  // Original solid header images from /images/product-heroes/
  const headerData = {
    bond: {
      desktopBackground: '/images/product-heroes/Forza Bond Hero Shot Header.webp',
      mobileBackground: '/images/product-heroes/Forza Bond Mobile Header.webp',
    },
    seal: {
      desktopBackground: '/images/product-heroes/Forza Seal Hero Shot.webp',
      mobileBackground: '/images/product-heroes/Forza Seal Mobile Header.webp',
    },
    tape: {
      desktopBackground: '/images/product-heroes/Forza Tape Hero Shot Header.webp',
      mobileBackground: '/images/product-heroes/Forza Tape Mobile Header.webp',
    },
    ruggedred: {
      desktopBackground: '/images/product-heroes/Forza Cleaners Hero Shot Header.webp',
      mobileBackground: '/images/product-heroes/RuggedRed Mobile Header.webp',
    }
  };

  const data = headerData[category];
  const currentSrc = isMobile ? data.mobileBackground : data.desktopBackground;

  return (
    <>
      <section className="sticky top-0 min-h-[55vh] lg:min-h-[80vh] h-[55vh] lg:h-[80vh] overflow-visible bg-[#1B3764] pb-4 md:pb-4 lg:pb-6 xl:pb-8 2xl:pb-8" style={{ zIndex: 1 }}>
        {!isLoaded && <ImageSkeleton className="w-full h-full" />}
        
        {/* Background Layer */}
        <div className="absolute inset-0 w-full h-full">
          <img
            key={`${category}-${isMobile}`}
            ref={bgRef}
            src={currentSrc}
            alt=""
            className="w-full h-full object-cover object-center"
            onLoad={handleLoad}
            onError={handleLoad}
            loading="eager"
            // @ts-ignore
            fetchpriority="high"
          />
        </div>

        {/* Fallback background */}
        <div className="absolute inset-0 bg-[#1B3764] -z-10" />
      </section>

      {/* Content that will slide over the sticky hero background */}
      <div className="relative pointer-events-auto" style={{ zIndex: 10 }}>
        {children}
      </div>
    </>
  );
};

export default ProductCategoryFamilyHero_Solid;

