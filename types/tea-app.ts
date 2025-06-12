// 茶飲應用相關類型定義

export interface Product {
  id: string;
  name: string;
  price: number;
  category: 'tea' | 'coffee' | 'seasonal' | 'snacks';
  description?: string;
  image_url?: string;
  rating?: number;
  review_count?: number;
  preparation_time?: number; // 製作時間（分鐘）
  availability_status: boolean;
}

export interface CartItem {
  id: string;
  product_id: string;
  name: string;
  price: number;
  quantity: number;
  customizations: ProductCustomizations;
  image_url?: string;
}

export interface ProductCustomizations {
  sweetness: 'normal' | 'less' | 'half' | 'none';
  ice: 'normal' | 'less' | 'none' | 'hot';
  topping: 'none' | 'pearl' | 'pudding' | 'jelly';
}

export interface Store {
  id: string;
  name: string;
  address: string;
  phone: string;
  operating_hours: string;
  current_queue_count: number;
  average_wait_time: number; // 分鐘
  coordinates?: {
    latitude: number;
    longitude: number;
  };
}

export interface Order {
  id: string;
  user_id: string;
  store_id: string;
  items: CartItem[];
  total_amount: number;
  payment_method: 'points' | 'wallet' | 'linepay' | 'credit';
  order_status: 'pending' | 'processing' | 'ready' | 'completed' | 'cancelled';
  order_type: 'pickup_now' | 'pickup_scheduled';
  scheduled_time?: string;
  created_time: string;
  completed_time?: string;
}

export interface User {
  id: string;
  line_user_id: string;
  display_name: string;
  phone_number?: string;
  email?: string;
  membership_level: 'bronze' | 'silver' | 'gold';
  points_balance: number;
  wallet_balance: number;
  created_date: string;
  last_login: string;
  picture_url?: string;
}

export interface TimeSlot {
  time: string;
  available: boolean;
  queue_count?: number;
}

export interface ApiResponse<T> {
  status: 'success' | 'error';
  data?: T;
  message?: string;
  error?: string;
}

// Context 類型
export interface TeaAppContextType {
  // 用戶狀態
  user: User | null;
  isLoading: boolean;
  
  // 商品相關
  products: Product[];
  selectedCategory: string;
  
  // 購物車相關
  cartItems: CartItem[];
  cartCount: number;
  cartTotal: number;
  
  // 門市相關
  selectedStore: Store | null;
  stores: Store[];
  
  // UI 狀態
  currentPage: 'home' | 'cart' | 'booking' | 'member';
  isModalOpen: boolean;
  selectedProduct: Product | null;
  
  // Actions
  loadProducts: (category?: string) => Promise<void>;
  addToCart: (item: CartItem) => void;
  updateCartItem: (itemId: string, quantity: number) => void;
  removeFromCart: (itemId: string) => void;
  clearCart: () => void;
  setCurrentPage: (page: 'home' | 'cart' | 'booking' | 'member') => void;
  showProductModal: (product: Product) => void;
  closeModal: () => void;
  selectStore: (store: Store) => void;
  createOrder: (orderData: Partial<Order>) => Promise<ApiResponse<Order>>;
  loadUserData: () => Promise<void>;
}

// API 請求類型
export interface CreateOrderRequest {
  user_id: string;
  store_id: string;
  items: CartItem[];
  total_amount: number;
  payment_method: string;
  order_type: string;
  scheduled_time?: string;
}

// Bubble API 端點類型
export interface BubbleApiEndpoints {
  REGISTER_USER: string;
  GET_USER_DATA: string;
  GET_PRODUCTS: string;
  CREATE_ORDER: string;
  GET_STORE_AVAILABILITY: string;
  UPDATE_USER_POINTS: string;
}
