'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { Liff } from '@line/liff';

interface LiffContextType {
  liff: Liff | null;
  liffError: string | null;
  isLoggedIn: boolean;
  isInClient: boolean;
  isReady: boolean;
}

const LiffContext = createContext<LiffContextType>({
  liff: null,
  liffError: null,
  isLoggedIn: false,
  isInClient: false,
  isReady: false,
});

export const useLiff = () => useContext(LiffContext);

interface LiffProviderProps {
  children: React.ReactNode;
  liffId: string;
}

export const LiffProvider: React.FC<LiffProviderProps> = ({ children, liffId }) => {
  const [liff, setLiff] = useState<Liff | null>(null);
  const [liffError, setLiffError] = useState<string | null>(null);
  const [isReady, setIsReady] = useState(false);

  const initLiff = useCallback(async () => {
    try {
      const liffModule = await import('@line/liff');
      const liffInstance = liffModule.default;
      
      console.log('初始化 LIFF...');
      await liffInstance.init({ liffId });
      console.log('LIFF 初始化成功');
      
      setLiff(liffInstance);
      setIsReady(true);
    } catch (error) {
      console.error('LIFF 初始化失敗:', error);
      setLiffError((error as Error).toString());
      setIsReady(true);
    }
  }, [liffId]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      initLiff();
    }
  }, [initLiff]);

  const value = {
    liff,
    liffError,
    isLoggedIn: liff?.isLoggedIn() || false,
    isInClient: liff?.isInClient() || false,
    isReady,
  };

  return <LiffContext.Provider value={value}>{children}</LiffContext.Provider>;
};
