import React, { createContext, useContext, useState, ReactNode } from 'react';

interface ProductSearchContextType {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}

const ProductSearchContext = createContext<ProductSearchContextType | undefined>(undefined);

export const ProductSearchProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <ProductSearchContext.Provider value={{ searchTerm, setSearchTerm }}>
      {children}
    </ProductSearchContext.Provider>
  );
};

export const useProductSearch = () => {
  const context = useContext(ProductSearchContext);
  if (context === undefined) {
    throw new Error('useProductSearch must be used within a ProductSearchProvider');
  }
  return context;
};

