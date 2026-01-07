import React, { forwardRef, useState, useCallback } from 'react';

interface OptimizedImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  width?: number;
  height?: number;
  quality?: number;
  /** 
   * Responsive sizes attribute - tells browser which size to pick.
   * Example: "(max-width: 640px) 224px, 400px" means use 224px on mobile, 400px otherwise
   */
  sizes?: string;
  /**
   * For mobile-first responsive images, specify the mobile width separately.
   * If set, srcset will include this smaller size for mobile devices.
   */
  mobileWidth?: number;
  /**
   * For LCP images, set to "high" to prioritize loading.
   * Use with loading="eager" for above-the-fold images.
   */
  fetchPriority?: 'high' | 'low' | 'auto';
}

// Site origin for making relative URLs absolute
const SITE_ORIGIN = 'https://www.forzabuilt.com';

// Vercel's allowed image sizes (from vercel.json)
const ALLOWED_SIZES = [64, 128, 256, 384, 512, 640, 750, 828, 1080, 1200, 1920, 2048, 3840];

// Find the nearest allowed size (rounds up to ensure quality)
const getNearestSize = (targetWidth: number): number => {
  for (const size of ALLOWED_SIZES) {
    if (size >= targetWidth) return size;
  }
  return ALLOWED_SIZES[ALLOWED_SIZES.length - 1];
};

/**
 * A React component that leverages Vercel's Image Optimization API.
 * Uses /_vercel/image endpoint which works on Vercel deployments.
 * Falls back to original image if optimization fails (e.g., in local development).
 * 
 * Generates responsive srcset for mobile optimization.
 * 
 * @see https://vercel.com/docs/image-optimization
 */
const OptimizedImage = forwardRef<HTMLImageElement, OptimizedImageProps>(({
  src,
  width,
  height,
  quality = 75,
  sizes,
  mobileWidth,
  fetchPriority,
  className = '',
  loading = 'lazy',
  onError,
  ...props
}, ref) => {
  const srcString = typeof src === 'string' ? src : (src as any)?.src || '';
  const [useFallback, setUseFallback] = useState(false);
  
  // Handle error by falling back to original image
  const handleError = useCallback((e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    if (!useFallback) {
      setUseFallback(true);
    }
    // Call original onError if provided
    if (onError) {
      onError(e);
    }
  }, [useFallback, onError]);

  // Skip optimization for SVGs, data URIs, or already-optimized URLs
  const shouldSkipOptimization = !srcString || 
      srcString.endsWith('.svg') || 
      srcString.startsWith('data:') ||
      srcString.startsWith('/_vercel/image');
  
  if (shouldSkipOptimization || useFallback) {
    return (
      <img
        ref={ref}
        src={srcString}
        width={width}
        height={height}
        className={className}
        loading={loading}
        decoding="async"
        // @ts-ignore - fetchpriority is valid but not fully typed in React yet
        fetchpriority={fetchPriority}
        onError={onError}
        {...props}
      />
    );
  }

  // For remote URLs (starting with http), use directly
  // For local URLs (starting with /), make them absolute using production origin
  let imageUrl = srcString;
  if (srcString.startsWith('/') && !srcString.startsWith('//')) {
    imageUrl = `${SITE_ORIGIN}${srcString}`;
  }

  const encodedUrl = encodeURIComponent(imageUrl);
  const baseWidth = width || 400;
  
  // Generate srcset with multiple sizes for responsive images
  // Include: mobileWidth, mobileWidth*2 (retina), baseWidth, baseWidth*2 (retina)
  const srcSetWidths = new Set<number>();
  
  if (mobileWidth) {
    srcSetWidths.add(getNearestSize(mobileWidth));
    srcSetWidths.add(getNearestSize(mobileWidth * 2)); // 2x for retina mobile
  }
  srcSetWidths.add(getNearestSize(baseWidth));
  srcSetWidths.add(getNearestSize(Math.min(baseWidth * 2, 3840))); // 2x for retina desktop
  
  // Sort and create srcset
  const sortedWidths = Array.from(srcSetWidths).sort((a, b) => a - b);
  const srcSet = sortedWidths
    .map(w => `/_vercel/image?url=${encodedUrl}&w=${w}&q=${quality} ${w}w`)
    .join(', ');
  
  // Default sizes attribute if not provided
  // Mobile-first: smallest size for small screens, larger for bigger screens
  const defaultSizes = mobileWidth 
    ? `(max-width: 640px) ${mobileWidth}px, ${baseWidth}px`
    : `${baseWidth}px`;
  
  // Create optimized src at base width (fallback for browsers without srcset)
  const optimizedSrc = `/_vercel/image?url=${encodedUrl}&w=${getNearestSize(baseWidth)}&q=${quality}`;

  return (
    <img
      ref={ref}
      src={optimizedSrc}
      srcSet={srcSet}
      sizes={sizes || defaultSizes}
      width={width}
      height={height}
      className={className}
      loading={loading}
      decoding="async"
      // @ts-ignore - fetchpriority is valid but not fully typed in React yet
      fetchpriority={fetchPriority}
      onError={handleError}
      {...props}
    />
  );
});

OptimizedImage.displayName = 'OptimizedImage';

export default OptimizedImage;

