'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { useLiff } from '../../providers/LiffProvider';
import { 
  TeaAppContextType, 
  User, 
  Product, 
  CartItem, 
  Store, 
  Order, 
  ApiResponse,
  CreateOrderRequest 
} from '../../../types/tea-app';

const TeaAppContext = createContext<TeaAppContextType | null>(null);

export const useTeaApp = () => {
  const context = useContext(TeaAppContext);
  if (!context) {
    throw new Error('useTeaApp must be used within a TeaAppProvider');
  }
  return context;
};

interface TeaAppProviderProps {
  children: React.ReactNode;
}

// Bubble API 配置
const BUBBLE_API_BASE = process.env.NEXT_PUBLIC_BUBBLE_API_BASE || 'https://tea-time-app.bubbleapps.io/api/1.1/wf';

export const TeaAppProvider: React.FC<TeaAppProviderProps> = ({ children }) => {
  const { liff, isLoggedIn, isReady } = useLiff();
  
  // 狀態管理
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [selectedStore, setSelectedStore] = useState<Store | null>(null);
  const [stores, setStores] = useState<Store[]>([]);
  const [currentPage, setCurrentPage] = useState<'home' | 'cart' | 'booking' | 'member'>('home');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // 計算屬性
  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  // 從 localStorage 載入購物車
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedCart = localStorage.getItem('tea-app-cart');
      if (savedCart) {
        try {
          setCartItems(JSON.parse(savedCart));
        } catch (error) {
          console.error('Failed to load cart from localStorage:', error);
        }
      }
    }
  }, []);

  // 保存購物車到 localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('tea-app-cart', JSON.stringify(cartItems));
    }
  }, [cartItems]);

  // API 請求函數
  const apiRequest = async <T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> => {
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
        throw new Error(data.message || 'API request failed');
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

  // 註冊/更新用戶
  const registerUser = useCallback(async () => {
    if (!liff || !isLoggedIn) return;

    try {
      const profile = await liff.getProfile();
      const userData = {
        line_user_id: profile.userId,
        display_name: profile.displayName,
        picture_url: profile.pictureUrl,
      };

      const response = await apiRequest('/register-user', {
        method: 'POST',
        body: JSON.stringify(userData),
      });

      if (response.status === 'success') {
        console.log('User registered successfully');
      }
    } catch (error) {
      console.error('Failed to register user:', error);
    }
  }, [liff, isLoggedIn]);

  // 載入用戶資料
  const loadUserData = useCallback(async () => {
    if (!liff || !isLoggedIn) return;

    try {
      const profile = await liff.getProfile();
      const response = await apiRequest<User>(`/get-user-data?user_id=${profile.userId}`);
      
      if (response.status === 'success' && response.data) {
        setUser(response.data);
      } else {
        // 如果用戶不存在，創建默認用戶數據
        const defaultUser: User = {
          id: profile.userId,
          line_user_id: profile.userId,
          display_name: profile.displayName,
          membership_level: 'bronze',
          points_balance: 0,
          wallet_balance: 0,
          created_date: new Date().toISOString(),
          last_login: new Date().toISOString(),
          picture_url: profile.pictureUrl,
        };
        setUser(defaultUser);
      }
    } catch (error) {
      console.error('Failed to load user data:', error);
    }
  }, [liff, isLoggedIn]);

  // 載入商品
  const loadProducts = useCallback(async (category: string = 'all') => {
    try {
      setIsLoading(true);
      const endpoint = category === 'all' ? '/get-products' : `/get-products?category=${category}`;
      const response = await apiRequest<Product[]>(endpoint);
      
      if (response.status === 'success' && response.data) {
        setProducts(response.data);
      } else {
        // 使用模擬數據作為後備
        const mockProducts = await getMockProducts(category);
        setProducts(mockProducts);
      }
      setSelectedCategory(category);
    } catch (error) {
      console.error('Failed to load products:', error);
      const mockProducts = await getMockProducts(category);
      setProducts(mockProducts);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 載入模擬商品數據
  const getMockProducts = async (category: string): Promise<Product[]> => {
    try {
      // 動態導入配置以避免 SSR 問題
      const { MOCK_PRODUCTS } = await import('../config');
      
      return category === 'all' 
        ? MOCK_PRODUCTS 
        : MOCK_PRODUCTS.filter(product => product.category === category);
    } catch (error) {
      console.error('Failed to load mock products:', error);
      return [];
    }
  };

  // 購物車操作
  const addToCart = useCallback((item: CartItem) => {
    setCartItems(prev => {
      const existingIndex = prev.findIndex(
        cartItem => 
          cartItem.product_id === item.product_id &&
          JSON.stringify(cartItem.customizations) === JSON.stringify(item.customizations)
      );

      if (existingIndex >= 0) {
        const updated = [...prev];
        updated[existingIndex].quantity += item.quantity;
        return updated;
      } else {
        return [...prev, { ...item, id: Date.now().toString() }];
      }
    });
  }, []);

  const updateCartItem = useCallback((itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
      return;
    }
    
    setCartItems(prev => 
      prev.map(item => 
        item.id === itemId ? { ...item, quantity } : item
      )
    );
  }, []);

  const removeFromCart = useCallback((itemId: string) => {
    setCartItems(prev => prev.filter(item => item.id !== itemId));
  }, []);

  const clearCart = useCallback(() => {
    setCartItems([]);
  }, []);

  // UI 操作
  const showProductModal = useCallback((product: Product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  }, []);

  const selectStore = useCallback((store: Store) => {
    setSelectedStore(store);
  }, []);

  // 創建訂單
  const createOrder = useCallback(async (orderData: Partial<Order>): Promise<ApiResponse<Order>> => {
    if (!user || cartItems.length === 0) {
      return {
        status: 'error',
        error: 'Invalid order data',
      };
    }

    try {
      const orderRequest: CreateOrderRequest = {
        user_id: user.line_user_id,
        store_id: selectedStore?.id || 'default-store',
        items: cartItems,
        total_amount: cartTotal,
        payment_method: 'wallet',
        order_type: 'pickup_now',
        ...orderData,
      };

      const response = await apiRequest<Order>('/create-order', {
        method: 'POST',
        body: JSON.stringify(orderRequest),
      });

      if (response.status === 'success') {
        clearCart();
        
        // 發送 LINE 訊息通知
        if (liff && liff.isApiAvailable('sendMessages')) {
          try {
            await liff.sendMessages([
              {
                type: 'text',
                text: `訂單確認 🎉\n訂單編號: ${response.data?.id}\n總金額: $${cartTotal}\n預計取餐時間: 15分鐘`,
              },
            ]);
          } catch (messageError) {
            console.error('Failed to send LINE message:', messageError);
          }
        }
      }

      return response;
    } catch (error) {
      console.error('Failed to create order:', error);
      return {
        status: 'error',
        error: error instanceof Error ? error.message : 'Failed to create order',
      };
    }
  }, [user, cartItems, cartTotal, selectedStore, liff, clearCart]);

  // 初始化
  useEffect(() => {
    const initializeApp = async () => {
      if (isReady && isLoggedIn) {
        try {
          await registerUser();
          await loadUserData();
          await loadProducts();
          
          // 載入模擬門市數據
          const { MOCK_STORES } = await import('../config');
          setStores(MOCK_STORES);
          
          // 設置預設門市（選擇第一個門市）
          if (MOCK_STORES.length > 0) {
            setSelectedStore(MOCK_STORES[0]);
          }
          
        } catch (error) {
          console.error('Failed to initialize app:', error);
        } finally {
          setIsLoading(false);
        }
      }
    };
    
    initializeApp();
  }, [isReady, isLoggedIn]);

  const value: TeaAppContextType = {
    // 狀態
    user,
    isLoading,
    products,
    selectedCategory,
    cartItems,
    cartCount,
    cartTotal,
    selectedStore,
    stores,
    currentPage,
    isModalOpen,
    selectedProduct,
    
    // 方法
    loadProducts,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
    setCurrentPage,
    showProductModal,
    closeModal,
    selectStore,
    createOrder,
    loadUserData,
  };

  return (
    <TeaAppContext.Provider value={value}>
      {children}
    </TeaAppContext.Provider>
  );
};
