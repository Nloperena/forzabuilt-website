import React, { useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

interface ComingSoonModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
}

const ComingSoonModal: React.FC<ComingSoonModalProps> = ({
  isOpen,
  onClose,
  title = 'Resource Coming Soon'
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);
  const firstFocusableRef = useRef<HTMLButtonElement | null>(null);
  const lastFocusableRef = useRef<HTMLButtonElement | null>(null);

  // Prevent body scroll when modal is open (prevents layout shift)
  useEffect(() => {
    if (isOpen) {
      const scrollY = window.scrollY;
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
      document.body.style.overflow = 'hidden';
      
      previousActiveElement.current = document.activeElement as HTMLElement;
      
      setTimeout(() => {
        firstFocusableRef.current?.focus();
      }, 100);
    } else {
      const scrollY = document.body.style.top;
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      document.body.style.overflow = '';
      
      if (scrollY) {
        window.scrollTo(0, parseInt(scrollY || '0') * -1);
      }
      
      previousActiveElement.current?.focus();
    }

    return () => {
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Handle Escape key to close modal
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  // Focus trap: keep focus within modal
  const handleTabKey = useCallback((e: KeyboardEvent) => {
    if (!isOpen || e.key !== 'Tab') return;

    const focusableElements = modalRef.current?.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    if (!focusableElements || focusableElements.length === 0) return;

    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

    if (e.shiftKey) {
      if (document.activeElement === firstElement) {
        e.preventDefault();
        lastElement.focus();
      }
    } else {
      if (document.activeElement === lastElement) {
        e.preventDefault();
        firstElement.focus();
      }
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleTabKey);
    }

    return () => {
      document.removeEventListener('keydown', handleTabKey);
    };
  }, [isOpen, handleTabKey]);

  if (!isOpen && typeof document === 'undefined') {
    return null;
  }

  const modalContent = (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-md z-[9998]"
            onClick={onClose}
            aria-hidden="true"
          />
          
          {/* Modal */}
          <motion.div
            ref={modalRef}
            initial={{ opacity: 0, scale: 0.96, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 10 }}
            transition={{ duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="coming-soon-title"
            aria-describedby="coming-soon-description"
          >
            <div className="relative bg-white rounded-xl shadow-2xl max-w-lg w-full overflow-hidden border border-gray-100">
              {/* Close Button */}
              <button
                ref={firstFocusableRef}
                onClick={onClose}
                className="absolute top-4 right-4 z-10 p-1.5 rounded-lg bg-gray-50 hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#115B87] focus:ring-offset-2"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Header with Logo */}
              <div className="bg-gradient-to-br from-[#2c476e] via-[#3d4e6f] to-[#477197] px-8 pt-10 pb-8">
                <div className="flex flex-col items-center justify-center">
                  {isOpen && (
                    <img
                      src="/logos/Forza-Eagle-Logo-White.svg"
                      alt="ForzaBuilt Logo"
                      className="h-20 sm:h-24 w-auto mb-4 opacity-95"
                      loading="lazy"
                      width="120"
                      height="96"
                    />
                  )}
                  <div className="h-1 w-16 bg-white/30 rounded-full"></div>
                </div>
              </div>

              {/* Content */}
              <div className="px-8 py-10">
                <div className="text-center space-y-6">
                  {/* Title */}
                  <div>
                    <h2 
                      id="coming-soon-title"
                      className="text-3xl sm:text-4xl font-bold text-[#2c476e] mb-3"
                      style={{ fontFamily: 'Kallisto, sans-serif', fontWeight: 900 }}
                    >
                      {title}
                    </h2>
                    <div className="w-12 h-1 bg-[#F2611D] mx-auto rounded-full"></div>
                  </div>
                  
                  {/* Clock Icon */}
                  <div className="flex justify-center pt-2">
                    <div className="relative">
                      <div className="absolute inset-0 bg-[#115B87]/10 rounded-full blur-xl"></div>
                      <div className="relative inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-[#115B87] to-[#477197]">
                        <svg
                          className="w-10 h-10 text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          aria-hidden="true"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  <div className="space-y-4 pt-2">
                    <p 
                      id="coming-soon-description"
                      className="text-gray-700 leading-relaxed text-base sm:text-lg max-w-md mx-auto" 
                      style={{ fontFamily: 'Poppins, sans-serif' }}
                    >
                      This resource is currently being updated and will be available soon. 
                      We're working hard to bring you the latest information.
                    </p>
                    
                    <p className="text-sm text-gray-500 max-w-md mx-auto" style={{ fontFamily: 'Poppins, sans-serif' }}>
                      In the meantime, feel free to contact us for more information.
                    </p>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onClose();
                        window.location.href = '/contact';
                      }}
                      className="inline-flex items-center justify-center bg-[#115B87] hover:bg-[#0d4568] text-white font-semibold text-sm px-6 py-2.5 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-[#115B87] focus:ring-offset-2 min-w-[140px]"
                      style={{ fontFamily: 'Poppins, sans-serif' }}
                    >
                      Contact Us
                    </button>
                    <button
                      ref={lastFocusableRef}
                      onClick={onClose}
                      className="inline-flex items-center justify-center bg-white border-2 border-gray-200 hover:border-gray-300 text-gray-700 hover:text-gray-900 font-semibold text-sm px-6 py-2.5 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 min-w-[140px]"
                      style={{ fontFamily: 'Poppins, sans-serif' }}
                    >
                      Got It
                    </button>
                  </div>
                </div>
              </div>

              {/* Trust Indicators Footer */}
              <div className="px-8 py-5 bg-gray-50 border-t border-gray-100">
                <div className="flex items-center justify-center gap-6">
                  <div className="flex items-center gap-2 text-xs text-gray-500 pointer-events-none">
                    <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 500 }}>Made in USA</span>
                  </div>
                  <div className="h-4 w-px bg-gray-300"></div>
                  <div className="flex items-center gap-2 text-xs text-gray-500 pointer-events-none">
                    <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                      <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 500 }}>Privacy Compliant</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );

  // Use React Portal to render at document.body level (SEO: keeps modal out of main content flow)
  if (typeof document !== 'undefined') {
    return createPortal(modalContent, document.body);
  }

  return null;
};

export default ComingSoonModal;
