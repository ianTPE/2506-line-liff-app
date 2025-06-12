// 茶飲應用配置文件

import { Product, Store } from '../../../types/tea-app';

/**
 * 開發模式配置
 */
export const DEV_CONFIG = {
  // 是否啟用模擬數據
  USE_MOCK_DATA: process.env.NEXT_PUBLIC_DEV_MODE === 'true',
  
  // API 請求超時時間（毫秒）
  API_TIMEOUT: 10000,
  
  // 本地儲存鍵值
  STORAGE_KEYS: {
    CART: 'tea-app-cart',
    USER_PREFERENCES: 'tea-app-user-prefs',
    SELECTED_STORE: 'tea-app-selected-store',
  },
  
  // UI 配置
  UI: {
    // 購物車最大商品數量
    MAX_CART_ITEMS: 20,
    
    // 單項商品最大數量
    MAX_ITEM_QUANTITY: 10,
    
    // Toast 顯示時間（毫秒）
    TOAST_DURATION: 3000,
    
    // 載入動畫最短顯示時間（毫秒）
    MIN_LOADING_TIME: 800,
  },
};

/**
 * 模擬商品數據
 */
export const MOCK_PRODUCTS: Product[] = [
  // 經典茶飲
  {
    id: 'tea-001',
    name: '珍珠奶茶',
    price: 50,
    category: 'tea',
    description: '經典台式珍珠奶茶，香濃茶香搭配Q彈珍珠，是台灣茶飲的代表作品。選用上等茶葉，配上新鮮牛奶，每一口都是滿滿的幸福感。',
    image_url: '/images/products/pearl-milk-tea.webp',
    rating: 4.5,
    review_count: 328,
    preparation_time: 8,
    availability_status: true,
  },
  {
    id: 'tea-002',
    name: '冬瓜檸檬',
    price: 45,
    category: 'tea',
    description: '清爽冬瓜茶配新鮮檸檬，夏日消暑首選。冬瓜的甘甜配上檸檬的酸香，層次豐富，口感清新。',
    image_url: '/images/products/winter-melon-lemon.webp',
    rating: 4.3,
    review_count: 156,
    preparation_time: 5,
    availability_status: true,
  },
  {
    id: 'tea-003',
    name: '烏龍茶',
    price: 35,
    category: 'tea',
    description: '精選台灣高山烏龍茶，茶香濃郁，回甘甘甜。傳統工藝製作，保留茶葉原有的香氣與韻味。',
    image_url: '/images/products/oolong-tea.webp',
    rating: 4.4,
    review_count: 89,
    preparation_time: 3,
    availability_status: true,
  },
  {
    id: 'tea-004',
    name: '茉莉綠茶',
    price: 30,
    category: 'tea',
    description: '清香茉莉花配上優質綠茶，花香茶韻完美融合，口感清雅怡人。',
    image_url: '/images/products/jasmine-green-tea.webp',
    rating: 4.2,
    review_count: 203,
    preparation_time: 4,
    availability_status: true,
  },

  // 咖啡系列
  {
    id: 'coffee-001',
    name: '美式咖啡',
    price: 60,
    category: 'coffee',
    description: '精選阿拉比卡豆，純正美式風味。深度烘焙，香氣濃郁，口感純淨，咖啡愛好者的首選。',
    image_url: '/images/products/americano.webp',
    rating: 4.2,
    review_count: 89,
    preparation_time: 3,
    availability_status: true,
  },
  {
    id: 'coffee-002',
    name: '拿鐵咖啡',
    price: 75,
    category: 'coffee',
    description: '香濃espresso配上綿密奶泡，口感滑順，奶香與咖啡香完美平衡。',
    image_url: '/images/products/latte.webp',
    rating: 4.6,
    review_count: 167,
    preparation_time: 5,
    availability_status: true,
  },
  {
    id: 'coffee-003',
    name: '卡布奇諾',
    price: 70,
    category: 'coffee',
    description: '經典義式咖啡，濃郁咖啡配上豐富奶泡，撒上肉桂粉，香氣迷人。',
    image_url: '/images/products/cappuccino.webp',
    rating: 4.4,
    review_count: 134,
    preparation_time: 6,
    availability_status: true,
  },

  // 季節限定
  {
    id: 'seasonal-001',
    name: '草莓奶昔',
    price: 75,
    category: 'seasonal',
    description: '季節限定！新鮮草莓製作的濃郁奶昔，酸甜可口，滿滿的草莓果粒，限量供應。',
    image_url: '/images/products/strawberry-shake.webp',
    rating: 4.8,
    review_count: 234,
    preparation_time: 6,
    availability_status: true,
  },
  {
    id: 'seasonal-002',
    name: '芒果冰沙',
    price: 80,
    category: 'seasonal',
    description: '夏季限定芒果冰沙，選用愛文芒果，香甜濃郁，消暑解渴的最佳選擇。',
    image_url: '/images/products/mango-smoothie.webp',
    rating: 4.7,
    review_count: 189,
    preparation_time: 7,
    availability_status: true,
  },
  {
    id: 'seasonal-003',
    name: '櫻花拿鐵',
    price: 85,
    category: 'seasonal',
    description: '春季限定櫻花拿鐵，淡雅櫻花香配上香濃咖啡，粉嫩色澤，浪漫滿分。',
    image_url: '/images/products/sakura-latte.webp',
    rating: 4.9,
    review_count: 156,
    preparation_time: 8,
    availability_status: false, // 季節性商品暫時缺貨
  },

  // 輕食點心
  {
    id: 'snacks-001',
    name: '起司蛋糕',
    price: 80,
    category: 'snacks',
    description: '手工製作起司蛋糕，綿密香甜，選用進口奶油起司，口感濃郁，甜點控必點。',
    image_url: '/images/products/cheesecake.webp',
    rating: 4.6,
    review_count: 67,
    preparation_time: 2,
    availability_status: true,
  },
  {
    id: 'snacks-002',
    name: '可頌麵包',
    price: 45,
    category: 'snacks',
    description: '法式可頌麵包，酥脆外皮，層次分明，搭配飲品享用，完美的下午茶時光。',
    image_url: '/images/products/croissant.webp',
    rating: 4.3,
    review_count: 92,
    preparation_time: 3,
    availability_status: true,
  },
  {
    id: 'snacks-003',
    name: '司康餅',
    price: 55,
    category: 'snacks',
    description: '英式司康餅，鬆軟香甜，可選擇原味或藍莓口味，配上果醬和奶油更美味。',
    image_url: '/images/products/scone.webp',
    rating: 4.4,
    review_count: 78,
    preparation_time: 2,
    availability_status: true,
  },
];

