import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';

// 檢查是否在開發模式
const isDev = process.env.NODE_ENV === 'development';
// 支援多種資料庫環境變數（Vercel Postgres、Supabase、Neon）
const hasDatabase = !!(
  process.env.DATABASE_URL_DIRECT || // 手動添加的直接連接（優先）
  process.env.POSTGRES_URL_NON_POOLING ||
  process.env.POSTGRES_URL || 
  process.env.DATABASE_URL ||
  process.env.SUPABASE_POSTGRES_URL ||
  process.env.DIRECT_URL ||
  process.env.SUPABASE_URL
);

// 檢查是否為 Supabase 環境
const isSupabase = !!(
  process.env.SUPABASE_URL || 
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// GET 請求：顯示資料庫狀態
export async function GET() {
  if (!hasDatabase && isDev) {
    return NextResponse.json({
      status: 'info',
      message: '本地開發模式 - 無需資料庫',
      mode: 'development',
      info: {
        description: '目前使用模擬資料，部署到 Vercel 後會自動使用真實資料庫',
        next_steps: [
          '1. 先測試前端功能',
          '2. git push 部署到 Vercel',
          '3. 在 Vercel 建立 Postgres 資料庫',
          '4. 訪問 https://your-app.vercel.app/api/init 初始化'
        ],
        local_apis: {
          products: 'http://localhost:3000/api/products',
          stores: 'http://localhost:3000/api/stores'
        }
      }
    });
  }

  try {
    // 檢查是否有資料庫連線
    // 優先使用直接連接（非池化）
    const originalPostgresUrl = process.env.POSTGRES_URL;
    
    if (process.env.DATABASE_URL_DIRECT) {
      console.log('使用手動設定的直接連接');
      process.env.POSTGRES_URL = process.env.DATABASE_URL_DIRECT;
    } else if (process.env.POSTGRES_URL_NON_POOLING) {
      console.log('使用 NON_POOLING 連接');
      process.env.POSTGRES_URL = process.env.POSTGRES_URL_NON_POOLING;
    }
    
    await sql`SELECT 1 as test`;
    
    // 還原原始設定
    if (originalPostgresUrl) {
      process.env.POSTGRES_URL = originalPostgresUrl;
    }
    
    return NextResponse.json({
      status: 'success',
      message: '資料庫連線正常',
      database_type: isSupabase ? 'Supabase' : 'Vercel Postgres',
      connection_type: process.env.DATABASE_URL_DIRECT ? 'Direct' : 
                      process.env.POSTGRES_URL_NON_POOLING ? 'Non-Pooling' : 'Default',
      info: {
        description: '發送 POST 請求到此端點來初始化資料庫',
        endpoint: '/api/init',
        method: 'POST',
        example: 'curl -X POST https://www.aipowered.top/api/init'
      }
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : '未知錯誤';
    
    // 為 Supabase 提供特別的錯誤訊息
    if (isSupabase) {
      return NextResponse.json({
        status: 'error', 
        message: 'Supabase 資料庫連線失敗',
        details: errorMessage,
        database_type: 'Supabase',
        troubleshooting: {
          possible_causes: [
            'Supabase 資料庫未啟動或暫停',
            'POSTGRES_URL 環境變數格式不正確',
            '網路連線問題或防火牆限制',
            '@vercel/postgres 與 Supabase 的相容性問題'
          ],
          solutions: [
            '確認 Supabase 項目狀態為「活躍」',
            '檢查 POSTGRES_URL 是否以 postgresql:// 開頭',
            '嘗試使用 POSTGRES_URL_NON_POOLING 環境變數',
            '考慮使用 Supabase 原生客戶端'
          ]
        },
        next_steps: '請前往 Supabase Dashboard 確認資料庫狀態'
      });
    }
    
    return NextResponse.json({
      status: 'error', 
      message: '資料庫連線失敗',
      details: errorMessage,
      database_type: 'Unknown',
      setup_guide: '請參考 VERCEL_BACKEND_SETUP.md 文件'
    });
  }
}

// POST 請求：初始化資料庫
export async function POST() {
  // 開發模式且沒有資料庫：回傳模擬成功
  if (!hasDatabase && isDev) {
    return NextResponse.json({
      status: 'success',
      message: '本地開發模式 - 模擬初始化成功',
      mode: 'development',
      info: {
        note: '這是模擬回應，實際資料庫初始化需要在 Vercel 上進行',
        mock_data: {
          users_created: '✓ 模擬',
          stores_created: '✓ 模擬',
          products_created: '✓ 模擬',
          orders_table_created: '✓ 模擬'
        }
      }
    });
  }
  
  try {
    // 優先使用直接連接（非池化）
    const originalPostgresUrl = process.env.POSTGRES_URL;
    
    if (process.env.DATABASE_URL_DIRECT) {
      console.log('初始化：使用手動設定的直接連接');
      process.env.POSTGRES_URL = process.env.DATABASE_URL_DIRECT;
    } else if (process.env.POSTGRES_URL_NON_POOLING) {
      console.log('初始化：使用 NON_POOLING 連接');
      process.env.POSTGRES_URL = process.env.POSTGRES_URL_NON_POOLING;
    }
    // 建立 users 表
    await sql`
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
      )
    `;

    // 建立 stores 表
    await sql`
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
      )
    `;

    // 建立 products 表
    await sql`
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
      )
    `;

    // 建立 orders 表
    await sql`
      CREATE TABLE IF NOT EXISTS orders (
        id VARCHAR(255) PRIMARY KEY,
        user_id VARCHAR(255) NOT NULL REFERENCES users(line_user_id),
        store_id VARCHAR(255) NOT NULL REFERENCES stores(id),
        total_amount DECIMAL(10,2) NOT NULL,
        payment_method VARCHAR(50) NOT NULL CHECK (payment_method IN ('points', 'wallet', 'linepay', 'credit')),
        order_status VARCHAR(50) DEFAULT 'pending' CHECK (order_status IN ('pending', 'processing', 'ready', 'completed', 'cancelled')),
        order_type VARCHAR(50) NOT NULL CHECK (order_type IN ('pickup_now', 'pickup_scheduled')),
        scheduled_time TIMESTAMP,
        created_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        completed_time TIMESTAMP
      )
    `;

    // 建立 order_items 表（購物車項目）
    await sql`
      CREATE TABLE IF NOT EXISTS order_items (
        id SERIAL PRIMARY KEY,
        order_id VARCHAR(255) NOT NULL REFERENCES orders(id),
        product_id VARCHAR(255) NOT NULL REFERENCES products(id),
        quantity INTEGER NOT NULL,
        unit_price DECIMAL(10,2) NOT NULL,
        customizations JSONB,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    // 插入初始門市資料
    await sql`
      INSERT INTO stores (id, name, address, phone, operating_hours, current_queue_count, average_wait_time, latitude, longitude) 
      VALUES 
        ('store1', '茶語時光 - 信義店', '台北市信義區信義路五段7號', '02-2345-6789', '09:00-21:00', 3, 12, 25.0336, 121.5644),
        ('store2', '茶語時光 - 西門店', '台北市萬華區西門町', '02-2345-6790', '10:00-22:00', 5, 18, 25.0424, 121.5081),
        ('store3', '茶語時光 - 東區店', '台北市大安區忠孝東路四段', '02-2345-6791', '09:30-21:30', 2, 8, 25.0416, 121.5544)
      ON CONFLICT (id) DO NOTHING
    `;

    // 插入初始商品資料
    await sql`
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
      ON CONFLICT (id) DO NOTHING
    `;

    // 還原原始設定
    if (originalPostgresUrl) {
      process.env.POSTGRES_URL = originalPostgresUrl;
    }

    return NextResponse.json({ 
      message: '資料庫初始化成功！', 
      status: 'success',
      database_type: isSupabase ? 'Supabase' : 'Vercel Postgres',
      connection_type: process.env.DATABASE_URL_DIRECT ? 'Direct' : 
                      process.env.POSTGRES_URL_NON_POOLING ? 'Non-Pooling' : 'Default',
      tables_created: [
        'users (用戶資料)',
        'stores (門市資訊)',
        'products (商品資料)',
        'orders (訂單記錄)',
        'order_items (訂單項目)'
      ],
      sample_data: {
        stores: '3 間門市',
        products: '8 個商品'
      }
    });

  } catch (error) {
    console.error('Database initialization error:', error);
    return NextResponse.json(
      { 
        error: '資料庫初始化失敗', 
        details: error instanceof Error ? error.message : '未知錯誤',
        status: 'error' 
      },
      { status: 500 }
    );
  }
}
