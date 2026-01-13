import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGradientMode } from '@/contexts/GradientModeContext';
import { useBookViewer } from '@/contexts/BookViewerContext';
import { useLocation } from '@/hooks/use-location';
import Logo from '@/components/Header/Logo';
import SearchBar from '@/components/Header/SearchBar';
import { industries as industriesData } from '@/data/industries';

const toTitleCase = (text: string) => text
  ? text.toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase())
  : text;

type MenuItem = { label: string; href: string; iconSrc?: string };

const productsItems: MenuItem[] = [
  { label: 'Adhesives', href: '/products/bond' },
  { label: 'Sealants', href: '/products/seal' },
  { label: 'Tapes', href: '/products/tape' },
  { label: 'Cleaners', href: '/products/ruggedred' },
];

const industriesItems: MenuItem[] = industriesData.slice(0, 6).map((ind) => ({
  label: ind.title,
  href: `/industries/${ind.title.toLowerCase().replace(/ /g, '-')}`,
  iconSrc: ind.logo,
}));

interface CompactDropdownProps {
  items: MenuItem[];
  variant?: 'default' | 'industries';
  isOpen: boolean;
}

/**
 * Compact Dropdown - Uses consistent small sizing across all breakpoints
 * Mobile size is maintained for all displays for consistency
 */
