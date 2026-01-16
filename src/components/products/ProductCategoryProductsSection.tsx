import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Search, Filter, ArrowUpDown, ChevronDown, ChevronUp, FlaskConical } from 'lucide-react';
import { byCategory, byProductLine } from '@/utils/products';
import { typography } from '@/styles/brandStandards';
import ImageSkeleton from '../common/ImageSkeleton';
import OptimizedImage from '../common/OptimizedImage';
import { CHEMISTRY_ICONS, getIndustryLogo, toTitleCase, formatProductName } from '../../utils/industryHelpers';
import { useDrawer } from '@/contexts/DrawerContext';
import { useNavigate } from '@/hooks/use-navigation';
import SlideInDrawer from '../common/SlideInDrawer';
import { ImageMappingService } from '@/services/imageMappingService';
import { getAllProducts } from '@/services/productService';

interface Product {
  id: string;
  name: string;
  description?: string;
  imageUrl?: string;
  category?: string;
  industry?: string[];
  chemistry?: string;
}

interface ProductCategoryProductsSectionProps {
  productCategory: 'bond' | 'seal' | 'tape' | 'ruggedred' | string;
  onProductSelect?: (product: Product) => void;
}

const ProductCategoryProductsSection: React.FC<ProductCategoryProductsSectionProps> = ({ 
  productCategory,
  onProductSelect 
}) => {
  const navigate = useNavigate();
  // Local state for search
  const [search, setSearch] = useState('');
  const [selectedIndustries, setSelectedIndustries] = useState<string[]>([]);
  const [nameSort, setNameSort] = useState<'asc' | 'desc'>('asc');
  const [selectedChemistries, setSelectedChemistries] = useState<string[]>([]);
  const [isSearchDrawerOpen, setIsSearchDrawerOpen] = useState(false);
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
  const { setIsDrawerOpen } = useDrawer();
  const [imageLoadedStates, setImageLoadedStates] = useState<Record<string, boolean>>({});
  const [imageErrorStates, setImageErrorStates] = useState<Record<string, boolean>>({});

  // Dispatch search term updates to other islands (like the hero header) via window events
  useEffect(() => {
    const event = new CustomEvent('forza-search-update', { detail: search });
    window.dispatchEvent(event);
  }, [search]);

  // Update drawer context when drawers open/close
  useEffect(() => {
    setIsDrawerOpen(isSearchDrawerOpen || isFilterDrawerOpen);
  }, [isSearchDrawerOpen, isFilterDrawerOpen, setIsDrawerOpen]);

  // Product loading states
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [productsLoading, setProductsLoading] = useState(true);

  // Load products for the category
  useEffect(() => {
    const loadProducts = async () => {
      setProductsLoading(true);
      try {
        let products: Product[] = [];
        
        const categoryLower = productCategory.toLowerCase();
        // Force refresh from API to see new changes immediately
        console.log('🔵 [ProductCategoryProductsSection] Fetching products for:', productCategory);
        const allFetchedProducts = await getAllProducts(true);
        console.log('✅ [ProductCategoryProductsSection] Received:', allFetchedProducts.length, 'products');
        
        if (categoryLower === 'ruggedred' || categoryLower === 'cleaners') {
          products = allFetchedProducts.filter(p => p.category?.toLowerCase() === 'cleaners' || p.category?.toLowerCase() === 'ruggedred');
        } else if (categoryLower === 'bond' || categoryLower === 'seal' || categoryLower === 'tape') {
          products = allFetchedProducts.filter(p => p.category?.toLowerCase() === categoryLower);
        } else {
          products = allFetchedProducts.filter(p => p.category?.toUpperCase() === productCategory.toUpperCase());
        }
        
        console.log('📊 [ProductCategoryProductsSection] Filtered to:', products.length, 'products for category:', productCategory);
        setAllProducts(products);
      } catch (error) {
        console.error('❌ [ProductCategoryProductsSection] Failed to load products:', error);
        setAllProducts([]);
      } finally {
        setProductsLoading(false);
      }
    };

    if (productCategory) {
      loadProducts();
    }
  }, [productCategory]);

    // Filter and sort products
  const filteredProducts = useMemo(() => {
    let filtered = [...allProducts];

    // Check if searching for unfinished products
    const searchLower = search.toLowerCase();
    const isSearchingUnfinished = searchLower === 'unfinished' || searchLower === 'no image' || searchLower === 'missing image' || searchLower === 'no images';

    // Filter by image status first (unless searching for unfinished)
    if (!isSearchingUnfinished) {
      filtered = filtered.filter(product => {
        // KEEP EVERYTHING LOCALLY FOR DEBUGGING
        const isLocal = typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');
        if (isLocal) return true;

        if (!product.imageUrl || product.imageUrl.trim() === '') {
          if (product.id.toUpperCase().includes('T600')) console.log('🔍 Filtering out', product.id, ': No image URL');
          return false;
        }
        if (product.imageUrl.includes('placeholder') || product.imageUrl.includes('/placeholder')) {
          if (product.id.toUpperCase().includes('T600')) console.log('🔍 Filtering out', product.id, ': Placeholder image', product.imageUrl);
          return false;
        }
        if (product.imageUrl.includes('blob.vercel-storage.com') && (product.imageUrl.endsWith('.com') || product.imageUrl.endsWith('.com/'))) {
          if (product.id.toUpperCase().includes('T600')) console.log('🔍 Filtering out', product.id, ': Invalid blob URL', product.imageUrl);
          return false;
        }
        if (imageErrorStates[product.id] === true) {
          if (product.id.toUpperCase().includes('T600')) console.log('🔍 Filtering out', product.id, ': Image error state is true');
          return false;
        }
        if (product.id.toUpperCase().includes('T600')) console.log('🔍 T600 PASSED FILTER with URL:', product.imageUrl);
        return true;
      });
    } else {
      filtered = filtered.filter(product => 
        !product.imageUrl || 
        imageErrorStates[product.id] === true ||
        product.imageUrl.includes('placeholder') ||
        product.imageUrl.includes('/placeholder')
      );
    }

    // Filter by selected industries
    if (selectedIndustries.length > 0) {
      filtered = filtered.filter(product => {
        if (!product.industry) return false;
        const industries = Array.isArray(product.industry) ? product.industry : [product.industry];
        return industries.some(ind => 
          selectedIndustries.some(selected => 
            ind.toLowerCase() === selected.toLowerCase() ||
            ind.toLowerCase().includes(selected.toLowerCase()) ||
            selected.toLowerCase().includes(ind.toLowerCase())
          )
        );
      });
    }

    // Apply search filter (if not already filtering for unfinished)
    if (search && !isSearchingUnfinished) {
      filtered = filtered.filter(product => 
        product.name.toLowerCase().includes(searchLower) ||
        product.description?.toLowerCase().includes(searchLower) ||
        product.id.toLowerCase().includes(searchLower)
      );
    }

    // Apply chemistry filter
    if (selectedChemistries.length > 0) {
      filtered = filtered.filter(product => 
        product.chemistry && selectedChemistries.includes(product.chemistry)
      );
    }

    // Apply sorting
    const industryOrder = ['industrial', 'transportation', 'marine', 'composites', 'construction', 'insulation'];
    const getPrimaryIndustryIndex = (product: Product): number => {
      if (!product.industry) return 999;
      const industries = Array.isArray(product.industry) ? product.industry : [product.industry];
      for (const ind of industries) {
        const indLower = ind.toLowerCase();
        const index = industryOrder.indexOf(indLower);
        if (index !== -1) return index;
      }
      return 999;
    };
    
    filtered.sort((a, b) => {
      const aIndustryIndex = getPrimaryIndustryIndex(a);
      const bIndustryIndex = getPrimaryIndustryIndex(b);
      if (aIndustryIndex !== bIndustryIndex) return aIndustryIndex - bIndustryIndex;
      return nameSort === 'asc' ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name);
    });

    return filtered;
  }, [allProducts, selectedIndustries, search, selectedChemistries, nameSort, imageErrorStates]);

  const getChemistryIcon = (chemistry: string): string => {
    if (CHEMISTRY_ICONS[chemistry as keyof typeof CHEMISTRY_ICONS]) return CHEMISTRY_ICONS[chemistry as keyof typeof CHEMISTRY_ICONS];
    const normalized = chemistry.toLowerCase();
    for (const [key, icon] of Object.entries(CHEMISTRY_ICONS)) {
      if (key.toLowerCase() === normalized || key.toLowerCase().includes(normalized) || normalized.includes(key.toLowerCase())) return icon;
    }
    return CHEMISTRY_ICONS['MS'] || '/images/icons/chemistry/MS icon.svg';
  };

  const availableIndustries = useMemo(() => {
    const unique = new Set<string>();
    allProducts.forEach(product => {
      if (product.industry) {
        const industries = Array.isArray(product.industry) ? product.industry : [product.industry];
        industries.forEach(ind => unique.add(ind));
      }
    });
    const industryOrder = ['industrial', 'transportation', 'marine', 'composites', 'construction', 'insulation'];
    return Array.from(unique).sort((a, b) => {
      const aIndex = industryOrder.indexOf(a.toLowerCase());
      const bIndex = industryOrder.indexOf(b.toLowerCase());
      if (aIndex !== -1 && bIndex !== -1) return aIndex - bIndex;
      if (aIndex !== -1) return -1;
      if (bIndex !== -1) return 1;
      return a.toLowerCase().localeCompare(b.toLowerCase());
    });
  }, [allProducts]);

  const chemistryTypes = useMemo(() => {
    const unique = new Set<string>(allProducts.filter(p => p.chemistry).map(p => p.chemistry!));
    return Array.from(unique).filter(chem => chem !== 'composite_adhesive').sort();
  }, [allProducts]);

  const chemistryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    allProducts.forEach(product => { if (product.chemistry) counts[product.chemistry] = (counts[product.chemistry] || 0) + 1; });
    return counts;
  }, [allProducts]);

  const industryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    allProducts.forEach(product => {
      if (product.industry) {
        const industries = Array.isArray(product.industry) ? product.industry : [product.industry];
        industries.forEach(ind => { counts[ind.toLowerCase()] = (counts[ind.toLowerCase()] || 0) + 1; });
      }
    });
    return counts;
  }, [allProducts]);

  const handleImageLoad = (productId: string) => {
    setImageLoadedStates(prev => ({ ...prev, [productId]: true }));
    setImageErrorStates(prev => ({ ...prev, [productId]: false }));
  };

  const handleImageError = (productId: string, e: React.SyntheticEvent<HTMLImageElement>) => {
    const target = e.target as HTMLImageElement;
    const retryKey = `retry_${productId}`;
    const retryCount = parseInt(sessionStorage.getItem(retryKey) || '0');
    if ((target.src.includes('vercel-storage') || target.src.includes('blob')) && retryCount < 2) {
      // First, try if it's a "missing product mockup" that was just added locally
      const product = allProducts.find(p => p.id === productId);
      if (product && retryCount === 0) {
        // Try the local mockup folder
        const localPath = `/images/missing product mockups/${productId.toUpperCase()} ${product.name.replace(/ - /g, ' ')}.webp`;
        sessionStorage.setItem(retryKey, '1');
        target.src = localPath;
        return;
      }

      const mappedImage = ImageMappingService.getImageForProduct(productId);
      if (mappedImage && !target.src.includes(encodeURIComponent(mappedImage)) && !target.src.endsWith(mappedImage)) {
        const baseUrl = 'https://jw4to4yw6mmciodr.public.blob.vercel-storage.com';
        const blobPath = mappedImage.includes('/') ? `product-images-web-optimized/${mappedImage}` : `product-images-web-optimized/Industrial/${mappedImage}`;
        sessionStorage.setItem(retryKey, String(retryCount + 1));
        target.src = `${baseUrl}/${blobPath}`;
        return;
      }
    }
    sessionStorage.removeItem(retryKey);
    setImageErrorStates(prev => ({ ...prev, [productId]: true }));
    setImageLoadedStates(prev => ({ ...prev, [productId]: true }));
  };

  const getCategoryTitle = (category: string): string => {
    const categoryLower = category.toLowerCase();
    switch (categoryLower) {
      case 'bond': return 'Adhesive';
      case 'seal': return 'Sealant';
      case 'ruggedred': return 'Cleaning';
      default: return toTitleCase(category);
    }
  };

  const formattedCategoryTitle = getCategoryTitle(productCategory);

  return (
    <section className="bg-white text-gray-900 relative z-[30] pt-4 md:pt-6" style={{ paddingBottom: 'clamp(2rem, 4vw, 4rem)' }}>
      <div className="max-w-[1600px] mx-auto" style={{ paddingLeft: 'clamp(1rem, 2vw, 2rem)', paddingRight: 'clamp(1rem, 2vw, 2rem)' }}>
        <motion.div className="text-center" style={{ marginBottom: 'clamp(2rem, 4vw, 3rem)' }} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8, ease: "easeOut" }}>
          <h2 className="font-normal font-poppins leading-tight text-[#1b3764] break-words normal-case" style={{ fontSize: 'clamp(22px, 2vw + 0.5rem, 44px)' }}>
            {formattedCategoryTitle} Products
          </h2>
        </motion.div>

        <div className="flex flex-col lg:flex-row lg:items-start" style={{ gap: 'clamp(1rem, 2vw, 1.5rem)', marginTop: '0.5rem' }}>
          <aside className="flex-shrink-0 lg:sticky lg:top-[80px] xl:top-[100px] lg:z-30" style={{ width: 'clamp(12rem, 15vw, 14rem)', alignSelf: 'flex-start' }}>
            <div className="hidden lg:block bg-gradient-to-r from-[#477197] to-[#2c476e] rounded-lg shadow-lg border border-gray-300 p-1.5 mb-2">
              <div className="relative">
                <div className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/20 p-0.5 rounded-full">
                  <Search className="text-white h-3 w-3" />
                </div>
                <input placeholder="Search products…" value={search} onChange={e => setSearch(e.target.value)} className="w-full bg-white/10 text-white placeholder-white/60 pl-7 py-1.5 text-xs border border-white/30 focus:border-white/50 focus:outline-none focus:ring-1 focus:ring-white/30 rounded-lg" />
                {search && <button onClick={() => setSearch('')} className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 p-1 rounded-full transition-colors"><X className="text-white h-3 w-3" /></button>}
              </div>
            </div>

            <div className="hidden lg:block bg-gradient-to-r from-[#477197] to-[#2c476e] shadow-lg rounded-lg border border-gray-300 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 160px)' }}>
              <div className="p-2 border-b border-white/20"><h3 className="font-poppins font-regular text-xs text-white" style={{ fontFamily: typography.headings.fontFamily, fontWeight: typography.headings.fontWeight }}>Filter & Sort</h3></div>
              <div className="p-2 space-y-2">
                {availableIndustries.length > 0 && (
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between"><h4 className="text-xs font-semibold text-white">Industry</h4>{selectedIndustries.length > 0 && <button onClick={() => setSelectedIndustries([])} className="text-xs text-white hover:text-white/80 bg-white/10 hover:bg-white/20 py-0.5 px-1 rounded-md">Clear</button>}</div>
                    <div className="grid grid-cols-1 gap-1">
                      {availableIndustries.map(industry => {
                        const isSelected = selectedIndustries.includes(industry);
                        const count = industryCounts[industry.toLowerCase()] || 0;
                        return (
                          <button key={industry} onClick={() => isSelected ? setSelectedIndustries(selectedIndustries.filter(i => i !== industry)) : setSelectedIndustries([...selectedIndustries, industry])} className={`w-full flex items-center justify-between p-1 rounded-md transition-all overflow-hidden ${isSelected ? 'bg-[#F2611D] text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
                            <span className="text-xs font-medium capitalize">{industry.replace(/_/g, ' ')}</span>
                            <span className="text-xs opacity-70">({count})</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
                <div className="space-y-1.5"><div className="flex items-center"><ArrowUpDown className="text-white h-3 w-3 mr-1" /><h4 className="text-xs font-semibold text-white">Sort By Name</h4></div><div className="flex rounded-md overflow-hidden"><button onClick={() => setNameSort('asc')} className={`flex-1 flex items-center justify-center gap-1 py-1 transition-all ${nameSort === 'asc' ? 'bg-[#F2611D] text-white' : 'bg-white/10 text-white hover:bg-white/20'}`}><ChevronUp className="h-3 w-3" /><span className="text-xs font-medium">A-Z</span></button><button onClick={() => setNameSort('desc')} className={`flex-1 flex items-center justify-center gap-1 py-1 transition-all ${nameSort === 'desc' ? 'bg-[#F2611D] text-white' : 'bg-white/10 text-white hover:bg-white/20'}`}><ChevronDown className="h-3 w-3" /><span className="text-xs font-medium">Z-A</span></button></div></div>
                {chemistryTypes.length > 0 && (
                  <div className="space-y-1.5 border-t border-white/20 pt-2">
                    <div className="flex justify-between items-center"><div className="flex items-center"><FlaskConical className="text-white h-3 w-3 mr-1" /><h4 className="text-xs font-semibold text-white">Chemistry</h4></div>{selectedChemistries.length > 0 && <button onClick={() => setSelectedChemistries([])} className="text-xs text-white hover:text-white/80 bg-white/10 hover:bg-white/20 py-0.5 px-1 rounded-md">Clear</button>}</div>
                    <div className="flex flex-col gap-1.5">
                      {chemistryTypes.map(chemistry => {
                        const isSelected = selectedChemistries.includes(chemistry);
                        const count = chemistryCounts[chemistry] || 0;
                        return (
                          <button key={chemistry} onClick={() => isSelected ? setSelectedChemistries(selectedChemistries.filter(c => c !== chemistry)) : setSelectedChemistries([...selectedChemistries, chemistry])} disabled={count === 0 && !isSelected} className={`w-full flex items-center justify-between p-1.5 rounded-md transition-all overflow-hidden border ${isSelected ? 'bg-[#F2611D] text-white shadow-lg border-[#F2611D]' : 'bg-white/10 text-white hover:bg-white/20 hover:shadow-md border-white/20'} ${count === 0 && !isSelected ? 'opacity-50' : ''}`}>
                            <div className="flex items-center gap-1.5 min-w-0 flex-1 text-left">
                              <div className="w-5 h-5 flex-shrink-0 flex items-center justify-center"><OptimizedImage src={getChemistryIcon(chemistry)} alt={chemistry} width={48} height={48} className="w-5 h-5 object-contain chemistry-icon" onError={(e) => { e.currentTarget.src = CHEMISTRY_ICONS['MS'] || '/images/icons/chemistry/MS icon.svg'; }} /></div>
                              <span className="text-xs font-medium break-words whitespace-normal leading-tight">{chemistry.replace(/_/g, ' ')}</span>
                            </div>
                            <span className="text-xs opacity-70">({count})</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </aside>

          <div className="flex-1">
            <div className="flex items-center justify-center mb-6 relative lg:hidden">
              <div className="flex items-center gap-1 absolute left-0 z-10"><button onClick={() => setIsSearchDrawerOpen(true)} className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors" aria-label="Search"><Search className="w-5 h-5 text-[#1B3764]" /></button><button onClick={() => setIsFilterDrawerOpen(true)} className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors" aria-label="Filter"><Filter className="w-5 h-5 text-[#1B3764]" /></button></div>
              <div className="bg-[#F2611D] px-4 py-1.5 rounded-full relative z-20"><p className="text-sm text-white font-poppins font-medium"><span className="font-semibold">{filteredProducts.length}</span> products found</p></div>
            </div>

            <div className="hidden lg:flex justify-between items-center mb-6"><div className="bg-gray-100 px-4 py-2 rounded-full border border-gray-300 shadow-sm"><p className="text-sm text-gray-700"><span className="font-semibold text-gray-900">{filteredProducts.length}</span> products found{selectedChemistries.length > 0 && <span className="hidden sm:inline"> • <span className="font-semibold text-gray-900">{selectedChemistries.length}</span> {selectedChemistries.length === 1 ? 'chemistry' : 'chemistries'}</span>}</p></div></div>

            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4" style={{ gap: 'clamp(1.5rem, 3vw, 2.5rem)' }}>
                <AnimatePresence mode="popLayout">
                  {filteredProducts.map((product, idx) => (
                    <motion.div key={product.id} initial={{ opacity: 0, y: 20, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -20, scale: 0.95 }} transition={{ duration: 0.3, delay: Math.min(idx * 0.03, 0.3) }} layout className="group">
                      <div className="relative overflow-hidden transition-all duration-500 hover:scale-[1.02] h-[280px] md:h-[340px] rounded-xl md:rounded-2xl bg-gradient-to-b from-[#477197] to-[#2c476e] border border-gray-200 hover:border-gray-300 shadow-lg flex flex-col">
                        <div className="flex-1 relative pb-16 md:pb-24 cursor-pointer" style={{ transform: 'translateY(-3%) scale(0.85)' }} onClick={() => navigate(`/products/${productCategory}/${product.id}`)}>
                          {(!imageLoadedStates[product.id] || imageErrorStates[product.id]) && <ImageSkeleton />}
                          {!imageErrorStates[product.id] && <OptimizedImage src={product.imageUrl || ''} alt={product.name} width={256} height={256} mobileWidth={192} sizes="(max-width: 640px) 150px, 189px" className={`w-full h-full object-contain transition-all duration-500 group-hover:scale-105 ${imageLoadedStates[product.id] ? 'opacity-100' : 'opacity-0'}`} onLoad={() => handleImageLoad(product.id)} onError={(e) => handleImageError(product.id, e)} />}
                        </div>
                        <div className="p-2.5 absolute bottom-0 left-0 right-0"><div className="space-y-0.5"><h3 className="text-sm font-poppins font-bold leading-tight line-clamp-2 text-white">{formatProductName(product.name || '')}</h3><div className="flex gap-1.5 mt-2 pt-2"><a href={`/products/${productCategory}/${product.id}`} onClick={(e) => e.stopPropagation()} className="flex-1 inline-flex items-center justify-center bg-[#F2611D] hover:bg-[#d9551a] text-white rounded-full px-3 py-1.5 text-xs font-medium transition-all duration-300">Details</a></div></div></div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-16 text-center"><div className="mb-4"><Search className="h-16 w-16 text-gray-400" /></div><h3 className="text-xl font-semibold text-gray-900 mb-2">No products found</h3><p className="text-gray-600 mb-6">Try adjusting your filters or search terms</p><button onClick={() => { setSearch(''); setSelectedChemistries([]); setSelectedIndustries([]); }} className="px-4 md:px-5 py-2 md:py-2.5 bg-[#F2611D] hover:bg-[#d9551a] text-white rounded-full text-xs sm:text-sm font-normal font-poppins transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105">Clear All Filters</button></div>
            )}
          </div>
        </div>

        <SlideInDrawer isOpen={isSearchDrawerOpen} onClose={() => setIsSearchDrawerOpen(false)} title="Search" side="right">
          <div className="relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" /><input type="text" placeholder="Search products…" value={search} onChange={(e) => setSearch(e.target.value)} className="w-full bg-gray-50 border border-gray-300 text-[#1B3764] px-10 py-3 rounded-lg text-sm font-poppins focus:outline-none focus:ring-2 focus:ring-[#F2611D] focus:border-transparent" />{search && <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 hover:bg-gray-200 rounded-full transition-colors"><X className="w-4 h-4 text-gray-600" /></button>}</div>
        </SlideInDrawer>

        <SlideInDrawer isOpen={isFilterDrawerOpen} onClose={() => setIsFilterDrawerOpen(false)} title="Filter & Settings" side="right">
          <div className="space-y-4">
            <div><h4 className="text-sm font-poppins font-semibold text-gray-700 mb-2">Sort By Name</h4><div className="flex gap-2"><button onClick={() => setNameSort('asc')} className={`flex-1 py-1.5 px-2.5 rounded-lg text-center text-sm font-medium transition-all ${nameSort === 'asc' ? 'bg-[#F2611D] text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>A-Z</button><button onClick={() => setNameSort('desc')} className={`flex-1 py-1.5 px-2.5 rounded-lg text-center text-sm font-medium transition-all ${nameSort === 'desc' ? 'bg-[#F2611D] text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>Z-A</button></div></div>
            {availableIndustries.length > 0 && (
              <div><div className="flex items-center justify-between mb-2"><h4 className="text-sm font-poppins font-semibold text-gray-700">Industry</h4>{selectedIndustries.length > 0 && <button onClick={() => setSelectedIndustries([])} className="text-xs text-gray-600 hover:text-gray-800">Clear</button>}</div><div className="space-y-1.5">
                {availableIndustries.map(industry => {
                  const isSelected = selectedIndustries.includes(industry);
                  const count = allProducts.filter(p => {
                    if (!p.industry) return false;
                    const industries = Array.isArray(p.industry) ? p.industry : [p.industry];
                    return industries.some(ind => ind.toLowerCase() === industry.toLowerCase() || ind.toLowerCase().includes(industry.toLowerCase()) || industry.toLowerCase().includes(ind.toLowerCase()));
                  }).length;
                  return (
                    <button key={industry} onClick={() => isSelected ? setSelectedIndustries(selectedIndustries.filter(i => i !== industry)) : setSelectedIndustries([...selectedIndustries, industry])} className={`w-full flex items-center justify-between p-1.5 rounded-lg transition-all ${isSelected ? 'bg-[#F2611D] text-white' : 'bg-gray-50 text-gray-700 hover:bg-gray-100'}`}><span className="text-xs font-medium capitalize">{industry.replace(/_/g, ' ')}</span><span className="text-xs opacity-70">({count})</span></button>
                  );
                })}
              </div></div>
            )}
            {chemistryTypes.length > 0 && (
              <div><div className="flex items-center justify-between mb-2"><h4 className="text-sm font-poppins font-semibold text-gray-700">Chemistry</h4>{selectedChemistries.length > 0 && <button onClick={() => setSelectedChemistries([])} className="text-xs text-gray-600 hover:text-gray-800">Clear</button>}</div><div className="space-y-1.5">
                {chemistryTypes.map(chemistry => {
                  const isSelected = selectedChemistries.includes(chemistry);
                  const count = allProducts.filter(p => p.chemistry === chemistry).length;
                  return (
                    <button key={chemistry} onClick={() => isSelected ? setSelectedChemistries(selectedChemistries.filter(c => c !== chemistry)) : setSelectedChemistries([...selectedChemistries, chemistry])} disabled={count === 0 && !isSelected} className={`w-full flex items-center justify-between p-1.5 rounded-lg transition-all ${isSelected ? 'bg-[#F2611D] text-white' : 'bg-gray-50 text-gray-700 hover:bg-gray-100'} ${count === 0 && !isSelected ? 'opacity-50 cursor-not-allowed' : ''}`}><div className="flex items-center gap-2 min-w-0 flex-1"><div className="w-5 h-5 flex-shrink-0 flex items-center justify-center"><OptimizedImage src={getChemistryIcon(chemistry)} alt={chemistry} width={40} height={40} className="w-5 h-5 object-contain chemistry-icon" onError={(e) => { e.currentTarget.src = CHEMISTRY_ICONS['MS'] || '/images/icons/chemistry/MS icon.svg'; }} /></div><span className="text-xs font-medium truncate">{chemistry.replace(/_/g, ' ')}</span></div><span className="text-xs opacity-70 flex-shrink-0">({count})</span></button>
                  );
                })}
              </div></div>
            )}
          </div>
        </SlideInDrawer>
      </div>
    </section>
  );
};

export default ProductCategoryProductsSection;
