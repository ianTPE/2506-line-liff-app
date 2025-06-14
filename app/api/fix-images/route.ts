import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

// 檢查 Supabase 環境變數
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// 檢查是否有資料庫配置
const hasDatabase = !!(supabaseUrl && supabaseKey);

// 創建 Supabase 客戶端
let supabase: SupabaseClient | null = null;
if (hasDatabase) {
  supabase = createClient(supabaseUrl!, supabaseKey!);
}

// 產品圖片映射
const productImageMap = {
  'prod1': '/images/products/pearl-milk-tea.webp',      // 經典珍珠奶茶
  'prod2': '/images/products/jasmine-green-tea.webp',   // 茉莉綠茶
  'prod3': '/images/products/cappuccino.webp',          // 焦糖瑪奇朵 (使用卡布奇諾圖片)
  'prod4': '/images/products/mango-smoothie.webp',      // 季節限定芒果氣泡
  'prod5': '/images/products/croissant.webp',           // 手工餅乾 (使用可頌圖片)
  'prod6': '/images/products/oolong-tea.webp',          // 烏龍茶
  'prod7': '/images/products/americano.webp',           // 美式咖啡
  'prod8': '/images/products/latte.webp',               // 冬季熱可可 (使用拿鐵圖片)
};

export async function POST() {
  if (!hasDatabase) {
    return NextResponse.json({
      status: 'error',
      message: '缺少 Supabase 環境變數'
    }, { status: 500 });
  }

  if (!supabase) {
    return NextResponse.json({
      status: 'error',
      message: 'Supabase 客戶端未初始化'
    }, { status: 500 });
  }

  try {
    console.log('開始修復產品圖片路徑...');
    
    const updatePromises = Object.entries(productImageMap).map(async ([productId, imagePath]) => {
      const { data, error } = await supabase!
        .from('products')
        .update({ image_url: imagePath })
        .eq('id', productId)
        .select('id, name, image_url');
      
      if (error) {
        console.error(`更新產品 ${productId} 失敗:`, error);
        return { productId, success: false, error: error.message };
      }
      
      return { productId, success: true, data: data[0] };
    });

    const results = await Promise.all(updatePromises);
    
    // 檢查結果
    const successCount = results.filter(r => r.success).length;
    const failureCount = results.filter(r => !r.success).length;
    
    return NextResponse.json({
      status: 'success',
      message: '產品圖片路徑修復完成',
      summary: {
        total: results.length,
        success: successCount,
        failed: failureCount
      },
      results: results,
      next_steps: [
        '重新訪問 /api/products 檢查圖片路徑',
        '前往 /tea-app 查看圖片是否正常顯示'
      ]
    });

  } catch (error) {
    console.error('圖片路徑修復錯誤:', error);
    return NextResponse.json({
      status: 'error',
      message: '圖片路徑修復失敗',
      details: error instanceof Error ? error.message : '未知錯誤'
    }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    status: 'info',
    message: '產品圖片路徑修復工具',
    description: '發送 POST 請求來自動修復所有產品的圖片路徑',
    available_images: Object.entries(productImageMap).map(([id, path]) => ({
      product_id: id,
      image_path: path
    })),
    usage: {
      method: 'POST',
      endpoint: '/api/fix-images',
      example: 'fetch(\'/api/fix-images\', { method: \'POST\' })'
    }
  });
}