const CompactDropdown: React.FC<CompactDropdownProps> = ({ items, variant = 'default', isOpen }) => {
  const gridCols = variant === 'industries' ? 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-6' : 'grid-cols-2 lg:grid-cols-4';
  const dropdownWidth = variant === 'industries' 
    ? 'w-screen sm:w-[420px] md:w-[520px] lg:w-[600px] xl:w-[650px]'
    : 'w-screen sm:w-[240px] md:w-[280px] lg:w-[340px]';

  const handleItemClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // Dropdown stays open, prevents navigation
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className={`absolute left-1/2 -translate-x-1/2 top-full mt-0 ${dropdownWidth} max-h-[90vh] overflow-y-auto bg-[#2c476e] text-white shadow-2xl border-x border-b border-white/10 border-t-0 overflow-hidden rounded-lg z-[100]`}
        >
          <div className={`grid ${gridCols} gap-0`}>
            {items.map((it, idx) => (
              <motion.div
                key={it.label}
                initial={{ opacity: 0, y: -20, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.9 }}
                transition={{ duration: 0.2, delay: idx * 0.03 }}
              >
                <div 
                  onClick={handleItemClick}
                  className="group relative flex flex-col items-center justify-center gap-1 py-2 sm:py-2.5 md:py-2 lg:py-2.5 px-1.5 sm:px-2 md:px-2.5 min-h-[60px] sm:min-h-[70px] md:min-h-[75px] lg:min-h-[70px] transition-colors hover:bg-[#F2611D] cursor-pointer"
                >
                  {it.iconSrc ? (
                    <img 
                      src={it.iconSrc} 
                      alt="" 
                      className="w-5 h-5 sm:w-6 sm:h-6 md:w-5 md:h-5 lg:w-6 lg:h-6 object-contain flex-shrink-0" 
                    />
                  ) : null}
                  <span className="font-poppins text-[11px] sm:text-[12px] md:text-[12px] lg:text-[12px] xl:text-[13px] 2xl:text-[13px] font-normal group-hover:font-bold text-center leading-tight break-words px-0.5 hyphens-auto">
                    {toTitleCase(it.label)}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const HeaderV4: React.FC = () => {
  const { mode } = useGradientMode();
  const { isBookOpen } = useBookViewer();
  const location = useLocation();
  const isHome = location.pathname === '/';
  const isIndustry = location.pathname.startsWith('/industries');
  
  const [isScrolled, setIsScrolled] = React.useState(false);
  const [isScrollingUp, setIsScrollingUp] = React.useState(false);
  const [lastScrollY, setLastScrollY] = React.useState(0);
  
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [pinnedDropdown, setPinnedDropdown] = useState<string | null>(null);

  React.useEffect(() => {
    const onScroll = () => {
      const currentScrollY = window.scrollY;
      setIsScrolled(currentScrollY > 8);
      
      if (window.innerWidth >= 1024) {
        if (currentScrollY > lastScrollY && currentScrollY > 100) {
          setIsScrollingUp(true);
        } else if (currentScrollY < lastScrollY) {
          setIsScrollingUp(false);
        }
      }
      
      setLastScrollY(currentScrollY);
    };
    
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [lastScrollY]);

  const isLight = mode === 'light' || mode === 'light2';

  const headerBg = (isHome || isIndustry) && !isScrolled
    ? 'bg-transparent'
    : isLight
      ? 'bg-white/90 backdrop-blur-md'
      : 'bg-[#1b3764]/70 backdrop-blur-md';
  
  const isTransparent = (isHome || isIndustry) && !isScrolled;
  const baseNavText = isTransparent ? 'text-white' : 'text-[#1B3764]';
  const headerShadow = isScrolled ? 'shadow-sm' : '';

  const positionClass = (isHome || isIndustry) ? 'fixed' : 'sticky';
  const shouldHideOnDesktop = isScrollingUp && lastScrollY > 100;
  const shouldHideForPDF = isBookOpen;

  const isCategoryPage = location.pathname.startsWith('/products/') && !location.pathname.match(/\/products\/[^/]+\/[^/]+/);
  const shouldHideNavbarLogo = (isCategoryPage && !isScrolled) || isScrolled;

  return (
    <header 
      className={`${positionClass} top-0 left-0 right-0 z-50 transition-all duration-300 ease-out ${headerBg} ${headerShadow} ${shouldHideOnDesktop ? 'lg:-translate-y-full' : ''} ${shouldHideForPDF ? '-translate-y-full' : ''}`}
    >
      <nav className="max-w-[1600px] 2xl:max-w-[1800px] mx-auto px-3 sm:px-4">
        <div className="flex items-center justify-between py-3 md:pt-12 md:pb-4 2xl:py-3">
          {/* Left logo */}
          <div className={`flex items-center relative z-30 transition-opacity duration-300 ${shouldHideNavbarLogo ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
            <Logo 
              className="h-12 md:h-14 lg:h-12 xl:h-20 2xl:h-24 w-auto" 
              isWhiteBackground={!isTransparent && (isLight || isScrolled)} 
            />
          </div>

          {/* Center nav */}
          <div className="hidden lg:flex items-center gap-1 lg:gap-1.5 xl:gap-2 2xl:gap-2.5 relative z-20">
            {/* Products */}
            <div 
              className="relative"
              onMouseEnter={() => setOpenDropdown('products')}
              onMouseLeave={() => pinnedDropdown !== 'products' && setOpenDropdown(null)}
            >
              <div 
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setPinnedDropdown(pinnedDropdown === 'products' ? null : 'products');
                  setOpenDropdown('products');
                }}
                className={`px-2 lg:px-2.5 xl:px-3 2xl:px-3 py-2 lg:py-2 xl:py-2.5 2xl:py-2.5 rounded-md font-normal text-[12px] lg:text-[12px] xl:text-[13px] 2xl:text-[13px] capitalize ${baseNavText} transition-all hover:bg-[#2c476e] hover:text-white hover:font-bold hover:shadow-lg border border-transparent cursor-pointer`}
              >
                Products ▾
              </div>
              <CompactDropdown 
                items={productsItems} 
                variant="default" 
                isOpen={openDropdown === 'products'}
              />
            </div>

            {/* Industries */}
            <div 
              className="relative"
              onMouseEnter={() => setOpenDropdown('industries')}
              onMouseLeave={() => pinnedDropdown !== 'industries' && setOpenDropdown(null)}
            >
              <a href="/industries"
                className={`px-2 lg:px-2.5 xl:px-3 2xl:px-3 py-2 lg:py-2 xl:py-2.5 2xl:py-2.5 rounded-md font-normal text-[12px] lg:text-[12px] xl:text-[13px] 2xl:text-[13px] capitalize ${baseNavText} transition-all hover:bg-[#2c476e] hover:text-white hover:font-bold hover:shadow-lg border border-transparent cursor-pointer`}
              >
                Industries ▾
              </a>
              <CompactDropdown 
                items={industriesItems} 
                variant="industries" 
                isOpen={openDropdown === 'industries'}
              />
            </div>

            <a href="/about" 
              className={`px-2 lg:px-2.5 xl:px-3 2xl:px-3 py-2 lg:py-2 xl:py-2.5 2xl:py-2.5 rounded-md font-normal text-[12px] lg:text-[12px] xl:text-[13px] 2xl:text-[13px] capitalize ${baseNavText} hover:font-bold transition-all`}
            >
              About
            </a>
            <a href="/blog" 
              className={`px-2 lg:px-2.5 xl:px-3 2xl:px-3 py-2 lg:py-2 xl:py-2.5 2xl:py-2.5 rounded-md font-normal text-[12px] lg:text-[12px] xl:text-[13px] 2xl:text-[13px] capitalize ${baseNavText} hover:font-bold transition-all`}
            >
              Blog
            </a>
          </div>

          {/* Right actions */}
          <div className="hidden lg:flex items-center gap-2 lg:gap-3 xl:gap-4 2xl:gap-4 relative z-30">
            <SearchBar isLightBackground={!isTransparent} />
            <a href="/contact" 
              className="rounded-full bg-[#F2611D] text-white px-2.5 lg:px-3 xl:px-5 2xl:px-5 py-1.5 lg:py-2 xl:py-2.5 2xl:py-2.5 text-xs lg:text-xs xl:text-sm 2xl:text-sm font-medium hover:bg-[#F2611D]/90 transition-colors"
            >
              Contact Us
            </a>
          </div>

          {/* Mobile menu button */}
          <button className="lg:hidden p-2" aria-label="Open menu">
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
            </svg>
          </button>
        </div>
      </nav>
    </header>
  );
};

export default HeaderV4;