/**
 * 模擬門市數據
 */
export const MOCK_STORES: Store[] = [
  {
    id: 'store-001',
    name: '信義店',
    address: '台北市信義區信義路五段7號',
    phone: '02-1234-5678',
    operating_hours: '08:00-22:00',
    current_queue_count: 8,
    average_wait_time: 25,
    coordinates: {
      latitude: 25.0330,
      longitude: 121.5654,
    },
  },
  {
    id: 'store-002',
    name: '忠孝店',
    address: '台北市大安區忠孝東路四段181號',
    phone: '02-8765-4321',
    operating_hours: '09:00-21:00',
    current_queue_count: 3,
    average_wait_time: 12,
    coordinates: {
      latitude: 25.0417,
      longitude: 121.5439,
    },
  },
  {
    id: 'store-003',
    name: '西門店',
    address: '台北市萬華區漢中街108號',
    phone: '02-5555-6666',
    operating_hours: '10:00-23:00',
    current_queue_count: 15,
    average_wait_time: 35,
    coordinates: {
      latitude: 25.0421,
      longitude: 121.5081,
    },
  },
  {
    id: 'store-004',
    name: '板橋店',
    address: '新北市板橋區文化路一段123號',
    phone: '02-7777-8888',
    operating_hours: '08:30-21:30',
    current_queue_count: 6,
    average_wait_time: 18,
    coordinates: {
      latitude: 25.0173,
      longitude: 121.4621,
    },
  },
];

/**
 * 會員等級配置
 */
export const MEMBERSHIP_CONFIG = {
  bronze: {
    id: 'bronze',
    label: '銅卡會員',
    color: 'from-orange-400 to-orange-600',
    icon: '🥉',
    pointsRate: 0.01, // 1%
    discountRate: 0.05, // 5%
    minSpend: 0,
    benefits: [
      '消費累積點數 1%',
      '生日當月 9 折優惠',
      '會員專屬優惠通知',
    ],
  },
  silver: {
    id: 'silver',
    label: '銀卡會員',
    color: 'from-gray-400 to-gray-600',
    icon: '🥈',
    pointsRate: 0.015, // 1.5%
    discountRate: 0.08, // 8%
    minSpend: 3000,
    benefits: [
      '消費累積點數 1.5%',
      '生日當月 9 折優惠',
      '每月免費升級一次 (中杯→大杯)',
      '預約免排隊權限',
      '會員專屬優惠通知',
    ],
  },
  gold: {
    id: 'gold',
    label: '金卡會員',
    color: 'from-yellow-400 to-yellow-600',
    icon: '🥇',
    pointsRate: 0.02, // 2%
    discountRate: 0.10, // 10%
    minSpend: 10000,
    benefits: [
      '消費累積點數 2%',
      '生日當月 9 折優惠',
      '每週免費飲品一杯',
      '預約免排隊權限',
      '新品優先體驗權',
      '專屬客服服務',
      '會員專屬優惠通知',
    ],
  },
};

const TeaAppConfig = {
  DEV_CONFIG,
  MOCK_PRODUCTS,
  MOCK_STORES,
  MEMBERSHIP_CONFIG,
};

export default TeaAppConfig;
