#!/usr/bin/env node

/**
 * 茶語時光 API 測試腳本
 * 測試所有 API 端點是否正常運作
 */

const API_BASE = process.env.API_BASE || 'http://localhost:3000/api';

async function testAPI(endpoint, method = 'GET', body = null) {
  try {
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    if (body) {
      options.body = JSON.stringify(body);
    }

    const response = await fetch(`${API_BASE}${endpoint}`, options);
    const data = await response.json();

    console.log(`✅ ${method} ${endpoint}:`, response.status);
    if (data.status === 'error') {
      console.log(`   ⚠️  Error: ${data.error}`);
    } else {
      console.log(`   📊 Data count: ${Array.isArray(data.data) ? data.data.length : 'single item'}`);
    }
    
    return { success: response.ok, data };
  } catch (error) {
    console.log(`❌ ${method} ${endpoint}:`, error.message);
    return { success: false, error: error.message };
  }
}

async function runTests() {
  console.log('🧪 開始測試茶語時光 API...\n');

  // 1. 初始化資料庫
  console.log('1️⃣ 初始化資料庫...');
  await testAPI('/init', 'POST');
  
  console.log('\n2️⃣ 測試商品 API...');
  await testAPI('/products');
  await testAPI('/products?category=tea');
  await testAPI('/products?category=coffee');

  console.log('\n3️⃣ 測試門市 API...');
  await testAPI('/stores');

  console.log('\n4️⃣ 測試用戶 API...');
  const testUser = {
    line_user_id: 'test_user_123',
    display_name: '測試用戶',
    picture_url: 'https://example.com/avatar.jpg'
  };
  
  await testAPI('/users', 'POST', testUser);
  await testAPI('/users?user_id=test_user_123');

  console.log('\n5️⃣ 測試訂單 API...');
  const testOrder = {
    user_id: 'test_user_123',
    store_id: 'store1',
    items: [
      {
        product_id: 'prod1',
        quantity: 2,
        price: 65,
        customizations: {
          sweetness: 'normal',
          ice: 'normal',
          topping: 'pearl'
        }
      }
    ],
    total_amount: 130,
    payment_method: 'wallet',
    order_type: 'pickup_now'
  };

  await testAPI('/orders', 'POST', testOrder);
  await testAPI('/orders?user_id=test_user_123');

  console.log('\n✨ 測試完成！');
}

// 執行測試
runTests().catch(console.error);
