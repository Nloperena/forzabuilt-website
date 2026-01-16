import React, { createContext, useContext, useState } from 'react';

interface BookViewerContextType {
  isBookOpen: boolean;
  setIsBookOpen: (open: boolean) => void;
}

const BookViewerContext = createContext<BookViewerContextType | undefined>(undefined);

export const BookViewerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isBookOpen, setIsBookOpen] = useState(false);

  return (
    <BookViewerContext.Provider value={{ isBookOpen, setIsBookOpen }}>
      {children}
    </BookViewerContext.Provider>
  );
};

export const useBookViewer = () => {
  const context = useContext(BookViewerContext);
  if (context === undefined) {
    return {
      isBookOpen: false,
      setIsBookOpen: () => {},
    };
  }
  return context;
};
































