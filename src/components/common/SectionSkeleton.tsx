import React from 'react';

interface SectionSkeletonProps {
  height?: string;
  className?: string;
  variant?: 'cards' | 'content' | 'video' | 'newsletter';
}

const SectionSkeleton: React.FC<SectionSkeletonProps> = ({ 
  height = '400px', 
  className = '',
  variant = 'content'
}) => {
  if (variant === 'cards') {
    return (
      <div className={`w-full bg-white animate-pulse ${className}`} style={{ minHeight: height }}>
        <div className="max-w-7xl mx-auto px-4 py-12">
          {/* Title skeleton */}
          <div className="h-10 bg-gray-200 rounded-lg w-64 mx-auto mb-8" />
          
          {/* Cards grid skeleton */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="aspect-[6/4] bg-gray-200 rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (variant === 'video') {
    return (
      <div className={`w-full bg-gradient-to-b from-[#2c476e] to-[#81899f] animate-pulse ${className}`} style={{ minHeight: height }}>
        <div className="flex items-center justify-center h-full" style={{ minHeight: height }}>
          <div className="flex space-x-2">
            <div className="w-3 h-3 bg-white/50 rounded-full animate-bounce" />
            <div className="w-3 h-3 bg-white/50 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
            <div className="w-3 h-3 bg-white/50 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
          </div>
        </div>
      </div>
    );
  }

  if (variant === 'newsletter') {
    return (
      <div className={`w-full bg-[#1B3764] animate-pulse ${className}`} style={{ minHeight: height }}>
        <div className="max-w-4xl mx-auto px-4 py-16">
          <div className="h-8 bg-white/10 rounded-lg w-80 mx-auto mb-4" />
          <div className="h-4 bg-white/10 rounded w-96 mx-auto mb-8" />
          <div className="flex gap-4 max-w-md mx-auto">
            <div className="flex-1 h-12 bg-white/10 rounded-lg" />
            <div className="w-32 h-12 bg-white/20 rounded-lg" />
          </div>
        </div>
      </div>
    );
  }

  // Default content skeleton
  return (
    <div className={`w-full bg-gray-100 animate-pulse ${className}`} style={{ minHeight: height }}>
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="h-8 bg-gray-200 rounded-lg w-72 mx-auto mb-8" />
        <div className="space-y-4">
          <div className="h-4 bg-gray-200 rounded w-full" />
          <div className="h-4 bg-gray-200 rounded w-5/6" />
          <div className="h-4 bg-gray-200 rounded w-4/6" />
        </div>
      </div>
    </div>
  );
};

export default SectionSkeleton;


