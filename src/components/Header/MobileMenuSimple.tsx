import React, { useState } from 'react';

import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useGradientMode } from '@/contexts/GradientModeContext';
import { getProducts } from '@/utils/products';
import { industries as industriesData } from '@/data/industries';
import SearchBar from './SearchBar';

interface MobileMenuSimpleProps {
  isOpen: boolean;
  onClose: () => void;
}

const MobileMenuSimple: React.FC<MobileMenuSimpleProps> = ({
  isOpen,
  onClose,
}) => {
  const { mode } = useGradientMode();
  const [activeSection, setActiveSection] = useState<string | null>(null);
  
  // Use blue logo for light modes, regular logo for dark modes
  const logoSrc = mode === 'light' || mode === 'light2' 
    ? '/logos/forza-logo-blue.svg' 
    : '/logos/forza-logo-full.webp';
  
  // Main navigation matching desktop
  const navigation = [
    { name: 'Products', href: '/products', hasSubmenu: true },
    { name: 'Industries', href: '/industries', hasSubmenu: true },
    { name: 'About', href: '/about', hasSubmenu: false },
    { name: 'Blog', href: '/blog', hasSubmenu: false },
  ];

  const productsData = getProducts();

  const renderProductsContent = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-[#1B3764] mb-3">Product Categories</h3>
      <div className="grid grid-cols-2 gap-3">
        <a href="/products/bond"
          onClick={onClose}
          className="flex flex-col items-center p-4 bg-[#1B3764]/5 hover:bg-[#1B3764]/10 rounded-xl transition-all duration-200 border border-[#1B3764]/10"
        >
          <img 
            src={mode === 'light' || mode === 'light2' ? '/logos/forza-bond-mb-color.svg' : '/products/brand-logos/product-line-brands-white-bond.svg'} 
            alt="Industrial Adhesives" 
            className="h-12 w-auto mb-2"
          />
          <span className="text-sm font-medium text-[#1B3764] text-center">Adhesives</span>
        </a>
        <a href="/products/seal"
          onClick={onClose}
          className="flex flex-col items-center p-4 bg-[#1B3764]/5 hover:bg-[#1B3764]/10 rounded-xl transition-all duration-200 border border-[#1B3764]/10"
        >
          <img 
            src={mode === 'light' || mode === 'light2' ? '/logos/forza-seal-mb-color.svg' : '/products/brand-logos/product-line-brands-white-seal.svg'} 
            alt="Industrial Sealants" 
            className="h-12 w-auto mb-2"
          />
          <span className="text-sm font-medium text-[#1B3764] text-center">Sealants</span>
        </a>
        <a href="/products/tape"
          onClick={onClose}
          className="flex flex-col items-center p-4 bg-[#1B3764]/5 hover:bg-[#1B3764]/10 rounded-xl transition-all duration-200 border border-[#1B3764]/10"
        >
          <img 
            src={mode === 'light' || mode === 'light2' ? '/logos/forza-tape-mb-color.svg' : '/products/brand-logos/product-line-brands-white-tape.svg'} 
            alt="Industrial Tapes" 
            className="h-12 w-auto mb-2"
          />
          <span className="text-sm font-medium text-[#1B3764] text-center">Tapes</span>
        </a>
        <a href="/products/ruggedred"
          onClick={onClose}
          className="flex flex-col items-center p-4 bg-[#1B3764]/5 hover:bg-[#1B3764]/10 rounded-xl transition-all duration-200 border border-[#1B3764]/10"
        >
          <img 
            src="/products/brand-logos/product-line-brands-white-ruggedred.svg" 
            alt="Rugged Red" 
            className="h-12 w-auto mb-2"
          />
          <span className="text-sm font-medium text-[#1B3764] text-center">Cleaning</span>
        </a>
      </div>
    </div>
  );

  const renderIndustriesContent = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-[#1B3764] mb-3">Industries We Serve</h3>
      <div className="grid grid-cols-2 gap-3">
        {industriesData.slice(0, 6).map((industry) => (
          <a
            key={industry.title} href={`/industries/${industry.title.toLowerCase().replace(/ /g, '-')}`}
            onClick={onClose}
            className="flex flex-col items-center p-4 bg-[#1B3764]/5 hover:bg-[#1B3764]/10 rounded-xl transition-all duration-200 border border-[#1B3764]/10"
          >
            <img 
              src={industry.logo} 
              alt={`${industry.title} Logo`} 
              className="h-12 w-auto mb-2"
            />
            <span className="text-sm font-medium text-[#1B3764] text-center">{industry.title}</span>
          </a>
        ))}
      </div>
    </div>
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/50"
            onClick={onClose}
          />
          
          {/* Menu Container */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed top-0 right-0 w-72 sm:w-80 h-auto z-50 bg-white shadow-2xl rounded-l-3xl border border-[#1B3764]/20"
            style={{ top: '64px', maxHeight: 'calc(100vh - 64px)' }}
          >
            {/* Header */}
            <div className="flex justify-between items-center p-4 border-b border-[#1B3764]/20">
              <a href="/" onClick={onClose} className="flex items-center">
                <img 
                  src={logoSrc} 
                  alt="Forza Built" 
                  className="h-10 w-auto object-contain"
                />
              </a>
              
              <button 
                onClick={onClose}
                className="p-1.5 text-[#1B3764]/80 hover:text-[#1B3764] transition-colors rounded-full hover:bg-[#1B3764]/10"
                aria-label="Close menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Search Bar */}
            <div className="p-4 border-b border-[#1B3764]/20">
              <SearchBar isLightBackground={true} mobile={true} />
            </div>

            {/* Navigation */}
            <div className="flex-1 overflow-y-auto">
              <nav className="p-4 space-y-0.5">
                {navigation.map((item, index) => (
                  <motion.div
                    key={item.name}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    {item.hasSubmenu ? (
                      <button
                        onClick={() => setActiveSection(activeSection === item.name.toLowerCase() ? null : item.name.toLowerCase())}
                        className="w-full flex items-center justify-between py-2.5 px-3 text-base font-semibold text-[#1B3764] hover:bg-[#1B3764]/5 rounded-xl transition-all duration-200"
                      >
                        <span>{item.name}</span>
                        <ChevronDown 
                          className={`h-4 w-4 transition-transform duration-200 ${
                            activeSection === item.name.toLowerCase() ? 'rotate-180' : ''
                          }`} 
                        />
                      </button>
                    ) : (
                      <a href={item.href}
                        onClick={onClose}
                        className="block py-2.5 px-3 text-base font-semibold text-[#1B3764] hover:bg-[#1B3764]/5 rounded-xl transition-all duration-200"
                      >
                        {item.name}
                      </a>
                    )}
                  </motion.div>
                ))}
              </nav>

              {/* Submenu Content */}
              <AnimatePresence>
                {activeSection && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="px-4 pb-4"
                  >
                    {activeSection === 'products' && renderProductsContent()}
                    {activeSection === 'industries' && renderIndustriesContent()}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-[#1B3764]/20">
              <Button asChild className="w-full bg-[#F2611D] hover:bg-[#F2611D]/90 text-white rounded-xl py-2.5 text-sm font-semibold">
                <a href="/contact" onClick={onClose}>Contact Us</a>
              </Button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default MobileMenuSimple;
