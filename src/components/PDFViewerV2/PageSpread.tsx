import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Dynamic import for Page
let Page: any = null;

interface PageSpreadProps {
  currentPage: number;
  numPages: number;
  pageWidth: number;
  onPageChange: (page: number) => void;
}

interface PageBoxProps {
  pageNumber: number | null;
  pageWidth: number;
  isLeft: boolean;
  isPdfLibLoaded: boolean;
}

const PageBox: React.FC<PageBoxProps> = ({ pageNumber, pageWidth, isLeft, isPdfLibLoaded }) => {
  if (pageNumber === null) {
    return <div style={{ width: pageWidth, height: pageWidth * 1.4 }} className="bg-transparent" />;
  }

  return (
    <div 
      className="bg-white shadow-2xl relative overflow-hidden"
      style={{ width: pageWidth, height: pageWidth * 1.4 }}
    >
      {isPdfLibLoaded && Page ? (
        <Page
          pageNumber={pageNumber}
          width={pageWidth}
          renderTextLayer={false}
          renderAnnotationLayer={false}
          loading={<div className="w-full h-full bg-gray-100 animate-pulse" />}
        />
      ) : (
        <div className="w-full h-full bg-gray-100 animate-pulse" />
      )}
      <div className={`absolute top-0 bottom-0 w-px bg-black/10 ${isLeft ? 'right-0' : 'left-0'}`} />
    </div>
  );
};

const PageSpread: React.FC<PageSpreadProps> = ({ currentPage, numPages, pageWidth }) => {
  const [isPdfLibLoaded, setIsPdfLibLoaded] = useState(false);

  useEffect(() => {
    const loadPdfLib = async () => {
      if (typeof window !== 'undefined') {
        const reactPdf = await import('react-pdf');
        Page = reactPdf.Page;
        setIsPdfLibLoaded(true);
      }
    };
    loadPdfLib();
  }, []);

  const leftPage = currentPage;
  const rightPage = currentPage + 1 <= numPages ? currentPage + 1 : null;

  return (
    <div className="flex items-center justify-center gap-0 perspective-1000">
      <PageBox pageNumber={leftPage} pageWidth={pageWidth} isLeft={true} isPdfLibLoaded={isPdfLibLoaded} />
      <PageBox pageNumber={rightPage} pageWidth={pageWidth} isLeft={false} isPdfLibLoaded={isPdfLibLoaded} />
    </div>
  );
};

export default PageSpread;
