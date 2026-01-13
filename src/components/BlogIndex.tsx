import React, { useState, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import ImageSkeleton from './common/ImageSkeleton';
import { generateSlugFromTitle } from '@/lib/utils';

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  image: string;
  category: string;
  date: string;
}

interface BlogIndexProps {
  blogPosts: BlogPost[];
}

// White dot skeleton for blue overlay background
const BlogCardSkeleton: React.FC = () => (
  <div className="w-full h-full flex items-center justify-center bg-[#1B3764]">
    <div className="flex space-x-2">
      <div className="w-2.5 h-2.5 bg-white rounded-full skeleton-dot"></div>
      <div className="w-2.5 h-2.5 bg-white rounded-full skeleton-dot"></div>
      <div className="w-2.5 h-2.5 bg-white rounded-full skeleton-dot"></div>
    </div>
  </div>
);

const BlogOverlayCard = ({ post }: { post: BlogPost }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const imgRef = React.useRef<HTMLImageElement>(null);
  
  // Check if image is already cached/loaded
  useEffect(() => {
    if (imgRef.current?.complete && imgRef.current?.naturalHeight > 0) {
      setImageLoaded(true);
    }
  }, []);
  
  return (
    <a 
      href={`/blog/${generateSlugFromTitle(post.title)}`}
      className="group relative w-full aspect-[3/4] md:aspect-[3/4] lg:aspect-[3/4] rounded-lg md:rounded-2xl overflow-hidden cursor-pointer shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 block"
    >
      {/* Skeleton Loading State - shows behind until image loads */}
      <div className={`absolute inset-0 z-0 transition-opacity duration-300 ${imageLoaded ? 'opacity-0' : 'opacity-100'}`}>
        <BlogCardSkeleton />
      </div>
      
      {/* Background Image - visible and can load, fades in */}
      <div className="absolute inset-0 z-10">
        <img 
          ref={imgRef}
          src={post.image} 
          alt={post.title}
          className={`w-full h-full object-cover transition-all duration-500 ${imageLoaded ? 'opacity-100' : 'opacity-0'} group-hover:scale-105`}
          onLoad={() => setImageLoaded(true)}
          onError={(e) => {
            e.currentTarget.src = '/products/IC933-bundle-1024x1024.webp';
            setImageLoaded(true);
          }}
        />
      </div>

      {/* Blue Gradient Overlay - always visible when image loads */}
      <div 
        className={`absolute inset-0 z-20 pointer-events-none transition-opacity duration-300 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
        style={{
          background: 'linear-gradient(to top, rgba(27, 55, 100, 0.85) 0%, rgba(27, 55, 100, 0.7) 15%, rgba(27, 55, 100, 0.5) 30%, rgba(27, 55, 100, 0.3) 45%, rgba(27, 55, 100, 0.15) 60%, transparent 70%)'
        }}
      />

      {/* Content Overlay */}
      <div className={`absolute inset-0 z-30 p-3 md:p-6 flex flex-col justify-end text-white transition-opacity duration-300 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}>
        <h3 className="text-xs md:text-lg lg:text-xl font-bold font-poppins mb-1 md:mb-2 leading-tight group-hover:text-[#F2611D] transition-colors line-clamp-2">
          {post.title}
        </h3>
        
        {/* Description and Arrow on same line */}
        <div className="flex items-center justify-between gap-2 md:gap-3 mt-1 md:mt-2">
          <p className="text-[9px] md:text-xs lg:text-sm text-white/80 font-poppins line-clamp-2 flex-1">
            {post.excerpt}
          </p>
          <svg 
            className="w-4 h-4 md:w-5 md:h-5 lg:w-6 lg:h-6 text-[#F2611D] transform group-hover:translate-x-1 transition-transform duration-300 flex-shrink-0" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth={2.5}
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </a>
  );
};

