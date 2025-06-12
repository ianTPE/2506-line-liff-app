// 茶飲應用自定義 Hooks

import { useState, useEffect, useCallback, useRef } from 'react';
import { useTeaApp } from '../providers/TeaAppProvider';
import { showToast } from '../utils';

/**
 * 購物車操作 Hook
 */
export const useCart = () => {
  const { cartItems, cartCount, cartTotal, addToCart, updateCartItem, removeFromCart, clearCart } = useTeaApp();

  const addItemWithToast = useCallback((item: any) => {
    addToCart(item);
    showToast('已加入購物車！', 'success');
  }, [addToCart]);

  const removeItemWithConfirm = useCallback((itemId: string, itemName: string) => {
    if (confirm(`確定要移除「${itemName}」嗎？`)) {
      removeFromCart(itemId);
      showToast('商品已移除', 'info');
    }
  }, [removeFromCart]);

  const clearCartWithConfirm = useCallback(() => {
    if (cartItems.length === 0) return;
    
    if (confirm('確定要清空購物車嗎？')) {
      clearCart();
      showToast('購物車已清空', 'info');
    }
  }, [clearCart, cartItems.length]);

  return {
    cartItems,
    cartCount,
    cartTotal,
    addToCart: addItemWithToast,
    updateCartItem,
    removeFromCart: removeItemWithConfirm,
    clearCart: clearCartWithConfirm,
    isEmpty: cartItems.length === 0,
  };
};

/**
 * 本地儲存 Hook
 */
export const useLocalStorage = <T>(key: string, initialValue: T) => {
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === 'undefined') {
      return initialValue;
    }
    
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  const setValue = useCallback((value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  }, [key, storedValue]);

  const removeValue = useCallback(() => {
    try {
      setStoredValue(initialValue);
      if (typeof window !== 'undefined') {
        window.localStorage.removeItem(key);
      }
    } catch (error) {
      console.error(`Error removing localStorage key "${key}":`, error);
    }
  }, [key, initialValue]);

  return [storedValue, setValue, removeValue] as const;
};

/**
 * 防抖 Hook
 */
export const useDebounce = <T>(value: T, delay: number): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

/**
 * 網路狀態 Hook
 */
export const useNetworkStatus = () => {
  const [isOnline, setIsOnline] = useState(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );

  useEffect(() => {
    const updateNetworkStatus = () => setIsOnline(navigator.onLine);

    window.addEventListener('online', updateNetworkStatus);
    window.addEventListener('offline', updateNetworkStatus);

    return () => {
      window.removeEventListener('online', updateNetworkStatus);
      window.removeEventListener('offline', updateNetworkStatus);
    };
  }, []);

  return isOnline;
};

/**
 * 計時器 Hook
 */
