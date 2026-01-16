import React from 'react';
import { GradientModeProvider } from '@/contexts/GradientModeContext';
import { BookViewerProvider } from '@/contexts/BookViewerContext';
import { DrawerProvider } from '@/contexts/DrawerContext';
import { AuthProvider } from '@/contexts/AuthContext';
import { ProductSearchProvider } from '@/contexts/ProductSearchContext';

interface ProvidersProps {
  children: React.ReactNode;
}

export const Providers: React.FC<ProvidersProps> = ({ children }) => {
  return (
    <AuthProvider>
      <GradientModeProvider>
        <DrawerProvider>
          <BookViewerProvider>
            <ProductSearchProvider>
              {children}
            </ProductSearchProvider>
          </BookViewerProvider>
        </DrawerProvider>
      </GradientModeProvider>
    </AuthProvider>
  );
};




