-- ============================================================================
-- Supabase 資料庫表格創建 SQL
-- 用於茶語時光 LINE LIFF 應用
-- ============================================================================
-- 使用方法：
-- 1. 前往 Supabase Dashboard
-- 2. 選擇你的專案
-- 3. 點擊左側導航欄的 "SQL Editor"
-- 4. 點擊 "New Query"
-- 5. 複製並貼上以下 SQL
-- 6. 點擊 "Run" 執行
-- ============================================================================

-- 建立 users 表 (用戶資料)
CREATE TABLE IF NOT EXISTS users (
  id VARCHAR(255) PRIMARY KEY,
  line_user_id VARCHAR(255) UNIQUE NOT NULL,
  display_name VARCHAR(255) NOT NULL,
  phone_number VARCHAR(50),
  email VARCHAR(255),
  membership_level VARCHAR(20) DEFAULT 'bronze' CHECK (membership_level IN ('bronze', 'silver', 'gold')),
  points_balance INTEGER DEFAULT 0,
  wallet_balance DECIMAL(10,2) DEFAULT 0.00,
  picture_url TEXT,
  created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_login TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 建立 stores 表 (門市資訊)
CREATE TABLE IF NOT EXISTS stores (
  id VARCHAR(255) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  address TEXT NOT NULL,
  phone VARCHAR(50),
  operating_hours VARCHAR(255),
  current_queue_count INTEGER DEFAULT 0,
  average_wait_time INTEGER DEFAULT 15,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 建立 products 表 (商品資料)
CREATE TABLE IF NOT EXISTS products (
  id VARCHAR(255) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  category VARCHAR(50) NOT NULL CHECK (category IN ('tea', 'coffee', 'seasonal', 'snacks')),
  description TEXT,
  image_url TEXT,
  rating DECIMAL(3,2) DEFAULT 5.0,
  review_count INTEGER DEFAULT 0,
  preparation_time INTEGER DEFAULT 10,
  availability_status BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 建立 orders 表 (訂單記錄)
CREATE TABLE IF NOT EXISTS orders (
  id VARCHAR(255) PRIMARY KEY,
  user_id VARCHAR(255) NOT NULL,
  store_id VARCHAR(255) NOT NULL,
  total_amount DECIMAL(10,2) NOT NULL,
  payment_method VARCHAR(50) NOT NULL CHECK (payment_method IN ('points', 'wallet', 'linepay', 'credit')),
  order_status VARCHAR(50) DEFAULT 'pending' CHECK (order_status IN ('pending', 'processing', 'ready', 'completed', 'cancelled')),
  order_type VARCHAR(50) NOT NULL CHECK (order_type IN ('pickup_now', 'pickup_scheduled')),
  scheduled_time TIMESTAMP,
  created_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  completed_time TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(line_user_id),
  FOREIGN KEY (store_id) REFERENCES stores(id)
);

-- 建立 order_items 表 (訂單項目)
CREATE TABLE IF NOT EXISTS order_items (
  id SERIAL PRIMARY KEY,
  order_id VARCHAR(255) NOT NULL,
  product_id VARCHAR(255) NOT NULL,
  quantity INTEGER NOT NULL,
  unit_price DECIMAL(10,2) NOT NULL,
  customizations JSONB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (order_id) REFERENCES orders(id),
  FOREIGN KEY (product_id) REFERENCES products(id)
);

-- ============================================================================
-- 插入初始門市資料
-- ============================================================================
INSERT INTO stores (id, name, address, phone, operating_hours, current_queue_count, average_wait_time, latitude, longitude) 
VALUES 
  ('store1', '茶語時光 - 信義店', '台北市信義區信義路五段7號', '02-2345-6789', '09:00-21:00', 3, 12, 25.0336, 121.5644),
  ('store2', '茶語時光 - 西門店', '台北市萬華區西門町', '02-2345-6790', '10:00-22:00', 5, 18, 25.0424, 121.5081),
  ('store3', '茶語時光 - 東區店', '台北市大安區忠孝東路四段', '02-2345-6791', '09:30-21:30', 2, 8, 25.0416, 121.5544)
ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- 插入初始商品資料
-- ============================================================================
INSERT INTO products (id, name, price, category, description, image_url, rating, review_count, preparation_time, availability_status) 
VALUES 
  ('prod1', '經典珍珠奶茶', 65, 'tea', '香濃奶茶配上Q彈珍珠，經典不敗的選擇', '/images/pearl-milk-tea.jpg', 4.8, 1234, 8, true),
  ('prod2', '茉莉綠茶', 45, 'tea', '清香茉莉花茶，回甘無窮', '/images/jasmine-tea.jpg', 4.6, 856, 5, true),
  ('prod3', '焦糖瑪奇朵', 75, 'coffee', '香甜焦糖與濃郁咖啡的完美結合', '/images/caramel-macchiato.jpg', 4.7, 642, 12, true),
  ('prod4', '季節限定芒果氣泡', 85, 'seasonal', '新鮮芒果配氣泡水，夏日限定', '/images/mango-soda.jpg', 4.9, 321, 6, true),
  ('prod5', '手工餅乾', 35, 'snacks', '酥脆香甜的手工餅乾', '/images/cookies.jpg', 4.5, 189, 0, true),
  ('prod6', '烏龍茶', 50, 'tea', '台灣高山烏龍，茶香回甘', '/images/oolong-tea.jpg', 4.7, 723, 7, true),
  ('prod7', '美式咖啡', 55, 'coffee', '純正美式黑咖啡，提神醒腦', '/images/americano.jpg', 4.4, 456, 10, true),
  ('prod8', '冬季熱可可', 70, 'seasonal', '溫暖香甜的熱可可，冬日暖身', '/images/hot-chocolate.jpg', 4.8, 234, 8, true)
ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- 建立索引以提升查詢效能
-- ============================================================================
CREATE INDEX IF NOT EXISTS idx_users_line_user_id ON users(line_user_id);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_availability ON products(availability_status);
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_store_id ON orders(store_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(order_status);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);

-- ============================================================================
-- 設定 Row Level Security (RLS) - 可選
-- ============================================================================
-- 如果需要更嚴格的安全控制，可以啟用以下 RLS 政策
-- 注意：這會限制某些 API 操作，建議在完全理解後再啟用

-- ALTER TABLE users ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE stores ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE products ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- 完成訊息
-- ============================================================================
-- 執行完成後，你應該會看到：
-- 1. 5個表格被創建或確認存在
-- 2. 3筆門市資料被插入
-- 3. 8筆商品資料被插入
-- 4. 索引被創建以提升效能
-- ============================================================================