export const useTimer = (initialTime: number = 0) => {
  const [time, setTime] = useState(initialTime);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const start = useCallback(() => {
    if (!isRunning) {
      setIsRunning(true);
      intervalRef.current = setInterval(() => {
        setTime(prevTime => prevTime + 1);
      }, 1000);
    }
  }, [isRunning]);

  const stop = useCallback(() => {
    if (isRunning && intervalRef.current) {
      setIsRunning(false);
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, [isRunning]);

  const reset = useCallback(() => {
    stop();
    setTime(initialTime);
  }, [stop, initialTime]);

  const restart = useCallback(() => {
    reset();
    start();
  }, [reset, start]);

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return {
    time,
    isRunning,
    start,
    stop,
    reset,
    restart,
    formattedTime: `${Math.floor(time / 60)}:${(time % 60).toString().padStart(2, '0')}`,
  };
};

/**
 * 訂單狀態追蹤 Hook
 */
export const useOrderTracking = (orderId?: string) => {
  const [orderStatus, setOrderStatus] = useState<'pending' | 'processing' | 'ready' | 'completed'>('pending');
  const [estimatedTime, setEstimatedTime] = useState<number>(15); // 分鐘

  useEffect(() => {
    if (!orderId) return;

    // 模擬訂單狀態更新
    const updateStatus = () => {
      const statuses: Array<'pending' | 'processing' | 'ready' | 'completed'> = 
        ['pending', 'processing', 'ready', 'completed'];
      const currentIndex = statuses.indexOf(orderStatus);
      
      if (currentIndex < statuses.length - 1) {
        setTimeout(() => {
          setOrderStatus(statuses[currentIndex + 1]);
          setEstimatedTime(prev => Math.max(0, prev - 5));
        }, 5000); // 每5秒更新一次狀態
      }
    };

    updateStatus();
  }, [orderId, orderStatus]);

  const getStatusText = () => {
    switch (orderStatus) {
      case 'pending': return '訂單確認中';
      case 'processing': return '製作中';
      case 'ready': return '可取餐';
      case 'completed': return '已完成';
      default: return '未知狀態';
    }
  };

  const getStatusColor = () => {
    switch (orderStatus) {
      case 'pending': return 'text-orange-600';
      case 'processing': return 'text-blue-600';
      case 'ready': return 'text-green-600';
      case 'completed': return 'text-gray-600';
      default: return 'text-gray-400';
    }
  };

  return {
    orderStatus,
    estimatedTime,
    statusText: getStatusText(),
    statusColor: getStatusColor(),
    isReady: orderStatus === 'ready',
    isCompleted: orderStatus === 'completed',
  };
};

/**
 * 表單驗證 Hook
 */
export const useFormValidation = <T extends Record<string, any>>(
  initialValues: T,
  validationRules: Record<keyof T, (value: any) => string | null>
) => {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});
  const [touched, setTouched] = useState<Partial<Record<keyof T, boolean>>>({});

  const setValue = useCallback((field: keyof T, value: any) => {
    setValues(prev => ({ ...prev, [field]: value }));
    
    // 即時驗證
    if (touched[field]) {
      const error = validationRules[field]?.(value);
      setErrors(prev => ({ ...prev, [field]: error || undefined }));
    }
  }, [validationRules, touched]);

  const setTouched = useCallback((field: keyof T) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    
    // 驗證該欄位
    const error = validationRules[field]?.(values[field]);
    setErrors(prev => ({ ...prev, [field]: error || undefined }));
  }, [validationRules, values]);

  const validateAll = useCallback(() => {
    const newErrors: Partial<Record<keyof T, string>> = {};
    let isValid = true;

    Object.keys(validationRules).forEach(field => {
      const error = validationRules[field as keyof T](values[field as keyof T]);
      if (error) {
        newErrors[field as keyof T] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    setTouched(Object.keys(values).reduce((acc, key) => ({ ...acc, [key]: true }), {}));
    
    return isValid;
  }, [validationRules, values]);

  const reset = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
  }, [initialValues]);

  return {
    values,
    errors,
    touched,
    setValue,
    setTouched,
    validateAll,
    reset,
    isValid: Object.keys(errors).length === 0,
  };
};

/**
 * 媒體查詢 Hook
 */
export const useMediaQuery = (query: string) => {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const mediaQuery = window.matchMedia(query);
    setMatches(mediaQuery.matches);

    const handler = (event: MediaQueryListEvent) => setMatches(event.matches);
    
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, [query]);

  return matches;
};

/**
 * 響應式設計輔助 Hook
 */
export const useResponsive = () => {
  const isMobile = useMediaQuery('(max-width: 768px)');
  const isTablet = useMediaQuery('(min-width: 769px) and (max-width: 1024px)');
  const isDesktop = useMediaQuery('(min-width: 1025px)');
  const isSmallMobile = useMediaQuery('(max-width: 375px)');

  return {
    isMobile,
    isTablet,
    isDesktop,
    isSmallMobile,
    screenSize: isMobile ? 'mobile' : isTablet ? 'tablet' : 'desktop',
  };
};
