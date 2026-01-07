import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import OptimizedImage from './common/OptimizedImage';

const MotionOptimizedImage = motion.create(OptimizedImage);

const categories = [
  {
    id: 'adhesives',
    title: 'Adhesives',
    description: 'High-performance adhesive solutions for structural integrity and long-lasting durability.',
    link: '/products/bond',
    image: '/images/homepage-heroes/Forza Bond Hero Shot.webp',
    buttonText: 'Browse Adhesives'
  },
  {
    id: 'sealants',
    title: 'Sealants',
    description: 'Dependable sealing solutions designed to protect, perform, and endure in even the toughest manufacturing environments.',
    link: '/products/seal',
    image: '/images/homepage-heroes/Forza Seal Hero Shot.webp',
    buttonText: 'Browse Sealants'
  },
  {
    id: 'tapes',
    title: 'Tapes',
    description: 'Versatile tape solutions for secure bonding and sealing in demanding applications.',
    link: '/products/tape',
    image: '/images/homepage-heroes/Forza Tape Hero Shot.webp',
    buttonText: 'Browse Tapes'
  },
  {
    id: 'cleaners',
    title: 'Cleaners',
    description: 'Industrial-grade cleaning solutions for preparing surfaces and maintaining equipment.',
    link: '/products/ruggedred',
    image: '/images/homepage-heroes/Forza-Cleaners-Hero-Shot1.webp',
    buttonText: 'Browse Cleaners'
  }
];

const ProductCategoriesSection = ({ categories: categoriesProp }: { categories?: typeof categories }) => {
  const displayCategories = categoriesProp || categories;
  const [activeCategory, setActiveCategory] = useState(displayCategories[1]); // Default to Sealants
  const [imagesLoaded, setImagesLoaded] = useState<{ [key: string]: boolean }>({});

  // Preload all category images
  useEffect(() => {
    displayCategories.forEach((cat) => {
      const img = new Image();
      img.onload = () => {
        setImagesLoaded(prev => ({ ...prev, [cat.id]: true }));
      };
      img.onerror = () => {
        setImagesLoaded(prev => ({ ...prev, [cat.id]: true }));
      };
      img.src = cat.image;
      
      // If image is already in cache
      if (img.complete) {
        setImagesLoaded(prev => ({ ...prev, [cat.id]: true }));
      }
    });
  }, [displayCategories]);

  return (
    <section className="relative isolate overflow-visible">
      <div className="absolute top-0 left-0 h-0.5 bg-gradient-to-r from-[#F2611D] to-orange-400 transition-all duration-100 z-50" style={{ width: '0%' }}></div>
      <div className="pointer-events-none absolute inset-0 md:grid md:grid-cols-2">
        <div className="bg-[#f3f5f7]"></div>
        <div className="bg-gradient-to-r from-[#477197] to-[#2c476e]"></div>
      </div>
      <div className="relative overflow-visible">
        <div className="flex flex-col md:grid md:grid-cols-2 gap-0 overflow-hidden">
          {/* Content Side */}
          <div className="relative bg-gradient-to-r from-[#477197] to-[#2c476e] px-3 py-3 md:px-5 md:py-5 flex flex-col justify-between order-1 md:order-2 md:aspect-[5/4]">
            <div className="flex flex-col justify-center flex-1" style={{ gap: 'clamp(10px, 1.8vw, 18px)', paddingTop: 'clamp(12px, 2.5vw, 24px)' }}>
              {displayCategories.map((cat) => (
                <button 
                  key={cat.id}
                  onClick={() => setActiveCategory(cat)}
                  className="w-full text-left transition-all duration-500 cursor-pointer outline-none"
                >
                  <h3 
                    className={`leading-[1.1] tracking-[-0.01em] transition-all duration-500 ease-out font-poppins ${
                      activeCategory.id === cat.id 
                        ? 'text-[#F2611D] font-bold' 
                        : 'text-white font-normal hover:text-[#F2611D]'
                    }`} 
                    style={{ fontSize: activeCategory.id === cat.id ? 'clamp(20px, 3.8vw, 60px)' : 'clamp(15px, 2.2vw, 34px)' }}
                  >
                    {cat.title}
                  </h3>
                </button>
              ))}
            </div>

            <div className="mt-auto" style={{ paddingBottom: 'clamp(16px, 3vw, 32px)', display: 'flex', flexDirection: 'column' }}>
              <AnimatePresence mode="wait">
                <motion.div 
                  key={activeCategory.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(12px, 2vw, 20px)', alignItems: 'flex-start' }}
                >
                  <p className="text-white font-poppins" style={{ fontSize: 'clamp(12px, 1.5vw, 18px)', lineHeight: 1.5 }}>
                    {activeCategory.description}
                  </p>
                  <a 
                    className="whitespace-nowrap ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 inline-flex items-center justify-center rounded-full bg-[#F2611D] text-white font-medium hover:bg-[#F2611D]/90 shadow-lg" 
                    href={activeCategory.link} 
                    style={{ height: 'clamp(32px, 3vw, 44px)', paddingLeft: 'clamp(16px, 2.2vw, 24px)', paddingRight: 'clamp(16px, 2.2vw, 24px)', fontSize: 'clamp(12px, 1.4vw, 16px)' }}
                  >
                    {activeCategory.buttonText}
                  </a>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* Image Side */}
          <div className="relative w-full aspect-square md:aspect-[5/4] flex items-center justify-center overflow-hidden bg-[#f3f5f7] order-2 md:order-1">
            {/* Skeleton while image loads */}
            {!imagesLoaded[activeCategory.id] && (
              <div className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300 animate-pulse z-5" />
            )}
            <div className="absolute inset-0 w-full h-full z-10">
              <AnimatePresence mode="wait">
                <MotionOptimizedImage 
                  key={activeCategory.id}
                  src={activeCategory.image} 
                  alt={activeCategory.title.toUpperCase()} 
                  width={828}
                  height={663}
                  mobileWidth={640}
                  sizes="(max-width: 768px) 100vw, 50vw"
                  initial={{ opacity: 0, scale: 1.1 }}
                  animate={{ opacity: imagesLoaded[activeCategory.id] ? 1 : 0, scale: 1.05 }}
                  exit={{ opacity: 0, scale: 1.1 }}
                  transition={{ duration: 0.5 }}
                  className="absolute inset-0 w-full h-full object-cover" 
                  style={{ objectPosition: 'center 70%' }}
                  onLoad={() => {
                    console.log(`✅ Image loaded: ${activeCategory.image}`);
                    setImagesLoaded(prev => ({ ...prev, [activeCategory.id]: true }));
                  }}
                  onError={() => {
                    console.error(`❌ Image failed to load: ${activeCategory.image}`);
                    setImagesLoaded(prev => ({ ...prev, [activeCategory.id]: true }));
                  }}
                />
              </AnimatePresence>
            </div>
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,0,0,0.04)_0%,transparent_70%)] z-20"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductCategoriesSection;

