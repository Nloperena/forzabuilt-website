import React, { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Download, ExternalLink } from 'lucide-react';
import PageSpread from './PageSpread';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

// Dynamically import react-pdf
let Document: any = null;
let Page: any = null;
let pdfjs: any = null;

// Animated Page Counter Component
const PageCounter: React.FC<{ currentPage: number; numPages: number }> = ({ currentPage, numPages }) => {
  const [direction, setDirection] = useState<'up' | 'down'>('up');
  const [prevPage, setPrevPage] = useState(currentPage);

  useEffect(() => {
    if (currentPage > prevPage) {
      setDirection('down');
    } else if (currentPage < prevPage) {
      setDirection('up');
    }
    setPrevPage(currentPage);
  }, [currentPage, prevPage]);

  // Format page display
  const getPageDisplay = () => {
    if (currentPage === 1) {
      return `1 / ${numPages}`;
    } else {
      const rightPage = currentPage + 1 <= numPages ? currentPage + 1 : null;
      return rightPage ? `${currentPage}-${rightPage} / ${numPages}` : `${currentPage} / ${numPages}`;
    }
  };

  return (
    <div className="absolute bottom-6 right-6 z-30">
      <div
        className="text-white text-sm font-poppins px-4 py-2 rounded-lg"
        style={{
          background: 'rgba(44, 71, 110, 0.25)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          border: '1px solid rgba(71, 113, 151, 0.3)',
          boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2)',
        }}
      >
        <div className="relative h-6 overflow-hidden">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={getPageDisplay()}
              custom={direction}
              initial={{ y: direction === 'down' ? 20 : -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: direction === 'down' ? -20 : 20, opacity: 0 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className="flex items-center justify-center font-bold"
            >
              {getPageDisplay()}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

interface PDFViewerV2Props {
  pdfUrl: string;
  onClose: () => void;
  title?: string;
}

const PDFViewerV2: React.FC<PDFViewerV2Props> = ({ pdfUrl, onClose, title = 'Document Viewer' }) => {
  const [numPages, setNumPages] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isPdfLibLoaded, setIsPdfLibLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [scale, setScale] = useState(1);
  const [isMobile, setIsMobile] = useState(false);

  // Load react-pdf dynamically
  useEffect(() => {
    const loadPdfLib = async () => {
      if (typeof window !== 'undefined') {
        try {
          const reactPdf = await import('react-pdf');
          Document = reactPdf.Document;
          Page = reactPdf.Page;
          pdfjs = reactPdf.pdfjs;
          
          // Set up the worker for PDF.js
          pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;
          
          setIsPdfLibLoaded(true);
        } catch (err) {
          console.error('Failed to load PDF library:', err);
          setError('Failed to load document viewer.');
        }
      }
    };
    loadPdfLib();

    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    setIsLoading(false);
  };

  const onDocumentLoadError = (err: Error) => {
    console.error('PDF load error:', err);
    setError('Failed to load PDF. Please check your connection or try again later.');
    setIsLoading(false);
  };

  if (!isPdfLibLoaded) {
    return (
      <div className="fixed inset-0 z-[100] bg-black/90 flex flex-col items-center justify-center text-white">
        <div className="w-12 h-12 border-4 border-white/20 border-t-[#F2611D] rounded-full animate-spin mb-4"></div>
        <p className="font-poppins">Initializing Viewer...</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-[#1B3764]/95 backdrop-blur-xl flex flex-col"
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 md:p-6 border-b border-white/10 bg-white/5">
        <h2 className="text-white font-bold font-poppins truncate max-w-[60%]">{title}</h2>
        <div className="flex items-center gap-2 md:gap-4">
          <a
            href={pdfUrl}
            download
            className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-full transition-all"
            title="Download PDF"
          >
            <Download className="w-5 h-5 md:w-6 md:h-6" />
          </a>
          <button
            onClick={onClose}
            className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-full transition-all"
            title="Close viewer"
          >
            <X className="w-6 h-6 md:w-8 md:h-8" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 relative overflow-hidden flex items-center justify-center p-4">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center z-20">
            <div className="w-12 h-12 border-4 border-white/20 border-t-[#F2611D] rounded-full animate-spin"></div>
          </div>
        )}

        <Document
          file={pdfUrl}
          onLoadSuccess={onDocumentLoadSuccess}
          onLoadError={onDocumentLoadError}
          loading={null}
          className="max-h-full"
        >
          <PageSpread
            currentPage={currentPage}
            numPages={numPages}
            pageWidth={isMobile ? window.innerWidth * 0.9 : 500}
            onPageChange={setCurrentPage}
          />
        </Document>

        {error && (
          <div className="bg-red-500/20 border border-red-500/50 p-6 rounded-xl text-center max-w-md">
            <p className="text-white font-medium mb-4">{error}</p>
            <button
              onClick={onClose}
              className="px-6 py-2 bg-white text-[#1B3764] rounded-full font-bold hover:bg-gray-100 transition-colors"
            >
              Close
            </button>
          </div>
        )}

        {numPages > 0 && <PageCounter currentPage={currentPage} numPages={numPages} />}
      </div>

      {/* Navigation Controls */}
      <div className="p-6 flex items-center justify-center gap-8 bg-white/5 border-t border-white/10">
        <button
          onClick={() => setCurrentPage(prev => Math.max(1, prev - 2))}
          disabled={currentPage <= 1}
          className="text-white/70 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all"
        >
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button
          onClick={() => setCurrentPage(prev => Math.min(numPages, prev + 2))}
          disabled={currentPage >= numPages - 1}
          className="text-white/70 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all"
        >
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </motion.div>
  );
};

export default PDFViewerV2;
