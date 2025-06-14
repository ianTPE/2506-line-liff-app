import { sql } from '@vercel/postgres';
import { NextRequest, NextResponse } from 'next/server';
import { User } from '../../../../types/tea-app';

// 註冊或更新用戶
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { line_user_id, display_name, picture_url, phone_number, email } = body;

    if (!line_user_id || !display_name) {
      return NextResponse.json(
        { status: 'error', error: 'line_user_id 和 display_name 為必填欄位' },
        { status: 400 }
      );
    }

    // 檢查用戶是否已存在
    const existingUser = await sql`
      SELECT * FROM users WHERE line_user_id = ${line_user_id}
    `;

    if (existingUser.rows.length > 0) {
      // 更新現有用戶的最後登入時間和資料
      await sql`
        UPDATE users 
        SET 
          display_name = ${display_name},
          picture_url = ${picture_url || null},
          phone_number = ${phone_number || null},
          email = ${email || null},
          last_login = CURRENT_TIMESTAMP
        WHERE line_user_id = ${line_user_id}
      `;

      const updatedUser = await sql`
        SELECT * FROM users WHERE line_user_id = ${line_user_id}
      `;

      return NextResponse.json({
        status: 'success',
        data: updatedUser.rows[0],
        message: '用戶資料已更新'
      });
    } else {
      // 建立新用戶
      const userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      await sql`
        INSERT INTO users (
          id, line_user_id, display_name, picture_url, 
          phone_number, email, membership_level, 
          points_balance, wallet_balance
        ) VALUES (
          ${userId}, ${line_user_id}, ${display_name}, ${picture_url || null},
          ${phone_number || null}, ${email || null}, 'bronze',
          0, 0.00
        )
      `;

      const newUser = await sql`
        SELECT * FROM users WHERE line_user_id = ${line_user_id}
      `;

      return NextResponse.json({
        status: 'success',
        data: newUser.rows[0],
        message: '新用戶註冊成功'
      });
    }

  } catch (error) {
    console.error('User registration error:', error);
    return NextResponse.json(
      { 
        status: 'error',
        error: '用戶註冊失敗',
        details: error instanceof Error ? error.message : '未知錯誤'
      },
      { status: 500 }
    );
  }
}

// 取得用戶資料
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const user_id = searchParams.get('user_id');

    if (!user_id) {
      return NextResponse.json(
        { status: 'error', error: 'user_id 參數為必填' },
        { status: 400 }
      );
    }

    const result = await sql`
      SELECT * FROM users WHERE line_user_id = ${user_id}
    `;

    if (result.rows.length === 0) {
      return NextResponse.json(
        { status: 'error', error: '找不到用戶資料' },
        { status: 404 }
      );
    }

    const user: User = {
      id: result.rows[0].id,
      line_user_id: result.rows[0].line_user_id,
      display_name: result.rows[0].display_name,
      phone_number: result.rows[0].phone_number,
      email: result.rows[0].email,
      membership_level: result.rows[0].membership_level,
      points_balance: result.rows[0].points_balance,
      wallet_balance: parseFloat(result.rows[0].wallet_balance),
      picture_url: result.rows[0].picture_url,
      created_date: result.rows[0].created_date,
      last_login: result.rows[0].last_login,
    };

    return NextResponse.json({
      status: 'success',
      data: user
    });

  } catch (error) {
    console.error('Get user data error:', error);
    return NextResponse.json(
      { 
        status: 'error',
        error: '無法取得用戶資料',
        details: error instanceof Error ? error.message : '未知錯誤'
      },
      { status: 500 }
    );
  }
}
