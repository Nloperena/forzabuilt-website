import { useState, useEffect, useRef } from 'react';
import { byIndustry } from '../../utils/products';
import { useIsMobile } from '../../hooks/use-mobile';
import type { Product } from '@/types/products';

interface ImageOverlayProps {
  svgSrc: string;
  title?: string;
  industry?: string;
  activeProductId?: string | null;
  onProductHover?: (product: Product | null) => void;
  onProductSelect?: (product: Product | null) => void;
}

function ImageOverlay({ 
  svgSrc, 
  title, 
  industry = 'transportation', 
  activeProductId,
  onProductHover,
  onProductSelect 
}: ImageOverlayProps) {
  const [svgContent, setSvgContent] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pathProducts, setPathProducts] = useState<Map<string, Product>>(new Map());
  const [industryProducts, setIndustryProducts] = useState<Product[]>([]);
  
  const svgContainerRef = useRef<HTMLDivElement>(null);
  const selectedPathRef = useRef<SVGPathElement | SVGPolygonElement | null>(null);
  const hoveredPathRef = useRef<SVGPathElement | SVGPolygonElement | null>(null);
  const isMobile = useIsMobile();

  // Load industry products
  useEffect(() => {
    const loadProducts = async () => {
      try {
        const products = await byIndustry(industry);
        const formattedProducts = products.map(p => ({
          id: p.id,
          name: p.name,
          imageUrl: p.imageUrl,
          description: p.description || p.shortName || '',
          sku: p.shortName
        }));
        setIndustryProducts(formattedProducts);
      } catch (error) {
        console.error(`Failed to load ${industry} products:`, error);
      }
    };
    loadProducts();
  }, [industry]);

  // Sync active selection state from parent
  useEffect(() => {
    if (!activeProductId) {
      if (selectedPathRef.current) {
        selectedPathRef.current.classList.remove('selected');
        selectedPathRef.current = null;
      }
    }
  }, [activeProductId]);

  // Load and process SVG
  useEffect(() => {
    setIsLoading(true);
    setError(null);
    
    const finalSrc = encodeURI(svgSrc);
    
    fetch(finalSrc)
      .then((response) => {
        if (!response.ok) throw new Error(`Failed to fetch SVG (${response.status}): ${response.statusText}`);
        return response.text();
      })
      .then((text) => {
        const svgStartIndex = text.indexOf('<svg');
        if (svgStartIndex === -1) {
          throw new Error('No <svg> tag found in fetched content');
        }
        const cleanText = text.substring(svgStartIndex);
        
        const parser = new DOMParser();
        const svgDoc = parser.parseFromString(cleanText, 'image/svg+xml');
        const svgElement = svgDoc.documentElement;

        if (svgElement.tagName.toLowerCase() !== 'svg') {
          throw new Error('Fetched content is not a valid SVG');
        }

        // Set SVG to full size
        svgElement.setAttribute('height', '100%');
        svgElement.setAttribute('width', '100%');
        svgElement.setAttribute('preserveAspectRatio', 'xMidYMid meet');
        svgElement.style.display = 'block';
        svgElement.style.overflow = 'visible';

        // Process paths
        const paths = svgElement.querySelectorAll('path, polygon');
        paths.forEach((path, index) => {
          if (!path.id) {
            const titlePrefix = title ? title.replace(/\s+/g, '_') : 'path';
            path.id = `${titlePrefix}_path_${index}`;
          }
        });

        // Inject styles
        const style = svgDoc.createElementNS('http://www.w3.org/2000/svg', 'style');
        style.textContent = `
          path:hover:not(.selected):not(.hovered), polygon:hover:not(.selected):not(.hovered) {
            fill: #ff6600 !important;
            stroke: #ff6600 !important;
            transition: fill 0.2s ease, stroke 0.2s ease;
            cursor: pointer;
          }
          path.hovered:not(.selected), polygon.hovered:not(.selected) {
            fill: #ff6600 !important;
            stroke: #ff6600 !important;
          }
          path.selected, polygon.selected {
            fill: #ff6600 !important;
            stroke: #ff6600 !important;
          }
          path, polygon {
            cursor: pointer;
            vector-effect: non-scaling-stroke;
          }
        `;
        
        if (svgElement.firstChild) {
          svgElement.insertBefore(style, svgElement.firstChild);
        } else {
          svgElement.appendChild(style);
        }

        setSvgContent(svgElement.outerHTML);
        setIsLoading(false);

        // Map products
        if (industryProducts.length > 0) {
          const productMap = new Map<string, Product>();
          paths.forEach((path) => {
            const randomProduct = industryProducts[Math.floor(Math.random() * industryProducts.length)];
            productMap.set(path.id, randomProduct);
          });
          setPathProducts(productMap);
        }
      })
      .catch((error) => {
        console.error('Error loading SVG:', error);
        setError(error.message);
        setIsLoading(false);
      });
  }, [svgSrc, title, industryProducts]);

  // Handle interactions
  useEffect(() => {
    if (svgContent && svgContainerRef.current) {
      const svgElement = svgContainerRef.current.querySelector('svg');
      if (!svgElement) return;

      const paths = svgElement.querySelectorAll('path, polygon');

      const handleMouseEnter = (event: Event) => {
        if (isMobile || activeProductId) return;
        const target = event.currentTarget as SVGPathElement;
        if (hoveredPathRef.current && hoveredPathRef.current !== target) {
          hoveredPathRef.current.classList.remove('hovered');
        }
        target.classList.add('hovered');
        hoveredPathRef.current = target;
        const product = pathProducts.get(target.id);
        if (product) onProductHover?.(product);
      };

      const handleMouseLeave = () => {};

      const handleClick = (event: Event) => {
        event.stopPropagation();
        const target = event.currentTarget as SVGPathElement;
        const product = pathProducts.get(target.id);
        if (product) {
          if (selectedPathRef.current) selectedPathRef.current.classList.remove('selected');
          if (hoveredPathRef.current) hoveredPathRef.current.classList.remove('hovered');
          target.classList.add('selected');
          selectedPathRef.current = target;
          onProductSelect?.(product);
          onProductHover?.(null);
        }
      };

      paths.forEach((path) => {
        path.addEventListener('mouseenter', handleMouseEnter);
        path.addEventListener('mouseleave', handleMouseLeave);
        path.addEventListener('click', handleClick);
      });

      return () => {
        paths.forEach((path) => {
          path.removeEventListener('mouseenter', handleMouseEnter);
          path.removeEventListener('mouseleave', handleMouseLeave);
          path.removeEventListener('click', handleClick);
        });
      };
    }
  }, [svgContent, pathProducts, isMobile, activeProductId, onProductHover, onProductSelect]);

  return (
    <div className="relative w-full h-full flex items-center justify-center overflow-hidden bg-transparent">
      <div 
        ref={svgContainerRef}
        className="relative w-full h-full max-w-[1920px] mx-auto flex items-center justify-center"
      >
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/50 z-20">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1B3764]"></div>
          </div>
        )}
        
        {error && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-red-50/50 z-20 p-4 text-center">
            <p className="text-red-600 font-medium mb-2">Failed to load X-Ray view</p>
            <p className="text-red-500 text-sm">{error}</p>
          </div>
        )}

        {svgContent && (
          <div
            dangerouslySetInnerHTML={{ __html: svgContent }}
            className="w-full h-full relative z-10 flex items-center justify-center [&>svg]:w-full [&>svg]:h-full [&>svg]:block"
          />
        )}
      </div>
    </div>
  );
}

export default ImageOverlay;
