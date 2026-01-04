import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Download, ExternalLink } from 'lucide-react';
import BookSpread from './BookSpread';
import BookControls from './BookControls';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

// We'll dynamically import react-pdf components to avoid SSR issues
let Document: any = null;
let pdfjs: any = null;

interface BookViewerProps {
  pdfUrl: string;
  bookTitle: string;
  bookSubtitle: string;
  bookColor: string;
  onClose: () => void;
  onDownload: () => void;
  onOpenNewTab: () => void;
}

const BookViewer: React.FC<BookViewerProps> = ({
  pdfUrl,
  bookTitle,
  bookSubtitle,
  bookColor,
  onClose,
  onDownload,
  onOpenNewTab,
}) => {
  const [numPages, setNumPages] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isPdfLibLoaded, setIsPdfLibLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [zoom, setZoom] = useState<number>(1.2); // Start at 120% zoom
  const [isFirstLoad, setIsFirstLoad] = useState(true);

  // Load react-pdf dynamically on the client
  useEffect(() => {
    const loadPdfLib = async () => {
      if (typeof window !== 'undefined') {
        const reactPdf = await import('react-pdf');
        Document = reactPdf.Document;
        pdfjs = reactPdf.pdfjs;
        
        // Set up the worker for PDF.js
        pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;
        
        setIsPdfLibLoaded(true);
      }
    };
    loadPdfLib();
  }, []);

  // Handle PDF load success
  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    setIsLoading(false);
    setError(null);
    console.log(`PDF loaded successfully: ${numPages} pages`);
    // After initial pages load, disable skeleton for all future navigation
    setTimeout(() => setIsFirstLoad(false), 2000);
  };

  // Handle PDF load error
  const onDocumentLoadError = (error: Error) => {
    console.error('PDF load error:', error);
    setError('Failed to load brochure. Please try again later.');
    setIsLoading(false);
  };

  // Rest of the component...
  // (Truncated for brevity, but I'll ensure Document is only used when isPdfLibLoaded is true)
  
  if (!isPdfLibLoaded) {
    return <div className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center text-white">Loading Viewer...</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex flex-col h-screen"
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 md:p-6 border-b border-white/10 relative z-10 bg-black/20">
        <div className="flex items-center gap-4">
          <div 
            className="w-10 h-10 md:w-12 md:h-12 rounded-lg flex items-center justify-center text-white shadow-lg"
            style={{ backgroundColor: bookColor }}
          >
            <Download className="w-5 h-5 md:w-6 md:h-6" />
          </div>
          <div>
            <h2 className="text-white font-bold text-sm md:text-lg leading-tight">{bookTitle}</h2>
            <p className="text-white/60 text-[10px] md:text-xs uppercase tracking-wider mt-0.5 font-medium">{bookSubtitle}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 md:gap-4">
          <button
            onClick={onOpenNewTab}
            className="p-2 text-white/60 hover:text-white hover:bg-white/10 rounded-full transition-all"
            title="Open in new tab"
          >
            <ExternalLink className="w-5 h-5 md:w-6 md:h-6" />
          </button>
          <button
            onClick={onDownload}
            className="p-2 text-white/60 hover:text-white hover:bg-white/10 rounded-full transition-all"
            title="Download PDF"
          >
            <Download className="w-5 h-5 md:w-6 md:h-6" />
          </button>
          <button
            onClick={onClose}
            className="p-2 text-white/60 hover:text-white hover:bg-white/10 rounded-full transition-all ml-2"
            title="Close viewer"
          >
            <X className="w-6 h-6 md:w-8 md:h-8" />
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 relative overflow-hidden flex items-center justify-center p-4 md:p-8">
        <Document
          file={pdfUrl}
          onLoadSuccess={onDocumentLoadSuccess}
          onLoadError={onDocumentLoadError}
          className="max-h-full"
          loading={null}
        >
          <BookSpread 
            currentPage={currentPage}
            numPages={numPages}
            zoom={zoom}
            isFirstLoad={isFirstLoad}
          />
        </Document>

        {error && (
          <div className="absolute inset-0 flex items-center justify-center p-4 text-center">
            <div className="max-w-md bg-red-500/10 border border-red-500/20 rounded-2xl p-8 backdrop-blur-md">
              <p className="text-red-400 font-medium mb-4">{error}</p>
              <button 
                onClick={onClose}
                className="px-6 py-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
              >
                Close Viewer
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Controls */}
      <BookControls 
        currentPage={currentPage}
        numPages={numPages}
        onPageChange={setCurrentPage}
        zoom={zoom}
        onZoomChange={setZoom}
      />
    </motion.div>
  );
};

export default BookViewer;