const BlogIndex: React.FC<BlogIndexProps> = ({ blogPosts }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [visiblePosts, setVisiblePosts] = useState<number>(9);
  const [headerImageLoaded, setHeaderImageLoaded] = useState(false);
  const [headerImageSrc, setHeaderImageSrc] = useState<string>('/images/Blog Header Image.webp');

  // Preload the header image
  useEffect(() => {
    const img = new Image();
    const originalSrc = '/images/Blog Header Image.webp';
    const encodedSrc = '/images/Blog%20Header%20Image.jpg';
    
    img.onload = () => {
      setHeaderImageSrc(originalSrc);
      setHeaderImageLoaded(true);
    };
    img.onerror = () => {
      // Try URL-encoded version if the first fails
      const img2 = new Image();
      img2.onload = () => {
        setHeaderImageSrc(encodedSrc);
        setHeaderImageLoaded(true);
      };
      img2.onerror = () => {
        console.error('Failed to load blog header image from both paths');
        setHeaderImageLoaded(true); // Hide skeleton even if image fails
      };
      img2.src = encodedSrc;
    };
    img.src = originalSrc;
  }, []);

  const categories = [
    'all',
    'Adhesives',
    'Manufacturing',
    'Innovation',
    'Marine',
    'Composites',
    'Building',
    'HSE',
    'Bond',
    'Tools',
    'Cleaning'
  ];

  const filteredPosts = useMemo(() => {
    let filtered = selectedCategory === 'all' 
      ? blogPosts 
      : blogPosts.filter(post => post.category.toLowerCase().includes(selectedCategory.toLowerCase()));

    return filtered;
  }, [blogPosts, selectedCategory]);

  const featuredPosts = blogPosts.slice(0, 3);
  const displayedPosts = filteredPosts.slice(0, visiblePosts);

  const handleLoadMore = () => {
    setVisiblePosts(prev => prev + 9);
  };

  return (
    <div className="bg-white min-h-screen flex flex-col relative overflow-x-hidden text-[#1B3764]">
      {/* Hero Section - Header Image */}
      <section className="relative h-[55vh] md:h-[80vh] overflow-hidden bg-gradient-to-b from-[#2c476e] to-[#81899f] md:pt-12 2xl:pt-0 z-20">
        {!headerImageLoaded && (
          <ImageSkeleton className="w-full h-full" />
        )}
        
        <img
          src={headerImageSrc}
          alt="Blog Header"
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${
            headerImageLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          onLoad={() => {
            setHeaderImageLoaded(true);
          }}
          onError={(e) => {
            console.error('Failed to load blog header image from:', e.currentTarget.src);
            setHeaderImageLoaded(true); // Hide skeleton even if image fails
          }}
          loading="eager"
          // @ts-ignore
          fetchpriority="high"
          decoding="async"
          style={{ 
            zIndex: 1,
            objectFit: 'cover',
            width: '100%',
            height: '100%'
          }}
        />

        <div className="absolute inset-0 bg-gradient-to-b from-[#2c476e]/60 to-[#81899f]/60" style={{ zIndex: 2 }} />

        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 pointer-events-none" style={{ zIndex: 20 }}>
          <h3
            className="font-regular text-center leading-tight font-poppins text-white"
            style={{ 
              fontSize: 'clamp(1.5rem, 0.5rem + 3vw, 4.5rem)',
              maxWidth: '1100px',
              opacity: 1,
              transform: 'none'
            }}
          >
            Products, Tips, Tutorials<br/>and More
          </h3>
        </div>
      </section>

      {/* Most Popular Section */}
      {featuredPosts.length > 0 && (
        <section className="pt-4 pb-12 md:pb-20 relative z-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
            <h2 className="font-normal font-poppins leading-tight text-[#1b3764] text-center mb-8 md:mb-16 break-words normal-case text-[22px] md:text-[44px]">
              Most Popular
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-8">
              {featuredPosts.slice(0, 2).map((post) => (
                <BlogOverlayCard key={post.id} post={post} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Products, Tips, Tutorials Section */}
      <section className="pt-4 pb-12 md:pb-20 bg-white relative z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          <div className="mb-8 md:mb-12 text-center">
            <h2 className="font-normal font-poppins leading-tight text-[#1b3764] mb-6 md:mb-10 text-center break-words normal-case text-[22px] md:text-[44px]">
              Products, Tips, Tutorials<br/>and More
            </h2>

            {/* Filter Buttons - Visible Tags */}
            <div className="flex items-center justify-center gap-2 md:gap-3 flex-wrap mb-6 md:mb-8">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-full text-sm md:text-base font-poppins font-medium transition-all duration-200 ${
                    selectedCategory === category
                      ? 'bg-[#1B3764] text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {category === 'all' ? 'All Posts' : category}
                </button>
              ))}
            </div>
          </div>

          {/* Blog Grid - 2 columns on mobile */}
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8 mb-8 md:mb-16">
            {displayedPosts.map((post) => (
              <BlogOverlayCard key={post.id} post={post} />
            ))}
          </div>

          {/* More Button */}
          {displayedPosts.length < filteredPosts.length && (
            <div className="flex justify-center">
              <button
                onClick={handleLoadMore}
                className="px-8 md:px-12 py-2 md:py-3 bg-white border border-gray-300 text-gray-500 rounded-full text-sm md:text-base font-medium font-poppins hover:bg-gray-50 transition-colors duration-200"
              >
                More
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default BlogIndex;

