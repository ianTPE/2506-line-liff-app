import { sql } from '@vercel/postgres';
import { NextRequest, NextResponse } from 'next/server';
import { Order, CartItem } from '../../../../types/tea-app';

// 建立訂單
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      user_id, 
      store_id, 
      items, 
      total_amount, 
      payment_method, 
      order_type,
      scheduled_time 
    } = body;

    // 驗證必填欄位
    if (!user_id || !store_id || !items || !total_amount || !payment_method || !order_type) {
      return NextResponse.json(
        { status: 'error', error: '缺少必填欄位' },
        { status: 400 }
      );
    }

    // 生成訂單 ID
    const orderId = `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // 建立訂單
    await sql`
      INSERT INTO orders (
        id, user_id, store_id, total_amount, 
        payment_method, order_status, order_type, scheduled_time
      ) VALUES (
        ${orderId}, ${user_id}, ${store_id}, ${total_amount},
        ${payment_method}, 'pending', ${order_type}, ${scheduled_time || null}
      )
    `;

    // 新增訂單項目
    for (const item of items) {
      await sql`
        INSERT INTO order_items (
          order_id, product_id, quantity, unit_price, customizations
        ) VALUES (
          ${orderId}, ${item.product_id}, ${item.quantity}, 
          ${item.price}, ${JSON.stringify(item.customizations)}
        )
      `;
    }

    // 取得完整的訂單資料
    const orderResult = await sql`
      SELECT o.*, s.name as store_name 
      FROM orders o
      JOIN stores s ON o.store_id = s.id
      WHERE o.id = ${orderId}
    `;

    const itemsResult = await sql`
      SELECT oi.*, p.name as product_name, p.image_url
      FROM order_items oi
      JOIN products p ON oi.product_id = p.id
      WHERE oi.order_id = ${orderId}
    `;

    const order: Order = {
      id: orderResult.rows[0].id,
      user_id: orderResult.rows[0].user_id,
      store_id: orderResult.rows[0].store_id,
      items: itemsResult.rows.map(row => ({
        id: row.id.toString(),
        product_id: row.product_id,
        name: row.product_name,
        price: parseFloat(row.unit_price),
        quantity: row.quantity,
        customizations: row.customizations,
        image_url: row.image_url,
      })),
      total_amount: parseFloat(orderResult.rows[0].total_amount),
      payment_method: orderResult.rows[0].payment_method,
      order_status: orderResult.rows[0].order_status,
      order_type: orderResult.rows[0].order_type,
      scheduled_time: orderResult.rows[0].scheduled_time,
      created_time: orderResult.rows[0].created_time,
      completed_time: orderResult.rows[0].completed_time,
    };

    return NextResponse.json({
      status: 'success',
      data: order,
      message: '訂單建立成功'
    });

  } catch (error) {
    console.error('Create order error:', error);
    return NextResponse.json(
      { 
        status: 'error',
        error: '訂單建立失敗',
        details: error instanceof Error ? error.message : '未知錯誤'
      },
      { status: 500 }
    );
  }
}

// 取得用戶訂單列表
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const user_id = searchParams.get('user_id');
    const limit = searchParams.get('limit') || '10';

    if (!user_id) {
      return NextResponse.json(
        { status: 'error', error: 'user_id 參數為必填' },
        { status: 400 }
      );
    }

    const ordersResult = await sql`
      SELECT o.*, s.name as store_name
      FROM orders o
      JOIN stores s ON o.store_id = s.id
      WHERE o.user_id = ${user_id}
      ORDER BY o.created_time DESC
      LIMIT ${parseInt(limit)}
    `;

    const orders = [];
    
    for (const orderRow of ordersResult.rows) {
      const itemsResult = await sql`
        SELECT oi.*, p.name as product_name, p.image_url
        FROM order_items oi
        JOIN products p ON oi.product_id = p.id
        WHERE oi.order_id = ${orderRow.id}
      `;

      const order: Order = {
        id: orderRow.id,
        user_id: orderRow.user_id,
        store_id: orderRow.store_id,
        items: itemsResult.rows.map(row => ({
          id: row.id.toString(),
          product_id: row.product_id,
          name: row.product_name,
          price: parseFloat(row.unit_price),
          quantity: row.quantity,
          customizations: row.customizations,
          image_url: row.image_url,
        })),
        total_amount: parseFloat(orderRow.total_amount),
        payment_method: orderRow.payment_method,
        order_status: orderRow.order_status,
        order_type: orderRow.order_type,
        scheduled_time: orderRow.scheduled_time,
        created_time: orderRow.created_time,
        completed_time: orderRow.completed_time,
      };

      orders.push(order);
    }

    return NextResponse.json({
      status: 'success',
      data: orders
    });

  } catch (error) {
    console.error('Get orders error:', error);
    return NextResponse.json(
      { 
        status: 'error',
        error: '無法取得訂單資料',
        details: error instanceof Error ? error.message : '未知錯誤'
      },
      { status: 500 }
    );
  }
}
