import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';
import { Product } from '../../../types/tea-app';

// 檢查 Supabase 環境變數
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// 檢查是否有資料庫配置
const hasDatabase = !!(supabaseUrl && supabaseKey);
const isDev = process.env.NODE_ENV === 'development';

// 創建 Supabase 客戶端
let supabase: SupabaseClient | null = null;
if (hasDatabase) {
  supabase = createClient(supabaseUrl!, supabaseKey!);
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category');

  // 在開發模式且沒有資料庫時，直接使用模擬資料
  if (!hasDatabase && isDev) {
    try {
      const { MOCK_PRODUCTS } = await import('../../tea-app/config');
      
      const filteredProducts = category && category !== 'all' 
        ? MOCK_PRODUCTS.filter(product => product.category === category)
        : MOCK_PRODUCTS;

      return NextResponse.json({
        status: 'success',
        data: filteredProducts,
        mode: 'development',
        source: 'mock_data'
      });
    } catch (mockError) {
      return NextResponse.json(
        { 
          status: 'error',
          error: '無法載入模擬商品資料',
          details: mockError instanceof Error ? mockError.message : '未知錯誤'
        },
        { status: 500 }
      );
    }
  }

  // 沒有資料庫配置時回傳錯誤
  if (!hasDatabase) {
    return NextResponse.json(
      { 
        status: 'error',
        error: '缺少 Supabase 環境變數',
        required_variables: [
          'NEXT_PUBLIC_SUPABASE_URL 或 SUPABASE_URL',
          'SUPABASE_SERVICE_ROLE_KEY 或 NEXT_PUBLIC_SUPABASE_ANON_KEY'
        ]
      },
      { status: 500 }
    );
  }

  // 生產模式或有資料庫時，使用 Supabase 資料庫
  try {
    let query = supabase
      .from('products')
      .select('*')
      .eq('availability_status', true);
    
    if (category && category !== 'all') {
      query = query.eq('category', category);
    }
    
    query = query.order('category', { ascending: true })
                .order('name', { ascending: true });

    const { data, error } = await query;
    
    if (error) {
      throw new Error(`Supabase 查詢錯誤: ${error.message}`);
    }
    
    const products: Product[] = data.map(row => ({
      id: row.id,
      name: row.name,
      price: parseFloat(row.price),
      category: row.category,
      description: row.description,
      image_url: row.image_url,
      rating: row.rating ? parseFloat(row.rating) : undefined,
      review_count: row.review_count,
      preparation_time: row.preparation_time,
      availability_status: row.availability_status,
    }));

    return NextResponse.json({
      status: 'success',
      data: products,
      source: 'supabase_database',
      count: products.length
    });

  } catch (error) {
    console.error('Products API Supabase error:', error);
    
    // 如果資料庫有問題，回傳模擬資料
    try {
      const { MOCK_PRODUCTS } = await import('../../tea-app/config');
      const category = new URL(request.url).searchParams.get('category');
      
      const filteredProducts = category && category !== 'all' 
        ? MOCK_PRODUCTS.filter(product => product.category === category)
        : MOCK_PRODUCTS;

      return NextResponse.json({
        status: 'success',
        data: filteredProducts,
        fallback: true,
        source: 'mock_data',
        database_error: error instanceof Error ? error.message : '未知錯誤'
      });
    } catch {
      return NextResponse.json(
        { 
          status: 'error',
          error: '無法載入商品資料',
          details: error instanceof Error ? error.message : '未知錯誤'
        },
        { status: 500 }
      );
    }
  }
}
