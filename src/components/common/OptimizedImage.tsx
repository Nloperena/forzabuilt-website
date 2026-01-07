import React, { forwardRef, useState, useCallback } from 'react';

interface OptimizedImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  width?: number;
  height?: number;
  quality?: number;
}

// Site origin for making relative URLs absolute
const SITE_ORIGIN = 'https://www.forzabuilt.com';

/**
 * A React component that leverages Vercel's Image Optimization API.
 * Uses /_vercel/image endpoint which works on Vercel deployments.
 * Falls back to original image if optimization fails (e.g., in local development).
 * 
 * @see https://vercel.com/docs/image-optimization
 */
const OptimizedImage = forwardRef<HTMLImageElement, OptimizedImageProps>(({
  src,
  width,
  height,
  quality = 75,
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

  // Generate Vercel Image Optimization URL
  // Format: /_vercel/image?url={encodedUrl}&w={width}&q={quality}
  const baseWidth = width || 400;
  const encodedUrl = encodeURIComponent(imageUrl);
  
  // Create optimized src at requested width
  const optimizedSrc = `/_vercel/image?url=${encodedUrl}&w=${baseWidth}&q=${quality}`;
  
  // Create srcset for responsive images (1x and 2x for retina)
  const srcSet = [
    `/_vercel/image?url=${encodedUrl}&w=${baseWidth}&q=${quality} 1x`,
    `/_vercel/image?url=${encodedUrl}&w=${Math.min(baseWidth * 2, 3840)}&q=${quality} 2x`
  ].join(', ');

  return (
    <img
      ref={ref}
      src={optimizedSrc}
      srcSet={srcSet}
      width={width}
      height={height}
      className={className}
      loading={loading}
      decoding="async"
      onError={handleError}
      {...props}
    />
  );
});

OptimizedImage.displayName = 'OptimizedImage';

export default OptimizedImage;

