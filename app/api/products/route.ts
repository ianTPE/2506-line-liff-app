import { sql } from '@vercel/postgres';
import { NextRequest, NextResponse } from 'next/server';
import { Product } from '../../../../types/tea-app';

// 檢查是否有資料庫連線
const hasDatabase = !!process.env.POSTGRES_URL;
const isDev = process.env.NODE_ENV === 'development';

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

  // 生產模式或有資料庫時，使用資料庫
  try {

    let query;
    
    if (category && category !== 'all') {
      query = sql`
        SELECT * FROM products 
        WHERE category = ${category} AND availability_status = true
        ORDER BY name ASC
      `;
    } else {
      query = sql`
        SELECT * FROM products 
        WHERE availability_status = true
        ORDER BY category ASC, name ASC
      `;
    }

    const result = await query;
    
    const products: Product[] = result.rows.map(row => ({
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
      source: 'database'
    });

  } catch (error) {
    console.error('Products API error:', error);
    
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
        source: 'mock_data'
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
