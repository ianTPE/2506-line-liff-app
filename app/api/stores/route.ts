import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';
import { Store } from '../../../types/tea-app';

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
    const { data, error } = await supabase
      .from('stores')
      .select('*')
      .order('name', { ascending: true });

    if (error) {
      throw new Error(`Supabase 查詢錯誤: ${error.message}`);
    }

    const stores: Store[] = data.map(row => ({
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
      source: 'supabase_database',
      count: stores.length
    });

  } catch (error) {
    console.error('Stores API Supabase error:', error);
    
    // 如果資料庫有問題，回傳模擬資料
    try {
      const { MOCK_STORES } = await import('../../tea-app/config');

      return NextResponse.json({
        status: 'success',
        data: MOCK_STORES,
        fallback: true,
        source: 'mock_data',
        database_error: error instanceof Error ? error.message : '未知錯誤'
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
  // 沒有資料庫配置時回傳錯誤
  if (!hasDatabase) {
    return NextResponse.json(
      { 
        status: 'error',
        error: '缺少 Supabase 環境變數，無法更新門市資料'
      },
      { status: 500 }
    );
  }

  try {
    const body = await request.json();
    const { store_id, current_queue_count, average_wait_time } = body;

    if (!store_id) {
      return NextResponse.json(
        { status: 'error', error: 'store_id 為必填欄位' },
        { status: 400 }
      );
    }

    // 準備更新的資料
    const updateData: { current_queue_count?: number; average_wait_time?: number } = {};
    if (current_queue_count !== undefined) {
      updateData.current_queue_count = current_queue_count;
    }
    if (average_wait_time !== undefined) {
      updateData.average_wait_time = average_wait_time;
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { status: 'error', error: '沒有提供要更新的資料' },
        { status: 400 }
      );
    }

    // 更新門市資料
    const { data, error } = await supabase
      .from('stores')
      .update(updateData)
      .eq('id', store_id)
      .select()
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { status: 'error', error: '找不到指定門市' },
          { status: 404 }
        );
      }
      throw new Error(`Supabase 更新錯誤: ${error.message}`);
    }

    return NextResponse.json({
      status: 'success',
      data: data,
      message: '門市資料已更新'
    });

  } catch (error) {
    console.error('Update store Supabase error:', error);
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
