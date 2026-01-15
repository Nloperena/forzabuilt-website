import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ImageSkeleton from '../common/ImageSkeleton';
import OptimizedImage from '../common/OptimizedImage';

interface ProductCategoryFamilyHeroProps {
  category: 'bond' | 'seal' | 'tape' | 'ruggedred';
  children?: React.ReactNode;
}

const ProductCategoryFamilyHero: React.FC<ProductCategoryFamilyHeroProps> = ({ category, children }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const bgRef = React.useRef<HTMLImageElement>(null);

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
  }, []);

  const handleLoad = () => {
    setIsLoaded(true);
  };

  const familyData = {
    bond: {
      desktopBackground: '/images/product-family-shots/BOND/Forza Bond Hero Shot Header-background.webp',
      mobileBackground: '/images/product-family-shots/BOND/Mobile Bond Header.webp',
      logo: '/images/product-family-shots/BOND/forza-bond-white.svg',
      subtext: 'Industrial Adhesives',
      elements: [
        { src: '/images/product-family-shots/BOND/OA12 Cartridge.webp', alt: 'OA12 Cartridge', className: 'h-[30vh] md:h-[45vh] lg:h-[58vh] xl:h-[75vh] 2xl:h-[75vh] bottom-4 md:bottom-4 lg:bottom-6 xl:bottom-8 2xl:bottom-8 left-[10%] md:left-[10%] lg:left-[13%] xl:left-[16%] 2xl:left-[16%] z-20 max-w-[25%] md:max-w-[25%] lg:max-w-[28%] xl:max-w-[30%]' },
        { src: '/images/product-family-shots/BOND/IC933 Aerosol Can.webp', alt: 'IC933 Aerosol Can', className: 'h-[22vh] md:h-[38vh] lg:h-[48vh] xl:h-[65vh] 2xl:h-[65vh] bottom-4 md:bottom-4 lg:bottom-6 xl:bottom-8 2xl:bottom-8 left-[24%] md:left-[24%] lg:left-[27%] xl:left-[30%] 2xl:left-[30%] z-10 max-w-[25%] md:max-w-[25%] lg:max-w-[28%] xl:max-w-[30%]' }
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

  const data = familyData[category];

  return (
    <>
      <section className="sticky top-0 min-h-[55vh] lg:min-h-[80vh] h-[55vh] lg:h-[80vh] overflow-visible bg-[#1B3764] pb-4 md:pb-4 lg:pb-6 xl:pb-8 2xl:pb-8" style={{ zIndex: 1 }}>
        {!isLoaded && <ImageSkeleton className="w-full h-full" />}
        
        {/* Responsive Background Layer */}
        <div className="absolute inset-0 w-full h-full">
          <picture className="w-full h-full">
            <source media="(max-width: 1023px)" srcSet={data.mobileBackground} />
            <img
              ref={bgRef}
              src={data.desktopBackground}
              alt=""
              className={`w-full h-full object-cover ${category === 'ruggedred' ? 'object-bottom lg:object-center' : category === 'bond' ? 'object-[50%_100%] md:object-[50%_100%] lg:object-[50%_100%] xl:object-[50%_80%] 2xl:object-[50%_35%]' : ''}`}
              onLoad={handleLoad}
              onError={handleLoad}
              loading="eager"
              // @ts-ignore
              fetchPriority="high"
            />
          </picture>
        </div>
        
        {/* Constructed Product Elements Layer - Desktop & Tablet */}
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

        {/* Branding Content Layer - Desktop & Tablet */}
        <div className={`hidden sm:block absolute inset-0 container mx-auto px-4 transition-opacity duration-500 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
          <div className="relative w-full h-full">
            {/* Logo & Text Container - Responsive positioning */}
            <motion.div 
              className={`absolute 
                ${category === 'ruggedred' 
                  ? 'top-[15vh] left-[50%] xl:left-[50%]' 
                  : category === 'seal'
                    ? 'bottom-[14vh] md:bottom-[10vh] lg:bottom-[14vh] xl:bottom-[20vh] 2xl:bottom-[20vh] left-[52%] md:left-[52%] lg:left-[50%] xl:left-[48%] 2xl:left-[48%]'
                    : category === 'tape'
                      ? 'bottom-[14vh] md:bottom-[10vh] lg:bottom-[14vh] xl:bottom-[20vh] 2xl:bottom-[20vh] left-[52%] md:left-[52%] lg:left-[50%] xl:left-[48%] 2xl:left-[48%]'
                      : 'bottom-[14vh] md:bottom-[10vh] lg:bottom-[14vh] xl:bottom-[20vh] 2xl:bottom-[20vh] left-[52%] md:left-[52%] lg:left-[50%] xl:left-[48%] 2xl:left-[48%]'} 
                flex flex-col z-30 items-start w-auto max-w-[45%] md:max-w-[45%] lg:max-w-[48%] xl:max-w-[50%] 2xl:max-w-[50%] flex-shrink -mt-4 md:-mt-4 lg:-mt-6 xl:-mt-6 2xl:-mt-6`}
              initial={{ opacity: 0, x: 50 }}
              animate={isLoaded ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
              transition={{ duration: 1, delay: 0.4, ease: "easeOut" }}
            >
              <div className="flex flex-col items-start mb-2">
                <div className="flex items-center gap-6 mb-2">
                  <img
                    src={data.logo}
                    alt={`${category} logo`}
                    className={`
                      ${category === 'ruggedred' ? 'h-[25vh] lg:h-[35vh] xl:h-[45vh]' : category === 'seal' || category === 'tape' ? 'h-[16vh] md:h-[17vh] lg:h-[22vh] xl:h-[28vh] 2xl:h-[30vh]' : 'h-[16vh] md:h-[17vh] lg:h-[22vh] xl:h-[28vh] 2xl:h-[30vh]'} 
                      w-auto object-contain`}
                  />
                </div>
                <h1 className={`
                  text-white font-poppins font-normal text-left tracking-tight mt-[2vh]
                  text-[4.5vh] md:text-[5vh] lg:text-[5.5vh] xl:text-[7vh] 2xl:text-[7.5vh] whitespace-normal md:whitespace-normal lg:whitespace-nowrap xl:whitespace-nowrap`}>
                  {data.subtext}
                </h1>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Mobile Layout (< 640px) - Constructed Elements */}
        <div className={`sm:hidden absolute inset-0 flex flex-col items-center justify-between pt-8 sm:pt-10 pb-4 sm:pb-8 px-4 transition-opacity duration-500 ${isLoaded ? 'opacity-100' : 'opacity-0'} z-20`}>
          {/* Seal specific absolute product image for mobile/tablet - Anchored top left */}
          {category === 'seal' && (
            <motion.img
              src={data.elements[0].src}
              alt={data.elements[0].alt}
              initial={{ opacity: 0, x: -100, y: -100 }}
              animate={isLoaded ? { opacity: 1, x: 0, y: 0 } : { opacity: 0, x: -100, y: -100 }}
              transition={{ duration: 1.2, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="absolute top-[25%] md:top-[30%] left-[-10%] md:left-[-5%] h-[45vh] md:h-[55vh] translate-x-[-15%] w-auto object-contain z-0 pointer-events-none"
            />
          )}

          <div className="flex flex-col items-center justify-between h-full w-full pt-8 sm:pt-10 pb-4 sm:pb-8 px-4">
            {/* Top Column: Logo and Text */}
            <div className="flex flex-col items-center w-full max-w-none mt-0 sm:mt-2 relative z-10">
            <img 
              src={data.logo} 
              alt={`${category} logo`} 
              className={`${category === 'ruggedred' ? 'h-36 sm:h-48 mb-4 sm:mb-6' : 'h-20 sm:h-28 mb-2 sm:mb-4'} w-auto object-contain`}
            />
              <h1 className="text-white font-poppins font-normal text-center text-2xl sm:text-3xl lg:text-4xl tracking-tight leading-tight whitespace-nowrap">
                {data.subtext}
              </h1>
            </div>

            {/* Bottom Row: Products (Construction for Bond) */}
            <div className={`w-full flex ${category === 'tape' ? 'items-center' : 'items-end'} justify-center ${category === 'bond' ? 'gap-0.5 sm:gap-0.75' : 'gap-4'} px-2 ${category === 'seal' ? 'hidden' : ''}`}>
              {category === 'bond' ? (
                // Bond specific: Two products side-by-side at the bottom
                <>
                  <motion.img
                    src={data.elements[0].src}
                    alt={data.elements[0].alt}
                    initial={{ opacity: 0, y: 50 }}
                    animate={isLoaded ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="h-[40vh] sm:h-[50vh] w-auto object-contain z-20 relative"
                  />
                  <motion.img
                    src={data.elements[1].src}
                    alt={data.elements[1].alt}
                    initial={{ opacity: 0, y: 50 }}
                    animate={isLoaded ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                    className="h-[38vh] sm:h-[48vh] w-auto object-contain z-10 relative"
                  />
                </>
              ) : (
                // Others: Just the primary product element
                <motion.img
                  src={data.elements[0].src}
                  alt={data.elements[0].alt}
                  initial={{ opacity: 0, y: 50 }}
                  animate={isLoaded ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className={`${category === 'tape' ? 'h-[37vh] sm:h-[60vh] md:h-[60vh] -mt-6 sm:-mt-20' : category === 'ruggedred' ? 'h-[18vh] sm:h-[22vh] md:h-[28vh]' : 'h-[25vh] sm:h-[30vh] md:h-[35vh]'} w-auto object-contain`}
                />
              )}
            </div>
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

export default ProductCategoryFamilyHero;
