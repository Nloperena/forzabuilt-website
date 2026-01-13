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
      background: '/images/product-family-shots/BOND/Forza Bond Hero Shot Header-background.webp',
      logo: '/images/product-family-shots/BOND/forza-bond-white.svg',
      subtext: 'Industrial Adhesives',
      mobile: '/images/product-family-shots/BOND/Mobile Bond Header.webp',
      elements: [
        { src: '/images/product-family-shots/BOND/OA12 Cartridge.webp', alt: 'OA12 Cartridge', className: 'h-[30vh] lg:h-[60vh] xl:h-[75vh] bottom-0 left-[10%] lg:left-[12%] xl:left-[15%] z-20' },
        { src: '/images/product-family-shots/BOND/IC933 Aerosol Can.webp', alt: 'IC933 Aerosol Can', className: 'h-[22vh] lg:h-[50vh] xl:h-[65vh] bottom-0 left-[22%] lg:left-[26%] xl:left-[30%] z-10' }
      ]
    },
    seal: {
      background: '/images/product-family-shots/SEAL/Seal Header.webp',
      logo: '/images/product-family-shots/SEAL/forza-seal-white.svg',
      subtext: 'Industrial Sealants',
      mobile: '/images/product-family-shots/SEAL/Mobile Seal Header.webp',
      elements: [
        { src: '/images/product-family-shots/SEAL/OS2 Cartridge.webp', alt: 'OS2 Cartridge', className: 'h-[128%] top-[-25%] left-72 z-0' }
      ]
    },
    tape: {
      background: '/images/product-family-shots/TAPE/Tape Header.webp',
      logo: '/images/product-family-shots/TAPE/forza-tape-white.svg',
      subtext: 'Industrial Tapes',
      mobile: '/images/product-family-shots/TAPE/Mobile Tape Header.webp',
      elements: [
        { src: '/images/product-family-shots/TAPE/Tape.webp', alt: 'Tape Roll', className: 'h-[120%] lg:h-[80%] xl:h-[100%] bottom-[-10%] left-0 lg:left-[5%] xl:left-[00%] z-10' }
      ]
    },
    ruggedred: {
      background: '/images/product-family-shots/RUGGEDRED/Cleaners Header.webp',
      logo: 'https://ruggedred.com/images/RRMascot+Type-smaller.png',
      subtext: 'Industrial Cleaners',
      mobile: '/images/product-family-shots/RUGGEDRED/Mobile RuggedRed Header.webp',
      elements: [
        { src: '/images/product-family-shots/RUGGEDRED/RuggedRed Bottles.webp', alt: 'RuggedRed Bottles', className: 'h-[30vh] lg:h-[45vh] xl:h-[78%] bottom-0 left-[10%] lg:left-[12%] xl:left-[14%] z-10' }
      ]
    }
  };

  const data = familyData[category];

  return (
    <>
      <section className="sticky top-0 h-[55vh] lg:h-[80vh] overflow-hidden bg-[#1B3764] lg:pt-12 2xl:pt-0" style={{ zIndex: 1 }}>
        {!isLoaded && <ImageSkeleton className="w-full h-full" />}
        
        {/* Responsive Background Layer */}
        <div className="absolute inset-0 w-full h-full">
          <picture className="w-full h-full">
            <source media="(max-width: 1023px)" srcSet={data.mobile} />
            <img
              ref={bgRef}
              src={data.background}
              alt=""
              className={`w-full h-full object-cover ${category === 'ruggedred' ? 'object-bottom lg:object-center' : ''}`}
              onLoad={handleLoad}
              onError={handleLoad}
              loading="eager"
              // @ts-ignore
              fetchPriority="high"
            />
          </picture>
        </div>
        
        {/* Constructed Product Elements Layer - Desktop Only */}
        <div className={`hidden lg:block absolute inset-0 transition-opacity duration-500 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
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

        {/* Branding Content Layer - Desktop Only */}
        <div className={`hidden lg:block absolute inset-0 container mx-auto px-4 transition-opacity duration-500 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
          <div className="relative w-full h-full">
            {/* Logo & Text Container - Desktop positioning */}
            <motion.div 
              className={`absolute 
                ${category === 'ruggedred' 
                  ? 'top-[15vh] left-[55%] xl:left-[50%]' 
                  : 'top-[20vh] left-[60%] lg:left-[52%] xl:left-[48%]'} 
                flex flex-col z-30 items-start w-auto mt-2`}
              initial={{ opacity: 0, x: 50 }}
              animate={isLoaded ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
              transition={{ duration: 1, delay: 0.4, ease: "easeOut" }}
            >
              <div className="flex flex-col items-start mb-2">
                <img
                  src={data.logo}
                  alt={`${category} logo`}
                  className={`
                    ${category === 'ruggedred' ? 'h-[25vh] lg:h-[35vh] xl:h-[45vh]' : 'h-[10vh] lg:h-[15vh] xl:h-[22vh]'} 
                    w-auto object-contain`}
                />
                <h1 className={`
                  text-white font-poppins font-normal text-left tracking-tight mt-[2vh]
                  text-[3.5vh] lg:text-[4.5vh] xl:text-[6.5vh]`}>
                  {data.subtext}
                </h1>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Mobile & Tablet Layout (< 1024px) - Constructed Elements */}
        <div className={`lg:hidden absolute inset-0 transition-opacity duration-500 ${isLoaded ? 'opacity-100' : 'opacity-0'} z-20`}>
          {/* Seal specific absolute product image for mobile/tablet - Anchored top left */}
          {category === 'seal' && (
            <motion.img
              src={data.elements[0].src}
              alt={data.elements[0].alt}
              initial={{ opacity: 0, x: -100, y: -100 }}
              animate={isLoaded ? { opacity: 1, x: 0, y: 0 } : { opacity: 0, x: -100, y: -100 }}
              transition={{ duration: 1.2, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="absolute top-[30%] md:top-[35%] left-[-15%] md:left-[-10%] h-[30vh] md:h-[38vh] translate-x-[-15%] w-auto object-contain z-0 pointer-events-none"
            />
          )}

          <div className="flex flex-col items-center justify-between h-full w-full pt-16 sm:pt-20 pb-4 sm:pb-8 px-4">
            {/* Top Column: Logo and Text */}
            <div className="flex flex-col items-center w-full max-w-[400px] mt-4 sm:mt-6 relative z-10">
            <img 
              src={data.logo} 
              alt={`${category} logo`} 
              className={`${category === 'ruggedred' ? 'h-36 sm:h-48 mb-4 sm:mb-6' : 'h-20 sm:h-28 mb-2 sm:mb-4'} w-auto object-contain`}
            />
              <h1 className="text-white font-poppins font-normal text-center text-xl sm:text-3xl lg:text-4xl tracking-tight leading-tight">
                {data.subtext}
              </h1>
            </div>

            {/* Bottom Row: Products (Construction for Bond) */}
            <div className={`w-full flex items-end justify-center ${category === 'bond' ? '-space-x-6 sm:-space-x-8' : 'gap-4'} px-2 ${category === 'seal' ? 'hidden' : ''}`}>
              {category === 'bond' ? (
                // Bond specific: Two products side-by-side at the bottom
                <>
                  <motion.img
                    src={data.elements[0].src}
                    alt={data.elements[0].alt}
                    initial={{ opacity: 0, y: 50 }}
                    animate={isLoaded ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="h-[25vh] sm:h-[30vh] md:h-[35vh] w-auto object-contain z-20 relative"
                  />
                  <motion.img
                    src={data.elements[1].src}
                    alt={data.elements[1].alt}
                    initial={{ opacity: 0, y: 50 }}
                    animate={isLoaded ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                    className="h-[26vh] sm:h-[31vh] md:h-[36vh] w-auto object-contain z-10 relative"
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
                  className={`${category === 'tape' ? 'h-[20vh] sm:h-[25vh] md:h-[30vh]' : category === 'ruggedred' ? 'h-[18vh] sm:h-[22vh] md:h-[28vh]' : 'h-[25vh] sm:h-[30vh] md:h-[35vh]'} w-auto object-contain`}
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
