import { useEffect, useRef, useState } from 'react';

interface UseLazyVideoOptions {
  /** Start loading when within this many pixels of viewport */
  rootMargin?: string;
  /** Only load once, even if it leaves viewport */
  loadOnce?: boolean;
  /** Callback when video should start loading */
  onShouldLoad?: () => void;
}

/**
 * Hook to lazy load videos using Intersection Observer
 * Videos only start loading when they enter (or are near) the viewport
 */
export function useLazyVideo(options: UseLazyVideoOptions = {}) {
  const { rootMargin = '200px', loadOnce = true, onShouldLoad } = options;
  const [shouldLoad, setShouldLoad] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const hasLoadedRef = useRef(false);

  useEffect(() => {
    if (typeof window === 'undefined' || !videoRef.current) return;
    
    // If already loaded once and loadOnce is true, don't observe again
    if (hasLoadedRef.current && loadOnce) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldLoad(true);
          hasLoadedRef.current = true;
          if (onShouldLoad) onShouldLoad();
          
          // Stop observing if we only want to load once
          if (loadOnce) {
            observer.disconnect();
          }
        } else if (!loadOnce) {
          // Only unload if loadOnce is false
          setShouldLoad(false);
        }
      },
      {
        rootMargin,
        threshold: 0.01, // Trigger when even 1% is visible
      }
    );

    observer.observe(videoRef.current);

    return () => {
      observer.disconnect();
    };
  }, [rootMargin, loadOnce, onShouldLoad]);

  return { videoRef, shouldLoad };
}

