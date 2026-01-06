import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Logo from '@/components/Header/Logo';
import SearchBar from '@/components/Header/SearchBar';
import { industries as industriesData } from '@/data/industries';
import { ChevronRight, X } from 'lucide-react';

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

const industriesItems: MenuItem[] = [
  { label: 'Industrial', href: '/industries/industrial', iconSrc: '/logos/Industrial-Icon.webp' },
  { label: 'Transportation', href: '/industries/transportation', iconSrc: '/logos/Transportation-Icon-2.webp' },
  { label: 'Marine', href: '/industries/marine', iconSrc: '/logos/Marine-Icon.webp' },
  { label: 'Composites', href: '/industries/composites', iconSrc: '/logos/Composite-Icon.webp' },
  { label: 'Construction', href: '/industries/construction', iconSrc: '/logos/Construction-Icon.webp' },
  { label: 'Insulation', href: '/industries/insulation', iconSrc: '/logos/Insulation-Icon.webp' },
];

interface HoverDropdownProps {
  items: MenuItem[];
  variant?: 'default' | 'industries';
}

const HoverDropdown: React.FC<HoverDropdownProps> = ({ items, variant = 'default' }) => {
  const responsiveWidth = variant === 'industries' 
    ? 'w-[640px] 2xl:w-[720px]'
    : 'w-[440px] 2xl:w-[500px]';
  
  return (
    <div className={`absolute left-1/2 -translate-x-1/2 top-full mt-0 ${responsiveWidth} rounded-lg bg-[#2c476e] text-white shadow-2xl border-x border-b border-white/10 border-t-0 overflow-hidden z-50`}> 
      {variant === 'industries' ? (
        <div className="grid grid-cols-6">
          {items.map((it, idx) => (
            <div key={it.label} style={{ opacity: 1, transform: 'none' }}>
              <a href={it.href} className={`group relative z-30 flex flex-col items-center justify-center gap-2 py-2 lg:py-2 xl:py-2 2xl:py-2.5 min-h-[80px] lg:min-h-[85px] xl:min-h-[90px] 2xl:min-h-[95px] transition-colors hover:bg-[#F2611D] cursor-pointer px-2 lg:px-2.5 xl:px-3 2xl:px-3`}>
                {it.iconSrc ? (
                  <img src={it.iconSrc} alt="" className="w-6 h-6 lg:w-6 lg:h-6 xl:w-7 xl:h-7 2xl:w-8 2xl:h-8 object-contain flex-shrink-0" />
                ) : null}
                <span className={`font-poppins font-normal group-hover:font-bold text-center leading-tight break-words px-0.5 ${
                  it.label.toLowerCase() === 'transportation' || it.label.toLowerCase() === 'construction' || it.label.toLowerCase() === 'composites'
                    ? 'text-[11px] lg:text-[11.5px] xl:text-[12px] 2xl:text-[13px]'
                    : 'text-[12px] lg:text-[12.5px] xl:text-[13px] 2xl:text-[14px]'
                }`}>{it.label}</span>
                {idx < items.length - 1 && <span className="absolute right-0 top-4 bottom-4 w-px bg-white/20" aria-hidden="true" />}
              </a>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-4">
          {items.map((it, idx) => (
            <div key={it.label} style={{ opacity: 1, transform: 'none' }}>
              <a href={it.href} className="group relative z-30 flex items-center justify-center gap-0.5 lg:gap-0.5 xl:gap-1 2xl:gap-1.5 py-2 lg:py-2 xl:py-2 2xl:py-2.5 px-3 lg:px-3 xl:px-3 2xl:px-3 min-h-[70px] lg:min-h-[75px] xl:min-h-[80px] 2xl:min-h-[85px] transition-colors hover:bg-[#F2611D] cursor-pointer">
                <span className="font-poppins text-[12px] lg:text-[13px] xl:text-[14px] 2xl:text-[15px] font-normal group-hover:font-bold">{it.label}</span>
                {idx < items.length - 1 && <span className="absolute right-0 top-4 bottom-4 w-px bg-white/20" aria-hidden="true" />}
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

interface HeaderWrapperProps {
  currentPath: string;
}

const HeaderWrapper: React.FC<HeaderWrapperProps> = ({ currentPath }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isScrollingUp, setIsScrollingUp] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [pinnedDropdown, setPinnedDropdown] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  
  const isHome = currentPath === '/';
  const isIndustry = currentPath.startsWith('/industries');
  const isAbout = currentPath === '/about';
  const isBlog = currentPath.startsWith('/blog');
  const isBlogDetail = currentPath.startsWith('/blog/') && currentPath !== '/blog';
  const isProduct = currentPath.startsWith('/products') || currentPath.startsWith('/product');
  const isProductDetail = currentPath.match(/^\/products?\/[^/]+\/[^/]+/); // Matches /products/category/id or /product/id
  const isContact = currentPath === '/contact';
  const isTools = currentPath.startsWith('/tools');
  const isCanisterReturns = currentPath === '/canister-returns';
  const isChemistries = currentPath === '/chemistries';

  // Proper mobile detection with resize listener
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    
    // Initial check
    checkMobile();
    
    // Listen for resize
    window.addEventListener('resize', checkMobile, { passive: true });
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const onScroll = () => {
      const currentScrollY = window.scrollY;
      setIsScrolled(currentScrollY > 8);
      
      // Only do hide-on-scroll behavior on desktop
      if (!isMobile) {
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
  }, [lastScrollY, isMobile]);

  useEffect(() => {
    if (mobileMenuOpen) {
      const scrollY = window.scrollY;
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
      document.body.style.overflow = 'hidden';
    } else {
      const scrollY = document.body.style.top;
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      document.body.style.overflow = '';
      if (scrollY) {
        window.scrollTo(0, parseInt(scrollY || '0') * -1);
      }
    }
    
    return () => {
      if (mobileMenuOpen) {
        const scrollY = document.body.style.top;
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.width = '';
        document.body.style.overflow = '';
        if (scrollY) {
          window.scrollTo(0, parseInt(scrollY || '0') * -1);
        }
      }
    };
  }, [mobileMenuOpen]);

  // Pages with video hero backgrounds that support transparent header
  // These pages have dark backgrounds so white text is readable
  const pagesWithVideoHero = isHome || isIndustry || isAbout || (isBlog && !isBlogDetail) || (isProduct && !isProductDetail) || isContact;
  
  // Pages that should ALWAYS have white/solid header (no video hero or light background)
  const pagesWithAlwaysWhiteHeader = isBlogDetail || isProductDetail || isTools || isCanisterReturns || isChemistries;
  
  // Transparent header behavior: same on mobile and desktop for consistency
  // If page has video hero AND not scrolled -> transparent
  // Otherwise -> white/solid
  const shouldBeTransparent = pagesWithVideoHero && !pagesWithAlwaysWhiteHeader && !isScrolled;
  
  // Determine header background
  const headerBg = pagesWithAlwaysWhiteHeader
    ? 'bg-white/90 backdrop-blur-md shadow-lg'
    : shouldBeTransparent
    ? 'bg-transparent'
    : 'bg-white/90 backdrop-blur-md shadow-lg';
  
  // Text color: white on transparent, dark on solid background
  const isTransparent = shouldBeTransparent;
  const baseNavText = isTransparent ? 'text-white' : 'text-[#1B3764]';
  const headerShadow = isScrolled || pagesWithAlwaysWhiteHeader ? 'shadow-sm' : '';
  const positionClass = 'fixed';
  
  // Only hide header on scroll for desktop (mobile always shows header)
  const shouldHideOnDesktop = !isMobile && isScrollingUp && lastScrollY > 100 && !mobileMenuOpen;

  return (
    <header data-component="header" className={`${positionClass} top-0 left-0 right-0 z-50 transition-all duration-300 ease-out ${headerBg} ${headerShadow} ${shouldHideOnDesktop ? 'lg:-translate-y-full' : ''}`}> 
      <nav className="max-w-[1600px] 2xl:max-w-[1800px] mx-auto p-4 lg:p-[0.85rem]">
        <div className="h-16 md:h-20 lg:h-16 xl:h-20 2xl:h-24 flex items-center justify-between">
          <div className="flex items-center relative z-30">
            <Logo 
              key={`logo-${isTransparent}-${isScrolled}`}
              className="h-10 md:h-12 lg:h-10 xl:h-14 2xl:h-16 w-auto" 
              isWhiteBackground={!isTransparent} 
            />
          </div>

          <div className="hidden lg:flex items-center gap-1.5 lg:gap-2.5 xl:gap-3 2xl:gap-4 relative z-20">
            <div className="relative group" onMouseLeave={() => pinnedDropdown !== 'products' && setPinnedDropdown(null)}>
              <a 
                href="/products"
                onMouseEnter={() => setPinnedDropdown('products')}
                className={`px-1.5 lg:px-2 xl:px-2.5 2xl:px-3 py-1 lg:py-1.5 xl:py-2 2xl:py-2.5 rounded-md font-normal text-[12px] lg:text-[13px] xl:text-[14px] 2xl:text-[15px] capitalize ${baseNavText} transition-all group-hover:bg-[#2c476e] group-hover:text-white group-hover:font-bold group-hover:shadow-xl group-hover:mb-0 group-hover:relative group-hover:z-10 group-hover:rounded-t-md group-hover:rounded-b-none border border-transparent cursor-pointer`}
              >
                Products ▾
              </a>
              <div className="invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-all duration-150">
                <div className="mt-0 z-20 relative">
                  <HoverDropdown items={productsItems} variant="default" />
                </div>
              </div>
            </div>

            <div className="relative group" onMouseLeave={() => pinnedDropdown !== 'industries' && setPinnedDropdown(null)}>
              <a 
                href="/industries"
                onMouseEnter={() => setPinnedDropdown('industries')}
                className={`px-1.5 lg:px-2 xl:px-2.5 2xl:px-3 py-1 lg:py-1.5 xl:py-2 2xl:py-2.5 rounded-md font-normal text-[12px] lg:text-[13px] xl:text-[14px] 2xl:text-[15px] capitalize ${baseNavText} transition-all group-hover:bg-[#2c476e] group-hover:text-white group-hover:font-bold group-hover:shadow-xl group-hover:mb-0 group-hover:relative group-hover:z-10 group-hover:rounded-t-md group-hover:rounded-b-none border border-transparent cursor-pointer`}
              >
                Industries ▾
              </a>
              <div className="invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-all duration-150">
                <div className="mt-0 z-20 relative">
                  <HoverDropdown items={industriesItems} variant="industries" />
                </div>
              </div>
            </div>

            <a href="/about" className={`px-1 lg:px-1.5 xl:px-2 py-1 lg:py-1.5 xl:py-2 rounded-md font-normal text-[12px] lg:text-[13px] xl:text-[14px] 2xl:text-[15px] capitalize ${baseNavText} hover:font-bold`}>About</a>
            <a href="/blog" className={`px-1 lg:px-1.5 xl:px-2 py-1 lg:py-1.5 xl:py-2 rounded-md font-normal text-[12px] lg:text-[13px] xl:text-[14px] 2xl:text-[15px] capitalize ${baseNavText} hover:font-bold`}>Blog</a>
          </div>

          <div className="hidden lg:flex items-center gap-2 lg:gap-3 xl:gap-4 2xl:gap-5 relative z-30">
            <div className="relative">
              <input 
                type="text" 
                placeholder="Search..." 
                className={`py-1 lg:py-1.5 xl:py-2 2xl:py-2.5 px-2.5 lg:px-3 xl:px-5 2xl:px-6 rounded-full ${isTransparent ? 'bg-white/80 text-[#1B3764] placeholder-[#1B3764]/70 border border-[#1B3764]/30' : 'bg-white/80 text-[#1B3764] placeholder-[#1B3764]/70 border border-[#1B3764]/30'} focus:outline-none focus:ring-2 focus:ring-[#F2611D] text-xs lg:text-xs xl:text-sm 2xl:text-base transition-all duration-300 ease-in-out w-32 lg:w-36 xl:w-44 2xl:w-48`}
              />
            </div>
            <a 
              href="/contact" 
              className="rounded-full bg-[#F2611D] text-white px-2.5 lg:px-3 xl:px-5 2xl:px-6 py-1 lg:py-1.5 xl:py-2 2xl:py-2.5 text-xs lg:text-xs xl:text-sm 2xl:text-base font-medium hover:bg-[#F2611D]/90"
            >
              Contact Us
            </a>
          </div>

          <button 
            className={`lg:hidden p-2 transition-colors ${baseNavText}`}
            aria-label="Open menu"
            onClick={() => setMobileMenuOpen(true)}
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" /></svg>
          </button>
        </div>
      </nav>


      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm lg:hidden"
              onClick={() => setMobileMenuOpen(false)}
            />
            
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300, mass: 0.5 }}
              className="fixed right-0 top-0 bottom-0 z-[101] w-80 sm:w-96 bg-white shadow-2xl overflow-y-auto lg:hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="sticky top-0 bg-white border-b border-gray-200 p-4 z-10 flex items-center justify-between">
                <Logo className="h-12 w-auto" isWhiteBackground={true} />
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1.5 hover:bg-gray-100 rounded-full transition-colors"
                  aria-label="Close menu"
                >
                  <X className="w-5 h-5 text-gray-600" />
                </button>
              </div>

              <div className="p-4 space-y-1">
                <div className="space-y-0.5">
                  <a
                    href="/products"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors group"
                  >
                    <span className="font-poppins font-medium text-[#1B3764] text-sm">Products</span>
                    <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-[#F2611D] transition-colors" />
                  </a>
                  <div className="ml-3 border-l-2 border-gray-100 pl-3">
                    {productsItems.map((item) => (
                      <a
                        key={item.href}
                        href={item.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className="block py-0.5 px-2 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <span className="font-poppins text-xs text-gray-700 leading-[0.5] lg:leading-normal">{item.label}</span>
                      </a>
                    ))}
                  </div>
                </div>

                <div className="space-y-0.5">
                  <a
                    href="/industries"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors group"
                  >
                    <span className="font-poppins font-medium text-[#1B3764] text-sm">Industries</span>
                    <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-[#F2611D] transition-colors" />
                  </a>
                  <div className="ml-3 border-l-2 border-gray-100 pl-3">
                    {industriesItems.slice(0, 6).map((item) => (
                      <a
                        key={item.href}
                        href={item.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center gap-2.5 py-0.5 px-2 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        {item.iconSrc && (
                          <img src={item.iconSrc} alt="" className="w-5 h-5 object-contain" />
                        )}
                        <span className="font-poppins text-xs text-gray-700 leading-[0.5] lg:leading-normal">{toTitleCase(item.label)}</span>
                      </a>
                    ))}
                  </div>
                </div>

                <a
                  href="/about"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block p-3 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <span className="font-poppins font-medium text-[#1B3764] text-sm">About</span>
                </a>

                <a
                  href="/blog"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block p-3 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <span className="font-poppins font-medium text-[#1B3764] text-sm">Blog</span>
                </a>

                <div className="pt-3 border-t border-gray-200">
                  <a
                    href="/contact"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block w-full text-center rounded-full bg-[#F2611D] text-white px-5 py-2.5 text-sm font-poppins font-medium hover:bg-[#F2611D]/90 transition-colors"
                  >
                    Contact Us
                  </a>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
};

export default HeaderWrapper;

