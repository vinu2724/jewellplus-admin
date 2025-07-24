"use client";
import React, { createContext, useState, useContext, ReactNode, Dispatch, SetStateAction } from 'react';

interface PageNavigationLoaderContextType {
  isPageLoading: boolean;
  setIsPageLoading: Dispatch<SetStateAction<boolean>>;
}

const PageNavigationLoaderContext = createContext<PageNavigationLoaderContextType | undefined>(undefined);

export const PageNavigationLoaderProvider = ({ children }: { children: ReactNode }) => {
  const [isPageLoading, setIsPageLoading] = useState(false);
  return (
    <PageNavigationLoaderContext.Provider value={{ isPageLoading, setIsPageLoading }}>
      {children}
    </PageNavigationLoaderContext.Provider>
  );
};

export const usePageNavigationLoader = () => {
  const context = useContext(PageNavigationLoaderContext);
  if (context === undefined) {
    throw new Error('usePageNavigationLoader must be used within a PageNavigationLoaderProvider');
  }
  return context;
};