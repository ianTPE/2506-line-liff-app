import { sql } from '@vercel/postgres';
import { NextRequest, NextResponse } from 'next/server';
import { Store } from '../../../types/tea-app';

// 檢查是否有資料庫連線
const hasDatabase = !!process.env.POSTGRES_URL;
const isDev = process.env.NODE_ENV === 'development';

// 取得所有門市
export async function GET() {
  // 在開發模式且沒有資料庫時，直接使用模擬資料
  if (!hasDatabase && isDev) {
    try {
      const { MOCK_STORES } = await import('../../tea-app/config');

      return NextResponse.json({
        status: 'success',
        data: MOCK_STORES,
        mode: 'development',
        source: 'mock_data'
      });
    } catch (mockError) {
      return NextResponse.json(
        { 
          status: 'error',
          error: '無法載入模擬門市資料',
          details: mockError instanceof Error ? mockError.message : '未知錯誤'
        },
        { status: 500 }
      );
    }
  }

  // 生產模式或有資料庫時，使用資料庫
  try {
    const result = await sql`
      SELECT * FROM stores 
      ORDER BY name ASC
    `;

    const stores: Store[] = result.rows.map(row => ({
      id: row.id,
      name: row.name,
      address: row.address,
      phone: row.phone,
      operating_hours: row.operating_hours,
      current_queue_count: row.current_queue_count,
      average_wait_time: row.average_wait_time,
      coordinates: row.latitude && row.longitude ? {
        latitude: parseFloat(row.latitude),
        longitude: parseFloat(row.longitude)
      } : undefined,
    }));

    return NextResponse.json({
      status: 'success',
      data: stores,
      source: 'database'
    });

  } catch (error) {
    console.error('Stores API error:', error);
    
    // 如果資料庫有問題，回傳模擬資料
    try {
      const { MOCK_STORES } = await import('../../tea-app/config');

      return NextResponse.json({
        status: 'success',
        data: MOCK_STORES,
        fallback: true,
        source: 'mock_data'
      });
    } catch {
      return NextResponse.json(
        { 
          status: 'error',
          error: '無法載入門市資料',
          details: error instanceof Error ? error.message : '未知錯誤'
        },
        { status: 500 }
      );
    }
  }
}

// 更新門市排隊狀況
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { store_id, current_queue_count, average_wait_time } = body;

    if (!store_id) {
      return NextResponse.json(
        { status: 'error', error: 'store_id 為必填欄位' },
        { status: 400 }
      );
    }

    await sql`
      UPDATE stores 
      SET 
        current_queue_count = COALESCE(${current_queue_count}, current_queue_count),
        average_wait_time = COALESCE(${average_wait_time}, average_wait_time)
      WHERE id = ${store_id}
    `;

    const updatedStore = await sql`
      SELECT * FROM stores WHERE id = ${store_id}
    `;

    if (updatedStore.rows.length === 0) {
      return NextResponse.json(
        { status: 'error', error: '找不到指定門市' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      status: 'success',
      data: updatedStore.rows[0],
      message: '門市資料已更新'
    });

  } catch (error) {
    console.error('Update store error:', error);
    return NextResponse.json(
      { 
        status: 'error',
        error: '門市資料更新失敗',
        details: error instanceof Error ? error.message : '未知錯誤'
      },
      { status: 500 }
    );
  }
}
