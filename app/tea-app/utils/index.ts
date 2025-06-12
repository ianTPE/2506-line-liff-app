// 茶飲應用工具函數

import { ApiResponse } from '../../../types/tea-app';

// API 請求基礎 URL
export const BUBBLE_API_BASE = process.env.NEXT_PUBLIC_BUBBLE_API_BASE || 'https://tea-time-app.bubbleapps.io/api/1.1/wf';

/**
 * 通用 API 請求函數
 */
export const apiRequest = async <T>(
  endpoint: string, 
  options: RequestInit = {}
): Promise<ApiResponse<T>> => {
  try {
    const response = await fetch(`${BUBBLE_API_BASE}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || `HTTP error! status: ${response.status}`);
    }

    return {
      status: 'success',
      data: data,
    };
  } catch (error) {
    console.error(`API Error (${endpoint}):`, error);
    return {
      status: 'error',
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
};

/**
 * 格式化價格顯示
 */
export const formatPrice = (price: number): string => {
  return `$${price.toLocaleString()}`;
};

/**
 * 格式化時間顯示
 */
export const formatTime = (date: Date | string): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleString('zh-TW', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
};

/**
 * 格式化相對時間（例如：2小時前）
 */
export const formatRelativeTime = (date: Date | string): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diffInMinutes = Math.floor((now.getTime() - d.getTime()) / (1000 * 60));

  if (diffInMinutes < 60) {
    return `${diffInMinutes}分鐘前`;
  } else if (diffInMinutes < 1440) { // 24小時
    const hours = Math.floor(diffInMinutes / 60);
    return `${hours}小時前`;
  } else {
    const days = Math.floor(diffInMinutes / 1440);
    return `${days}天前`;
  }
};

/**
 * 取得客製化選項的顯示文字
 */
export const getCustomizationLabel = (key: string, value: string): string => {
  const labels: Record<string, Record<string, string>> = {
    sweetness: { 
      normal: '正常糖', 
      less: '少糖', 
      half: '半糖', 
      none: '無糖' 
    },
    ice: { 
      normal: '正常冰', 
      less: '少冰', 
      none: '去冰', 
      hot: '熱飲' 
    },
    topping: { 
      none: '不加料', 
      pearl: '珍珠', 
      pudding: '布丁', 
      jelly: '仙草' 
    }
  };
  return labels[key]?.[value] || value;
};

/**
 * 取得會員等級資訊
 */
export const getMembershipInfo = (level: 'bronze' | 'silver' | 'gold') => {
  const membershipLevels = {
    bronze: { 
      label: '銅卡', 
      color: 'from-orange-400 to-orange-600', 
      icon: '🥉',
      pointsRate: 1,
      benefits: ['點數回饋 1%', '生日優惠 9折']
    },
    silver: { 
      label: '銀卡', 
      color: 'from-gray-400 to-gray-600', 
      icon: '🥈',
      pointsRate: 1.5,
      benefits: ['點數回饋 1.5%', '生日優惠 9折', '預約免排隊', '每月免費升級']
    },
    gold: { 
      label: '金卡', 
      color: 'from-yellow-400 to-yellow-600', 
      icon: '🥇',
      pointsRate: 2,
      benefits: ['點數回饋 2%', '生日優惠 9折', '預約免排隊', '每週免費飲品', '新品優先體驗']
    },
  };
  return membershipLevels[level];
};

/**
 * 計算會員折扣
 */
export const calculateMemberDiscount = (
  amount: number, 
  membershipLevel: 'bronze' | 'silver' | 'gold'
): number => {
  const discountRates = {
    bronze: 0.05,   // 5%
    silver: 0.08,   // 8%
    gold: 0.10,     // 10%
  };
  
  return Math.floor(amount * discountRates[membershipLevel]);
};

/**
 * 計算點數回饋
 */
export const calculatePointsEarned = (
  amount: number, 
  membershipLevel: 'bronze' | 'silver' | 'gold'
): number => {
  const pointsRates = {
    bronze: 0.01,   // 1%
    silver: 0.015,  // 1.5%
    gold: 0.02,     // 2%
  };
  
  return Math.floor(amount * pointsRates[membershipLevel]);
};

/**
 * 生成唯一 ID
 */
export const generateUniqueId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * 防抖函數
 */
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(null, args), wait);
  };
};

/**
 * 本地儲存工具
 */
export const storage = {
  get: <T>(key: string, defaultValue?: T): T | null => {
    if (typeof window === 'undefined') return defaultValue || null;
    
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : (defaultValue || null);
    } catch (error) {
      console.error(`Error reading from localStorage:`, error);
      return defaultValue || null;
    }
  },
  
  set: <T>(key: string, value: T): void => {
    if (typeof window === 'undefined') return;
    
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Error writing to localStorage:`, error);
    }
  },
  
  remove: (key: string): void => {
    if (typeof window === 'undefined') return;
    
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error(`Error removing from localStorage:`, error);
    }
  }
};

/**
 * 取得商品分類圖標
 */
export const getCategoryIcon = (category: string): string => {
  const icons: Record<string, string> = {
    all: '🌟',
    tea: '🍵',
    coffee: '☕',
    seasonal: '🌸',
    snacks: '🧁',
  };
  return icons[category] || '🍵';
};

/**
 * 驗證電話號碼格式
 */
export const validatePhoneNumber = (phone: string): boolean => {
  const phoneRegex = /^09\d{8}$/;
  return phoneRegex.test(phone);
};

/**
 * 驗證電子郵件格式
 */
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Toast 通知工具
 */
export const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info'): void => {
  if (typeof window === 'undefined') return;

  const toast = document.createElement('div');
  toast.className = `
    fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2
    px-6 py-3 rounded-lg shadow-lg z-[10000] text-white font-medium
    ${type === 'success' ? 'bg-green-500' : ''}
    ${type === 'error' ? 'bg-red-500' : ''}
    ${type === 'info' ? 'bg-blue-500' : ''}
  `;
  toast.textContent = message;
  
  document.body.appendChild(toast);
  
  setTimeout(() => {
    if (document.body.contains(toast)) {
      document.body.removeChild(toast);
    }
  }, 3000);
};
