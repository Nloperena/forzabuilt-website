import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ImageSkeleton from '../common/ImageSkeleton';

interface ProductCategoryFamilyHeroProps {
  category: 'bond' | 'seal' | 'tape' | 'ruggedred';
  children?: React.ReactNode;
}

/**
 * SANDBOX VERSION: Includes product elements (cartridges, bottles, etc.)
 * This version uses window events to listen for search terms and switches between
 * solid headers and the complex "Elements" headers when "unfinished" is searched.
 */
const ProductCategoryFamilyHero_Elements: React.FC<ProductCategoryFamilyHeroProps> = ({ category, children }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const bgRef = React.useRef<HTMLImageElement>(null);
  
  // Listen for search updates from other islands via window events
  useEffect(() => {
    const handleSearchUpdate = (e: any) => {
      if (e.detail !== undefined && typeof e.detail === 'string') {
        setSearchTerm(e.detail);
      }
    };
    window.addEventListener('forza-search-update', handleSearchUpdate);
    
    // Also check if there's an initial search in the URL
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const initialSearch = params.get('search') || '';
      if (initialSearch) setSearchTerm(initialSearch);
    }

    return () => window.removeEventListener('forza-search-update', handleSearchUpdate);
  }, []);
  
  // Check if searching for "unfinished" - if so, use current implementation, otherwise use old solid headers
  const isUnfinishedSearch = searchTerm.toLowerCase() === 'unfinished' || 
                              searchTerm.toLowerCase() === 'no image' || 
                              searchTerm.toLowerCase() === 'missing image' ||
                              searchTerm.toLowerCase() === 'no images';

  useEffect(() => {
    // Safety timeout - show content after 3 seconds even if images aren't reported as loaded
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 3000);

    // Check if background image is already complete (cached)
    if (bgRef.current?.complete) {
      setIsLoaded(true);
    }

    return () => clearTimeout(timer);
  }, [category, isUnfinishedSearch]); // Reset loader when category or search state changes

  const handleLoad = () => {
    setIsLoaded(true);
  };

  // Old solid header images (default)
  const oldSolidHeaders = {
    bond: {
      desktopBackground: '/images/product-heroes/Forza Bond Hero Shot Header.webp',
      mobileBackground: '/images/product-heroes/Forza Bond Mobile Header.webp',
      logo: '/images/product-family-shots/BOND/forza-bond-white.svg',
      subtext: 'Industrial Adhesives',
      elements: [] 
    },
    seal: {
      desktopBackground: '/images/product-heroes/Forza Seal Hero Shot.webp',
      mobileBackground: '/images/product-heroes/Forza Seal Mobile Header.webp',
      logo: '/images/product-family-shots/SEAL/forza-seal-white.svg',
      subtext: 'Industrial Sealants',
      elements: []
    },
    tape: {
      desktopBackground: '/images/product-heroes/Forza Tape Hero Shot Header.webp',
      mobileBackground: '/images/product-heroes/Forza Tape Mobile Header.webp',
      logo: '/images/product-family-shots/TAPE/forza-tape-white.svg',
      subtext: 'Industrial Tapes',
      elements: []
    },
    ruggedred: {
      desktopBackground: '/images/product-heroes/Forza Cleaners Hero Shot Header.webp',
      mobileBackground: '/images/product-heroes/RuggedRed Mobile Header.webp',
      logo: 'https://ruggedred.com/images/RRMascot+Type-smaller.png',
      subtext: 'Industrial Cleaners',
      elements: []
    }
  };

  // Current header implementation (with product elements) - used when searching "unfinished"
  const currentHeaders = {
    bond: {
      desktopBackground: '/images/product-family-shots/BOND/Forza Bond Hero Shot Header-background.webp',
      mobileBackground: '/images/product-family-shots/BOND/Mobile Bond Header.webp',
      logo: '/images/product-family-shots/BOND/forza-bond-white.svg',
      subtext: 'Industrial Adhesives',
      elements: [
        { src: '/images/product-family-shots/BOND/OA12 Cartridge.webp', alt: 'OA12 Cartridge', className: 'h-[30vh] sm:h-[55vh] md:h-[55vh] lg:h-[58vh] xl:h-[75vh] 2xl:h-[75vh] bottom-4 sm:bottom-4 md:bottom-4 lg:bottom-6 xl:bottom-8 2xl:bottom-8 left-[10%] sm:left-[10%] md:left-[10%] lg:left-[13%] xl:left-[16%] 2xl:left-[16%] z-20 max-w-[25%] sm:max-w-[25%] md:max-w-[25%] lg:max-w-[28%] xl:max-w-[30%]' },
        { src: '/images/product-family-shots/BOND/IC933 Aerosol Can.webp', alt: 'IC933 Aerosol Can', className: 'h-[22vh] sm:h-[48vh] md:h-[48vh] lg:h-[48vh] xl:h-[65vh] 2xl:h-[65vh] bottom-4 sm:bottom-4 md:bottom-4 lg:bottom-6 xl:bottom-8 2xl:bottom-8 left-[24%] sm:left-[24%] md:left-[24%] lg:left-[27%] xl:left-[30%] 2xl:left-[30%] z-10 max-w-[25%] sm:max-w-[25%] md:max-w-[25%] lg:max-w-[28%] xl:max-w-[30%]' }
      ]
    },
    seal: {
      desktopBackground: '/images/product-family-shots/SEAL/Seal Header.webp',
      mobileBackground: '/images/product-family-shots/SEAL/Mobile Seal Header.webp',
      logo: '/images/product-family-shots/SEAL/forza-seal-white.svg',
      subtext: 'Industrial Sealants',
      elements: [
        { src: '/images/product-family-shots/SEAL/OS2 Cartridge.webp', alt: 'OS2 Cartridge', className: 'h-[100%] md:h-[112%] lg:h-[120%] top-[-5%] md:top-[-10%] lg:top-[-15%] left-[2%] md:left-[5%] lg:left-[5%] z-0' }
      ]
    },
    tape: {
      desktopBackground: '/images/product-family-shots/TAPE/Tape Header.webp',
      mobileBackground: '/images/product-family-shots/TAPE/Mobile Tape Header.webp',
      logo: '/images/product-family-shots/TAPE/forza-tape-white.svg',
      subtext: 'Industrial Tapes',
      elements: [
        { src: '/images/product-family-shots/TAPE/Tape.webp', alt: 'Tape Roll', className: 'h-[100%] md:h-[90%] lg:h-[80%] xl:h-[100%] bottom-[-4%] md:bottom-[-4%] lg:bottom-[-4%] xl:bottom-[-4%] 2xl:bottom-[-4%] left-0 md:left-[8%] lg:left-0 xl:left-0 2xl:left-0 z-10' }
      ]
    },
    ruggedred: {
      desktopBackground: '/images/product-family-shots/RUGGEDRED/Cleaners Header.webp',
      mobileBackground: '/images/product-family-shots/RUGGEDRED/Mobile RuggedRed Header.webp',
      logo: 'https://ruggedred.com/images/RRMascot+Type-smaller.png',
      subtext: 'Industrial Cleaners',
      elements: [
        { src: '/images/product-family-shots/RUGGEDRED/RuggedRed Bottles.webp', alt: 'RuggedRed Bottles', className: 'h-[30vh] md:h-[35vh] lg:h-[45vh] xl:h-[78%] bottom-0 left-[10%] md:left-[12%] lg:left-[12%] xl:left-[14%] z-10' }
      ]
    }
  };

  const data = isUnfinishedSearch ? currentHeaders[category] : oldSolidHeaders[category];

  return (
    <>
      <section className="sticky top-0 min-h-[55vh] lg:min-h-[80vh] h-[55vh] lg:h-[80vh] overflow-visible bg-[#1B3764] pb-4 md:pb-4 lg:pb-6 xl:pb-8 2xl:pb-8" style={{ zIndex: 1 }}>
        {!isLoaded && <ImageSkeleton className="w-full h-full" />}
        
        {/* Background Layer */}
        <div className="absolute inset-0 w-full h-full">
          <picture className="w-full h-full">
            <source media="(max-width: 767px)" srcSet={data.mobileBackground} />
            <img
              ref={bgRef}
              src={data.desktopBackground}
              alt=""
              className={`w-full h-full object-cover ${!isUnfinishedSearch ? 'object-center' : (category === 'ruggedred' ? 'object-bottom lg:object-center' : category === 'bond' ? 'object-[50%_100%] md:object-[50%_100%] lg:object-[50%_100%] xl:object-[50%_80%] 2xl:object-[50%_35%]' : 'object-center')}`}
              onLoad={handleLoad}
              onError={handleLoad}
              loading="eager"
              // @ts-ignore
              fetchPriority="high"
            />
          </picture>
        </div>
        
        {/* Constructed Product Elements - Only show for unfinished search */}
        {isUnfinishedSearch && data.elements.length > 0 && (
          <div className={`hidden sm:block absolute inset-0 transition-opacity duration-500 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
            <div className="relative w-full h-full">
              {data.elements.map((el, i) => (
                <motion.img
                  key={i}
                  src={el.src}
                  alt={el.alt}
                  initial={category === 'seal' ? { opacity: 0, x: -200, y: -200 } : { opacity: 0, y: 100 }}
                  animate={isLoaded ? { opacity: 1, x: 0, y: 0 } : (category === 'seal' ? { opacity: 0, x: -200, y: -200 } : { opacity: 0, y: 100 })}
                  transition={{ duration: 1.2, delay: 0.2 + (i * 0.15), ease: [0.22, 1, 0.36, 1] }}
                  className={`absolute object-contain ${el.className}`}
                />
              ))}
            </div>
          </div>
        )}

        {/* Branding Content - Desktop & Tablet - Transparent when not searching unfinished */}
        <div className={`hidden sm:block absolute inset-0 container mx-auto px-4 transition-opacity duration-500 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
          <div className="relative w-full h-full">
            <motion.div 
              className={`absolute 
                ${category === 'ruggedred' 
                  ? 'top-[15vh] left-[50%] xl:left-[50%]' 
                  : category === 'seal'
                    ? 'bottom-[14vh] md:bottom-[10vh] lg:bottom-[14vh] xl:bottom-[20vh] 2xl:bottom-[20vh] left-[52%] md:left-[52%] lg:left-[50%] xl:left-[48%] 2xl:left-[48%]'
                    : category === 'tape'
                      ? 'bottom-[14vh] md:bottom-[10vh] lg:bottom-[14vh] xl:bottom-[20vh] 2xl:bottom-[20vh] left-[52%] md:left-[52%] lg:left-[50%] xl:left-[48%] 2xl:left-[48%]'
                      : 'bottom-[14vh] md:bottom-[10vh] lg:bottom-[14vh] xl:bottom-[20vh] 2xl:bottom-[20vh] left-[52%] md:left-[52%] lg:left-[50%] xl:left-[48%] 2xl:left-[48%]'} 
                flex flex-col z-30 items-start w-auto max-w-[45%] md:max-w-[45%] lg:max-w-[48%] xl:max-w-[50%] 2xl:max-w-[50%] flex-shrink -mt-4 md:-mt-4 lg:-mt-6 xl:-mt-6 2xl:-mt-6
                ${!isUnfinishedSearch ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
              initial={{ opacity: 0, x: 50 }}
              animate={isLoaded ? { opacity: isUnfinishedSearch ? 1 : 0, x: 0 } : { opacity: 0, x: 50 }}
              transition={{ duration: 1, delay: 0.4, ease: "easeOut" }}
            >
              <div className="flex flex-col items-start mb-2 w-auto">
                <div className="flex items-center gap-6 mb-2 w-auto">
                  <img
                    src={data.logo}
                    alt={`${category} logo`}
                    className={`
                      ${category === 'ruggedred' ? 'h-[25vh] lg:h-[35vh] xl:h-[45vh]' : category === 'seal' || category === 'tape' ? 'h-[16vh] md:h-[17vh] lg:h-[22vh] xl:h-[28vh] 2xl:h-[30vh]' : 'h-[16vh] md:h-[17vh] lg:h-[22vh] xl:h-[28vh] 2xl:h-[30vh]'} 
                      w-auto object-contain`}
                  />
                </div>
                <h1 className={`
                  text-white font-poppins font-normal text-left tracking-tight mt-[2vh] w-full whitespace-nowrap
                  text-[clamp(1.5rem,3vw,2.5rem)] md:text-[clamp(1.75rem,3.5vw,3rem)] lg:text-[clamp(2rem,4vw,3.5rem)] xl:text-[clamp(2.5rem,5vw,4.5rem)] 2xl:text-[clamp(2.75rem,5.5vw,5rem)]`}>
                  {data.subtext}
                </h1>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Mobile Content Layer - Transparent when not searching unfinished */}
        <div className={`sm:hidden absolute inset-0 transition-opacity duration-500 ${isLoaded ? 'opacity-100' : 'opacity-0'} z-20 ${!isUnfinishedSearch ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
          <div className="flex flex-col items-center justify-between h-full w-full pt-8 sm:pt-10 pb-4 sm:pb-8 px-4">
            <div className="flex flex-col items-center w-auto max-w-none mt-0 sm:mt-2 relative z-10">
              <img 
                src={data.logo} 
                alt={`${category} logo`} 
                className={`${category === 'ruggedred' ? 'h-36 sm:h-48 mb-4 sm:mb-6' : 'h-20 sm:h-28 mb-2 sm:mb-4'} w-auto object-contain`}
              />
              <h1 className="text-white font-poppins font-normal text-center tracking-tight leading-tight w-full whitespace-nowrap text-[clamp(1.5rem,3vw,2rem)] sm:text-[clamp(1.5rem,3.5vw,2.25rem)] md:text-[clamp(1.75rem,4vw,2.5rem)] lg:text-[clamp(2rem,4.5vw,2.75rem)]">
                {data.subtext}
              </h1>
            </div>

            {/* Bottom Row: Products (Construction for Bond) - Only show for unfinished search */}
            {isUnfinishedSearch && (
              <div className={`w-full flex ${category === 'tape' ? 'items-center' : 'items-end'} justify-center ${category === 'bond' ? 'gap-0.5 sm:gap-0.75' : 'gap-4'} px-2 ${category === 'seal' ? 'hidden' : ''}`}>
                {category === 'bond' && data.elements.length >= 2 ? (
                  <>
                    <motion.img src={data.elements[0].src} alt={data.elements[0].alt} initial={{ opacity: 0, y: 50 }} animate={isLoaded ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }} transition={{ duration: 0.8, delay: 0.2 }} className="h-[40vh] sm:h-[50vh] w-auto object-contain z-20 relative" />
                    <motion.img src={data.elements[1].src} alt={data.elements[1].alt} initial={{ opacity: 0, y: 50 }} animate={isLoaded ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }} transition={{ duration: 0.8, delay: 0.3 }} className="h-[38vh] sm:h-[48vh] w-auto object-contain z-10 relative" />
                  </>
                ) : data.elements[0] ? (
                  <motion.img src={data.elements[0].src} alt={data.elements[0].alt} initial={{ opacity: 0, y: 50 }} animate={isLoaded ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }} transition={{ duration: 0.8, delay: 0.2 }} className={`${category === 'tape' ? 'h-[37vh] sm:h-[60vh] md:h-[60vh] -mt-6 sm:-mt-20' : category === 'ruggedred' ? 'h-[18vh] sm:h-[22vh] md:h-[28vh]' : 'h-[25vh] sm:h-[30vh] md:h-[35vh]'} w-auto object-contain`} />
                ) : null}
              </div>
            )}
          </div>
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

export default ProductCategoryFamilyHero_Elements;

