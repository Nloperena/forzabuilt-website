import React, { createContext, useContext, useState } from 'react';

interface DrawerContextType {
  isDrawerOpen: boolean;
  setIsDrawerOpen: (open: boolean) => void;
}

const DrawerContext = createContext<DrawerContextType | undefined>(undefined);

export const DrawerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  return (
    <DrawerContext.Provider value={{ isDrawerOpen, setIsDrawerOpen }}>
      {children}
    </DrawerContext.Provider>
  );
};

export const useDrawer = () => {
  const context = useContext(DrawerContext);
  if (context === undefined) {
    return {
      isDrawerOpen: false,
      setIsDrawerOpen: () => {},
    };
  }
  return context;
};

