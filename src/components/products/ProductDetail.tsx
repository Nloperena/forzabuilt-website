import React, { useMemo, useState, useRef, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { typography } from '@/styles/brandStandards';
import { CHEMISTRY_ICONS, getIndustryLogo, toTitleCase, formatProductName } from '@/utils/industryHelpers';
import ImageSkeleton from '@/components/common/ImageSkeleton';
import type { Product } from '@/types/products';

interface ProductDetailProps {
  product: Product;
  relatedProducts?: Product[];
  productCategory?: string;
}

// Helper to get chemistry icon
const getChemistryIcon = (chemistry: string) => {
  if (!chemistry) return null;
  
  const chemistryLower = chemistry.toLowerCase();
  
  // Map chemistry names to icon paths
  if (chemistryLower.includes('acrylic') || chemistryLower.includes('psa')) {
    return CHEMISTRY_ICONS['Acrylic (incl. PSA)'];
  } else if (chemistryLower.includes('epoxy') && !chemistryLower.includes('modified')) {
    return CHEMISTRY_ICONS['Epoxy'];
  } else if (chemistryLower.includes('modified') && chemistryLower.includes('epoxy')) {
    return CHEMISTRY_ICONS['Modified Epoxy'];
  } else if (chemistryLower.includes('silicone')) {
    return CHEMISTRY_ICONS['Silicone'];
  } else if (chemistryLower.includes('ms') || chemistryLower.includes('hybrid') || chemistryLower.includes('polymer')) {
    return CHEMISTRY_ICONS['MS'];
  } else if (chemistryLower.includes('water') || chemistryLower.includes('waterbase')) {
    return CHEMISTRY_ICONS['Water Base'];
  } else if (chemistryLower.includes('hot') && chemistryLower.includes('melt')) {
    return CHEMISTRY_ICONS['Hotmelt'];
  } else if (chemistryLower.includes('solvent')) {
    return CHEMISTRY_ICONS['Solvent Base'];
  } else if (chemistryLower.includes('polyurethane') || chemistryLower.includes('urethane')) {
    return CHEMISTRY_ICONS['Polyurethane (PU)'];
  } else if (chemistryLower.includes('cyanoacrylate') || chemistryLower.includes('cyano')) {
    return CHEMISTRY_ICONS['Cyanoacrylates'];
  } else if (chemistryLower.includes('methacrylate')) {
    return CHEMISTRY_ICONS['Methacrylate/MMA'];
  } else if (chemistryLower.includes('rubber')) {
    return CHEMISTRY_ICONS['Rubber Based'];
  }
  
  return null;
};

const ProductDetail: React.FC<ProductDetailProps> = ({ product, relatedProducts = [], productCategory }) => {
  const [activeTab, setActiveTab] = useState('applications');
  const tabsListRef = useRef<HTMLDivElement>(null);
  
  // Make navbar active immediately on this page
  useEffect(() => {
    // Trigger a scroll event to activate the navbar
    window.dispatchEvent(new Event('scroll'));
  }, []);

  // Function to scroll to the active tab
  const scrollToActiveTab = useCallback(() => {
    if (tabsListRef.current) {
      // Find all tab elements
      const tabElements = tabsListRef.current.querySelectorAll('[role="tab"]');
      const tabValues = ['applications', 'benefits', 'technical', 'sizing'];
      const currentIndex = tabValues.indexOf(activeTab);
      
      // Get the active tab element
      const activeTabElement = tabElements[currentIndex] as HTMLElement;
      
      if (activeTabElement) {
        // Calculate position to center the active tab
        const tabsListRect = tabsListRef.current.getBoundingClientRect();
        const activeTabRect = activeTabElement.getBoundingClientRect();
        
        const scrollLeft = activeTabElement.offsetLeft - 
                          (tabsListRect.width / 2) + 
                          (activeTabRect.width / 2);
        
        // Smooth scroll to the active tab
        tabsListRef.current.scrollTo({
          left: scrollLeft,
          behavior: 'smooth'
        });
      }
    }
  }, [activeTab]);

  // Scroll to active tab when it changes
  useEffect(() => {
    scrollToActiveTab();
  }, [activeTab, scrollToActiveTab]);
  
  // Ensure the tabs are properly positioned on initial load
  useEffect(() => {
    // Wait for the DOM to be fully rendered
    const timer = setTimeout(() => {
      scrollToActiveTab();
    }, 100);
    
    return () => clearTimeout(timer);
  }, [scrollToActiveTab]);
  
  // Add touch swipe interaction for mobile
  useEffect(() => {
    const tabsElement = tabsListRef.current;
    if (!tabsElement) return;
    
    let touchStartX = 0;
    let touchEndX = 0;
    
    const handleTouchStart = (e: TouchEvent) => {
      touchStartX = e.changedTouches[0].screenX;
    };
    
    const handleTouchEnd = (e: TouchEvent) => {
      touchEndX = e.changedTouches[0].screenX;
      handleSwipe();
    };
    
    const handleSwipe = () => {
      const swipeDistance = touchEndX - touchStartX;
      if (Math.abs(swipeDistance) < 50) return; // Minimum swipe distance
      
      const tabValues = ['applications', 'benefits', 'technical', 'sizing'];
      const currentIndex = tabValues.indexOf(activeTab);
      
      if (swipeDistance > 0 && currentIndex > 0) {
        // Swipe right - go to previous tab
        setActiveTab(tabValues[currentIndex - 1]);
      } else if (swipeDistance < 0 && currentIndex < tabValues.length - 1) {
        // Swipe left - go to next tab
        setActiveTab(tabValues[currentIndex + 1]);
      }
    };
    
    tabsElement.addEventListener('touchstart', handleTouchStart);
    tabsElement.addEventListener('touchend', handleTouchEnd);
    
    return () => {
      tabsElement.removeEventListener('touchstart', handleTouchStart);
      tabsElement.removeEventListener('touchend', handleTouchEnd);
    };
  }, [activeTab, setActiveTab]);

  // Image loading states
  const [mainImageLoaded, setMainImageLoaded] = useState(false);
  const [mobileHeroImageLoaded, setMobileHeroImageLoaded] = useState(false);
  const [industryLogoLoaded, setIndustryLogoLoaded] = useState(false);
  const [chemistryIconLoaded, setChemistryIconLoaded] = useState(false);
  const [relatedProductImagesLoaded, setRelatedProductImagesLoaded] = useState<{ [key: string]: boolean }>({});

  // Refs for image elements to check if already loaded (cached)
  const mainImageRef = useRef<HTMLImageElement>(null);
  const mobileImageRef = useRef<HTMLImageElement>(null);
  const industryLogoRef = useRef<HTMLImageElement>(null);

  // Reset image loading states when product changes
  useEffect(() => {
    setMainImageLoaded(false);
    setMobileHeroImageLoaded(false);
    setIndustryLogoLoaded(false);
    setChemistryIconLoaded(false);
    setRelatedProductImagesLoaded({});
  }, [product?.id]);

  // Check if images are already loaded (cached) after component mounts and when imageUrl changes
  useEffect(() => {
    const checkImageLoad = () => {
      if (mainImageRef.current?.complete && mainImageRef.current.naturalWidth > 0) {
        setMainImageLoaded(true);
      }
      if (mobileImageRef.current?.complete && mobileImageRef.current.naturalWidth > 0) {
        setMobileHeroImageLoaded(true);
      }
      if (industryLogoRef.current?.complete && industryLogoRef.current.naturalWidth > 0) {
        setIndustryLogoLoaded(true);
      }
    };

    // Check immediately
    checkImageLoad();

    // Also check after a brief delay to catch images that load very quickly
    const timeout = setTimeout(checkImageLoad, 100);

    return () => clearTimeout(timeout);
  }, [product?.id, product?.imageUrl, product?.industry]);

  // Normalize sizing/packaging into a single list for Sizing tab
  const normalizeToList = useCallback((value: unknown): string[] => {
    if (!value) return [];
    if (Array.isArray(value)) {
      return value
        .filter((v): v is string => typeof v === 'string')
        .map(v => v.trim())
        .filter(v => v.length > 0);
    }
    if (typeof value === 'string') {
      // Split on bullets or newlines
      return value
        .split(/\n|•/g)
        .map(v => v.trim().replace(/^[-–·\u2022]\s*/, ''))
        .filter(v => v.length > 0);
    }
    return [];
  }, []);

  const sizesAndPackaging = useMemo(() => {
    if (!product) return [];
    const sizes = normalizeToList((product as any).sizes);
    const sizing = normalizeToList((product as any).sizing);
    const packaging = normalizeToList((product as any).specifications?.packaging);
    // Merge and dedupe
    const merged = [...sizes, ...sizing, ...packaging];
    return Array.from(new Set(merged));
  }, [product, normalizeToList]);

  if (!product) {
    return null;
  }

  // Get product image URL - use imageUrl from product (already formatted by service)
  const productImageUrl = product.imageUrl || (product as any).image || '/placeholder.svg';
  const categorySlug = productCategory || product.category?.toLowerCase() || 'bond';

  return (
    <main className="flex-1 pb-10">
      {/* Product Image, Title and Description */}
      <section className="bg-gradient-to-r from-[#477197] to-[#2c476e] h-[60vh] md:h-[88vh] flex items-center">
        <div className="max-w-[1200px] mx-auto px-4 w-full">
          <div className="grid lg:grid-cols-2 gap-6 md:gap-8 items-center">
            {/* Product Image */}
            <div className="flex justify-center lg:justify-start relative h-[200px] sm:h-[250px] md:h-[400px] lg:h-[450px] xl:h-[500px] 2xl:h-[600px]">
              {/* Mobile/Tablet Product Image */}
              <div className="lg:hidden w-full h-full relative">
                {!mobileHeroImageLoaded && (
                  <ImageSkeleton className="w-full h-full rounded-lg" />
                )}
                <img 
                  ref={(el) => {
                    mobileImageRef.current = el;
                    // Check if image is already loaded (cached)
                    if (el?.complete && el.naturalWidth > 0) {
                      setMobileHeroImageLoaded(true);
                    }
                  }}
                  src={productImageUrl}
                  alt={product.name}
                  className={`w-full h-full object-contain rounded-lg transition-opacity duration-500 ${
                    mobileHeroImageLoaded ? 'opacity-100' : 'opacity-0'
                  }`}
                  onLoad={() => setMobileHeroImageLoaded(true)}
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    console.error('Hero image error:', target.src);
                    if (target.src.includes('vercel-storage') || target.src.includes('blob')) {
                      const filename = product.id.toLowerCase() + '.png';
                      target.src = `/product-images/${filename}`;
                    } else if (!target.src.includes('placeholder')) {
                      target.src = '/placeholder.svg';
                    }
                    setMobileHeroImageLoaded(true);
                  }}
                />
              </div>
              {/* Desktop Product Image */}
              <div className="hidden lg:block relative w-[450px] h-[450px] xl:w-[500px] xl:h-[500px] 2xl:w-[600px] 2xl:h-[600px]">
                {!mainImageLoaded && (
                  <ImageSkeleton className="w-full h-full" />
                )}
                <img 
                  ref={(el) => {
                    mainImageRef.current = el;
                    // Check if image is already loaded (cached)
                    if (el?.complete && el.naturalWidth > 0) {
                      setMainImageLoaded(true);
                    }
                  }}
                  src={productImageUrl} 
                  alt={product.name}
                  className={`w-full h-full object-contain transition-opacity duration-500 ${
                    mainImageLoaded ? 'opacity-100' : 'opacity-0'
                  }`}
                  onLoad={() => setMainImageLoaded(true)}
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    console.error('Hero image error:', target.src);
                    if (target.src.includes('vercel-storage') || target.src.includes('blob')) {
                      const filename = product.id.toLowerCase() + '.png';
                      target.src = `/product-images/${filename}`;
                    } else if (!target.src.includes('placeholder')) {
                      target.src = '/placeholder.svg';
                    }
                    setMainImageLoaded(true);
                  }}
                />
              </div>
            </div>
            
            {/* Product Info */}
            <div>
              <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-3xl xl:text-4xl 2xl:text-4xl font-regular text-white mb-3 md:mb-4 leading-tight font-poppins text-left normal-case">
                {formatProductName(product.name || '')}
              </h1>
              <div className="text-sm sm:text-base md:text-lg lg:text-xl text-white/90 mb-4 md:mb-8 leading-relaxed text-left">
                {product.description}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Product Details Section - Grey Background */}
      <section className="bg-gray-100 pb-8 md:pb-12">
        <div className="max-w-[1200px] mx-auto px-4 pt-4 md:pt-8">
          {/* Product Details Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            {/* Tabs Selector - Above Content Container */}
            <div className="flex justify-center mb-4 md:mb-6">
              <TabsList ref={tabsListRef} className="inline-flex bg-transparent rounded-full p-1 gap-1.5 md:gap-3">
                <TabsTrigger 
                  value="applications" 
                  className="px-3 py-1.5 md:px-8 md:py-3 rounded-full text-xs md:text-base font-medium transition-all duration-200 data-[state=active]:bg-[#477197] data-[state=active]:text-white data-[state=inactive]:bg-gray-200 data-[state=inactive]:text-gray-700 data-[state=inactive]:hover:bg-gray-300"
                >
                  Applications
                </TabsTrigger>
                <TabsTrigger 
                  value="benefits" 
                  className="px-3 py-1.5 md:px-8 md:py-3 rounded-full text-xs md:text-base font-medium transition-all duration-200 data-[state=active]:bg-[#477197] data-[state=active]:text-white data-[state=inactive]:bg-gray-200 data-[state=inactive]:text-gray-700 data-[state=inactive]:hover:bg-gray-300"
                >
                  Benefits
                </TabsTrigger>
                <TabsTrigger 
                  value="technical" 
                  className="px-3 py-1.5 md:px-8 md:py-3 rounded-full text-xs md:text-base font-medium transition-all duration-200 data-[state=active]:bg-[#477197] data-[state=active]:text-white data-[state=inactive]:bg-gray-200 data-[state=inactive]:text-gray-700 data-[state=inactive]:hover:bg-gray-300"
                >
                  Technical
                </TabsTrigger>
                <TabsTrigger 
                  value="sizing" 
                  className="px-3 py-1.5 md:px-8 md:py-3 rounded-full text-xs md:text-base font-medium transition-all duration-200 data-[state=active]:bg-[#477197] data-[state=active]:text-white data-[state=inactive]:bg-gray-200 data-[state=inactive]:text-gray-700 data-[state=inactive]:hover:bg-gray-300"
                >
                  Sizing
                </TabsTrigger>
              </TabsList>
            </div>

            {/* Product Details Tabs Content Container */}
            <motion.section 
              className="mb-6 md:mb-12 bg-gradient-to-b from-[#477197] to-[#2c476e] rounded-2xl p-4 md:p-8"
              layout
              transition={{ duration: 0.4, ease: "easeInOut" }}
            >
              <motion.div 
                className="mt-2 md:mt-2"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
              >
                <TabsContent value="applications" className="space-y-4 md:space-y-6">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -40 }}
                    transition={{ duration: 0.5 }}
                    layout
                  >
                    <motion.div layout transition={{ duration: 0.5 }}>
                      <Card className="bg-transparent border-0 rounded-2xl">
                        <CardHeader className="px-2 md:px-6 pt-2 pb-2 md:pt-2 md:pb-4">
                          <CardTitle className="text-white font-poppins font-regular" 
                                     style={{ fontFamily: typography.body.fontFamily, fontWeight: typography.body.fontWeight, fontSize: 'clamp(1.125rem, 2.5vw + 0.5rem, 2.5rem)' }}>
                            Applications
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="px-2 md:px-6 py-2 md:py-4">
                          <div className="grid md:grid-cols-2 gap-4 md:gap-6">
                            <div>
                              {Array.isArray(product.applications) && product.applications.length > 0 ? (
                                <ul className="space-y-1.5 md:space-y-2 text-white/80 text-sm md:text-base">
                                  {product.applications.map((app, index) => (
                                    <li key={index} className="flex items-start gap-2">
                                      <div className="w-2 h-2 bg-white rounded-full mt-2 flex-shrink-0"></div>
                                      <span>{app}</span>
                                    </li>
                                  ))}
                                </ul>
                              ) : (
                                <ul className="space-y-1.5 md:space-y-2 text-white/80 text-sm md:text-base">
                                  <li className="flex items-start gap-2">
                                    <div className="w-2 h-2 bg-white rounded-full mt-2 flex-shrink-0"></div>
                                    <span>Industrial bonding and assembly</span>
                                  </li>
                                  <li className="flex items-start gap-2">
                                    <div className="w-2 h-2 bg-white rounded-full mt-2 flex-shrink-0"></div>
                                    <span>Automotive manufacturing</span>
                                  </li>
                                  <li className="flex items-start gap-2">
                                    <div className="w-2 h-2 bg-white rounded-full mt-2 flex-shrink-0"></div>
                                    <span>Construction and building</span>
                                  </li>
                                  <li className="flex items-start gap-2">
                                    <div className="w-2 h-2 bg-white rounded-full mt-2 flex-shrink-0"></div>
                                    <span>Marine and aerospace</span>
                                  </li>
                                </ul>
                              )}
                            </div>
                            <div>
                              <div className="flex items-center gap-6 mb-6">
                                {getIndustryLogo(product.industry) ? (
                                  <div className="relative h-24 w-24 md:h-32 md:w-32">
                                    {!industryLogoLoaded && (
                                      <ImageSkeleton className="w-full h-full rounded-full" />
                                    )}
                                    <img 
                                      ref={(el) => {
                                        industryLogoRef.current = el;
                                        // Check if image is already loaded (cached)
                                        if (el?.complete && el.naturalWidth > 0) {
                                          setIndustryLogoLoaded(true);
                                        }
                                      }}
                                      src={getIndustryLogo(product.industry)} 
                                      alt={`${Array.isArray(product.industry) ? product.industry[0] || '' : product.industry} icon`}
                                      className={`h-24 w-24 md:h-32 md:w-32 object-contain transition-opacity duration-500 ${
                                        industryLogoLoaded ? 'opacity-100' : 'opacity-0'
                                      }`}
                                      onLoad={() => setIndustryLogoLoaded(true)}
                                      onError={() => setIndustryLogoLoaded(true)}
                                    />
                                  </div>
                                ) : (
                                  <div className="w-24 h-24 md:w-32 md:h-32 bg-white/20 rounded-full flex items-center justify-center">
                                    <span className="text-white font-bold text-3xl md:text-4xl">{Array.isArray(product.industry) ? product.industry[0]?.charAt(0).toUpperCase() || '' : product.industry?.charAt(0).toUpperCase() || ''}</span>
                                  </div>
                                )}
                                <span className="text-white capitalize font-kallisto" style={{ fontFamily: typography.body.fontFamily, fontWeight: typography.body.fontWeight, fontSize: 'clamp(1.25rem, 2.5vw + 0.5rem, 2.5rem)' }}>{Array.isArray(product.industry) ? product.industry[0] || '' : product.industry || ''}</span>
                              </div>
                              <p className="text-white/80 text-lg">
                                Specifically engineered for {Array.isArray(product.industry) ? product.industry[0]?.toLowerCase() || '' : product.industry?.toLowerCase() || ''} applications, 
                                this product delivers optimal performance in demanding environments.
                              </p>
                              
                              {/* Compatible Substrates */}
                              {product.specifications?.substrates && Array.isArray(product.specifications.substrates) && (
                                <div className="mt-4">
                                  <h4 className="text-lg font-semibold text-white mb-2">
                                    Compatible Substrates
                                  </h4>
                                  <div className="flex flex-wrap gap-1">
                                    {product.specifications.substrates.map((substrate, index) => (
                                      <Badge key={index} className="bg-white/10 backdrop-blur-sm text-white text-xs border border-white/20">
                                        {substrate}
                                      </Badge>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  </motion.div>
                </TabsContent>

                <TabsContent value="benefits" className="space-y-6">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -40 }}
                    transition={{ duration: 0.5 }}
                    layout
                  >
                    <motion.div layout transition={{ duration: 0.5 }}>
                      <Card className="bg-transparent border-0 rounded-2xl">
                        <CardHeader className="px-2 md:px-6 pt-2 pb-2 md:pt-2 md:pb-4">
                          <CardTitle className="text-white font-poppins font-regular"
                                     style={{ fontFamily: typography.body.fontFamily, fontWeight: typography.body.fontWeight, fontSize: 'clamp(1.25rem, 2.5vw + 0.5rem, 2.5rem)' }}>
                            Benefits
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4 md:space-y-6 px-2 md:px-6 py-2 md:py-4">
                          {/* Benefits */}
                          {Array.isArray(product.benefits) && product.benefits.length > 0 && (
                            <ul className="space-y-2 text-white/80">
                              {product.benefits.map((benefit, index) => (
                                <li key={index} className="flex items-start gap-2">
                                  <div className="w-2 h-2 bg-white rounded-full mt-2 flex-shrink-0"></div>
                                  <span>{benefit}</span>
                                </li>
                              ))}
                            </ul>
                          )}

                          {/* Colors */}
                          {Array.isArray((product as any).colors) && (product as any).colors.length > 0 && (
                            <ul className="space-y-2 text-white/80">
                              {(product as any).colors.map((color: string, index: number) => (
                                <li key={index} className="flex items-start gap-2">
                                  <div className="w-2 h-2 bg-white rounded-full mt-2 flex-shrink-0"></div>
                                  <span>{color}</span>
                                </li>
                              ))}
                            </ul>
                          )}

                          {/* Sizing */}
                          {Array.isArray((product as any).sizing) && (product as any).sizing.length > 0 && (
                            <ul className="space-y-2 text-white/80">
                              {(product as any).sizing.map((size: string, index: number) => (
                                <li key={index} className="flex items-start gap-2">
                                  <div className="w-2 h-2 bg-white rounded-full mt-2 flex-shrink-0"></div>
                                  <span>{toTitleCase(size)}</span>
                                </li>
                              ))}
                            </ul>
                          )}

                          {/* Cleanup */}
                          {Array.isArray((product as any).cleanup) && (product as any).cleanup.length > 0 && (
                            <ul className="space-y-2 text-white/80">
                              {(product as any).cleanup.map((method: string, index: number) => (
                                <li key={index} className="flex items-start gap-2">
                                  <div className="w-2 h-2 bg-white rounded-full mt-2 flex-shrink-0"></div>
                                  <span>{method}</span>
                                </li>
                              ))}
                            </ul>
                          )}
                        </CardContent>
                      </Card>
                    </motion.div>
                  </motion.div>
                </TabsContent>

                <TabsContent value="technical" className="space-y-6">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -40 }}
                    transition={{ duration: 0.5 }}
                    layout
                  >
                    <motion.div layout transition={{ duration: 0.5 }}>
                      <Card className="bg-transparent border-0 rounded-2xl">
                        <CardHeader className="px-2 md:px-6 pt-2 pb-2 md:pt-2 md:pb-4">
                          <CardTitle className="text-white font-poppins font-regular"
                                     style={{ fontFamily: typography.body.fontFamily, fontWeight: typography.body.fontWeight, fontSize: 'clamp(1.25rem, 2.5vw + 0.5rem, 2.5rem)' }}>
                            Technical Data
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="px-4 md:px-6 py-3 md:py-4">
                          {/* Chemistry Section - Above the table */}
                          <div className="mb-6">
                            <h3 className="text-lg md:text-xl font-bold text-white mb-3 md:mb-4" 
                                style={{ fontFamily: typography.subheads.fontFamily, fontWeight: typography.subheads.fontWeight }}>
                              Chemistry
                            </h3>
                            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 flex items-center">
                              <div className="mr-4 relative">
                                {(() => {
                                  const chemIcon = getChemistryIcon(product.chemistry || '');
                                  if (chemIcon) {
                                    return (
                                      <>
                                        {!chemistryIconLoaded && (
                                          <ImageSkeleton className="w-24 h-24 md:w-28 md:h-28 rounded-full" />
                                        )}
                                        <img 
                                          src={chemIcon} 
                                          alt={`${product.chemistry || ''} Chemistry`} 
                                          className={`w-24 h-24 md:w-28 md:h-28 chemistry-icon transition-opacity duration-500 ${
                                            chemistryIconLoaded ? 'opacity-100' : 'opacity-0'
                                          }`}
                                          onLoad={() => setChemistryIconLoaded(true)}
                                          onError={() => setChemistryIconLoaded(true)}
                                        />
                                      </>
                                    );
                                  } else {
                                    return (
                                      <div className="w-24 h-24 md:w-28 md:h-28 bg-white/20 rounded-full flex items-center justify-center">
                                        <span className="text-white font-bold text-2xl">
                                          {product.chemistry ? (typeof product.chemistry === 'string' ? product.chemistry.charAt(0) : '?') : '?'}
                                        </span>
                                      </div>
                                    );
                                  }
                                })()}
                              </div>
                              <div>
                                <div className="font-semibold text-white mb-1">
                                  {product.chemistry || 'Chemistry Type'}
                                </div>
                                <div className="text-white/80">
                                  {(product as any).chemistryDetails?.technical || 'Specialized chemistry for optimal performance in various applications.'}
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Technical Data Table - Dynamic display of all properties */}
                          {product.technicalData && Object.keys(product.technicalData).length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {Object.entries(product.technicalData).map(([key, value]) => (
                                <div key={key} className="flex justify-between py-3 border-b border-white/10">
                                  <span className="font-semibold text-white">{key}:</span>
                                  <span className="text-white/80">{String(value) || 'N/A'}</span>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p className="text-white/70">No technical data available for this product.</p>
                          )}

                          {/* Tape Test Data Table - Only for TAPE products */}
                          {product.category === 'TAPE' && product.technicalData && (product.technicalData as any).testData && (
                            <div className="mt-6">
                              <h3 className="text-lg md:text-xl font-bold text-white mb-4" 
                                  style={{ fontFamily: typography.subheads.fontFamily, fontWeight: typography.subheads.fontWeight }}>
                                Test Data
                              </h3>
                              <div className="overflow-x-auto">
                                <table className="w-full max-w-2xl text-sm" style={{ tableLayout: 'fixed' }}>
                                  <colgroup>
                                    <col style={{ width: '35%' }} />
                                    <col style={{ width: '30%' }} />
                                    <col style={{ width: '35%' }} />
                                  </colgroup>
                                  <thead>
                                    <tr className="border-b border-white/20">
                                      <th className="text-left py-2.5 px-3 font-semibold text-white">Property</th>
                                      <th className="text-left py-2.5 px-3 font-semibold text-white">Value</th>
                                      <th className="text-left py-2.5 px-3 font-semibold text-white">Methods</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {(product.technicalData as any).testData.map((test: any, index: number) => (
                                      <tr key={index} className="border-b border-white/10">
                                        <td className="py-2.5 px-3 text-white/90 font-medium break-words">{test.property}</td>
                                        <td className="py-2.5 px-3 text-white/80 break-words">{test.value || '-'}</td>
                                        <td className="py-2.5 px-3 text-white/70 text-xs break-words">{test.method}</td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    </motion.div>
                  </motion.div>
                </TabsContent>

                <TabsContent value="sizing" className="space-y-6">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -40 }}
                    transition={{ duration: 0.5 }}
                    layout
                  >
                    <motion.div layout transition={{ duration: 0.5 }}>
                      <Card className="bg-transparent border-0 rounded-2xl">
                        <CardHeader className="px-2 md:px-6 pt-2 pb-2 md:pt-2 md:pb-4">
                          <CardTitle className="text-white font-poppins font-regular"
                                     style={{ fontFamily: typography.body.fontFamily, fontWeight: typography.body.fontWeight, fontSize: 'clamp(1.25rem, 2.5vw + 0.5rem, 2.5rem)' }}>
                            Available Sizes
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4 md:space-y-6 px-2 md:px-6 py-2 md:py-4">
                          {/* Sizes (includes packaging data under same label) */}
                          {sizesAndPackaging.length > 0 ? (
                            <ul className="space-y-2 text-white/80">
                              {sizesAndPackaging.map((size, index) => (
                                <li key={index} className="flex items-start gap-2">
                                  <div className="w-2 h-2 bg-white rounded-full mt-2 flex-shrink-0"></div>
                                  <span>{toTitleCase(size)}</span>
                                </li>
                              ))}
                            </ul>
                          ) : (
                            <div className="text-center py-8">
                              <Package className="h-16 w-16 text-white/30 mx-auto mb-4" />
                              <p className="text-white/70 text-lg">No sizing information available for this product.</p>
                              <p className="text-white/50 text-sm mt-2">Contact us for options.</p>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    </motion.div>
                  </motion.div>
                </TabsContent>
              </motion.div>
            </motion.section>
          </Tabs>
        </div>
      </section>

      {/* Related Products Section - White Background */}
      {relatedProducts.length > 0 && (
        <section className="bg-white py-12">
          <div className="max-w-[1200px] mx-auto px-4">
            <div className="mb-8">
              <h2 className="font-poppins font-regular text-gray-900 mb-2" 
                  style={{ fontFamily: typography.body.fontFamily, fontWeight: typography.body.fontWeight, fontSize: 'clamp(1.25rem, 2.5vw + 0.5rem, 2.5rem)' }}>
                Related Products
              </h2>
              <p className="text-gray-600">More {Array.isArray(product.industry) ? product.industry[0] || '' : product.industry || ''} solutions</p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4" style={{ gap: 'clamp(1.5rem, 3vw, 2.5rem)' }}>
              {relatedProducts.map((relatedProduct, idx) => {
                const relatedCategorySlug = relatedProduct.category?.toLowerCase() || 'bond';
                const relatedImageUrl = relatedProduct.imageUrl || relatedProduct.image || '/placeholder.svg';
                
                return (
                  <motion.div
                    key={relatedProduct.id}
                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -20, scale: 0.95 }}
                    transition={{ duration: 0.3, delay: Math.min(idx * 0.03, 0.3) }}
                    layout
                    className="group"
                  >
                    <a href={`/products/${relatedCategorySlug}/${relatedProduct.id}`}>
                      <div 
                        className="relative overflow-hidden transition-all duration-500 hover:scale-[1.02] h-32 md:h-[340px] rounded-xl md:rounded-2xl bg-gradient-to-b from-[#477197] to-[#2c476e] border border-gray-200 hover:border-gray-300 shadow-lg"
                      >
                        {/* Desktop: Product Image */}
                        <div 
                          className="absolute inset-0 hidden md:block pb-24 cursor-pointer relative" 
                          style={{ transform: 'translateY(-3%) scale(0.85)' }}
                        >
                          {!relatedProductImagesLoaded[relatedProduct.id] && (
                            <ImageSkeleton />
                          )}
                          <img 
                            src={relatedImageUrl} 
                            alt={relatedProduct.name}
                            className={`w-full h-full object-contain transition-all duration-500 group-hover:scale-105 ${
                              relatedProductImagesLoaded[relatedProduct.id] ? 'opacity-100' : 'opacity-0'
                            }`}
                            onLoad={() => setRelatedProductImagesLoaded(prev => ({ ...prev, [relatedProduct.id]: true }))}
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              if (target.src.includes('vercel-storage') || target.src.includes('blob')) {
                                const filename = relatedProduct.id.toLowerCase() + '.png';
                                target.src = `/product-images/${filename}`;
                              } else if (!target.src.includes('placeholder')) {
                                target.src = '/placeholder.svg';
                              }
                              setRelatedProductImagesLoaded(prev => ({ ...prev, [relatedProduct.id]: true }));
                            }}
                          />
                        </div>

                        {/* Mobile: Left side with image and basic info */}
                        <div className="flex md:hidden items-center gap-4 flex-1 p-4">
                          {/* Mobile: Product Image */}
                          <div className="w-[100px] h-[100px] rounded-xl overflow-hidden bg-transparent relative flex items-center justify-center">
                            {!relatedProductImagesLoaded[relatedProduct.id] && (
                              <ImageSkeleton className="rounded-xl" />
                            )}
                            <img 
                              src={relatedImageUrl} 
                              alt={relatedProduct.name}
                              className={`max-w-full max-h-full object-contain transition-opacity duration-500 ${
                                relatedProductImagesLoaded[relatedProduct.id] ? 'opacity-100' : 'opacity-0'
                              }`}
                              onLoad={() => setRelatedProductImagesLoaded(prev => ({ ...prev, [relatedProduct.id]: true }))}
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                if (target.src.includes('vercel-storage') || target.src.includes('blob')) {
                                  const filename = relatedProduct.id.toLowerCase() + '.png';
                                  target.src = `/product-images/${filename}`;
                                } else if (!target.src.includes('placeholder')) {
                                  target.src = '/placeholder.svg';
                                }
                                setRelatedProductImagesLoaded(prev => ({ ...prev, [relatedProduct.id]: true }));
                              }}
                            />
                          </div>
                          
                          {/* Mobile: Product Info */}
                          <div className="flex-1 min-w-0">
                            <h3 className="text-sm font-kallisto font-bold mb-1 leading-tight line-clamp-1 text-white">
                              {relatedProduct.name}
                            </h3>
                            <p className="text-xs text-white line-clamp-2">
                              {relatedProduct.description || ''}
                            </p>
                          </div>
                        </div>

                        {/* Desktop: Content Section with title and description */}
                        <div className="hidden md:block p-2.5 absolute bottom-0 left-0 right-0">
                          <div className="space-y-0.5">
                            <h3 className="text-sm font-poppins font-bold leading-tight line-clamp-2 text-white">
                              {relatedProduct.name}
                            </h3>
                            <p className="text-xs text-white line-clamp-2">
                              {relatedProduct.description || ''}
                            </p>
                            
                            {/* Button Row */}
                            <div className="flex gap-1.5 mt-2 pt-2">
                              {/* Details Button */}
                              <a
                                href={`/products/${relatedCategorySlug}/${relatedProduct.id}`}
                                onClick={(e) => e.stopPropagation()}
                                className="flex-1 inline-flex items-center justify-center bg-[#F2611D] hover:bg-[#d9551a] text-white rounded-full px-3 py-1.5 text-xs font-medium transition-all duration-300"
                              >
                                Details
                              </a>
                            </div>
                          </div>
                        </div>

                        {/* Mobile: Right side with buttons */}
                        <div className="flex md:hidden items-center gap-2 p-4">
                          {/* Mobile: Product Details Button */}
                          <a
                            href={`/products/${relatedCategorySlug}/${relatedProduct.id}`}
                            onClick={(e) => e.stopPropagation()}
                            className="flex items-center justify-center bg-white/20 backdrop-blur-md hover:bg-white/30 text-white rounded-full px-3 py-1.5 text-xs font-medium transition-all duration-300 border border-white/30"
                          >
                            Details
                          </a>
                        </div>
                      </div>
                    </a>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Call to Action */}
      <section className="bg-white py-12">
        <div className="max-w-[1200px] mx-auto px-4">
          <div className="text-center">
            <Card className="bg-gradient-to-r from-[#477197] to-[#2c476e] border border-gray-200 rounded-2xl p-8">
              <CardContent className="space-y-4 md:space-y-6 px-2 md:px-6 py-2 md:py-4">
                <h2 className="font-poppins font-regular text-white" 
                    style={{ fontFamily: typography.body.fontFamily, fontWeight: typography.body.fontWeight, fontSize: 'clamp(1.25rem, 2.5vw + 0.5rem, 2.5rem)' }}>
                  Ready to Get Started
                </h2>
                <p className="text-xl text-gray-300 max-w-2xl mx-auto" 
                   style={{ fontFamily: typography.body.fontFamily, fontWeight: typography.body.fontWeight }}>
                  Contact our technical team for expert guidance and support with your application.
                </p>
                <div className="flex flex-wrap gap-4 justify-center">
                  <a href="/contact">
                    <Button 
                      className="bg-[#F2611D] hover:bg-[#E6540D] text-white font-poppins font-normal rounded-full px-8 py-6 text-xl shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      Contact Us
                    </Button>
                  </a>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </main>
  );
};

export default ProductDetail;

