/**
 * 茶飲應用功能測試清單
 * 在瀏覽器開發者工具控制台中運行這些測試
 */

// 全域測試對象
window.TeaAppTests = {
  
  // 1. 基礎環境檢查
  checkEnvironment() {
    console.log('🔍 檢查環境配置...');
    
    const checks = [
      { name: 'LIFF SDK', test: () => typeof window.liff !== 'undefined' },
      { name: 'React', test: () => typeof window.React !== 'undefined' },
      { name: 'Next.js', test: () => typeof window.__NEXT_DATA__ !== 'undefined' },
      { name: 'Local Storage', test: () => typeof Storage !== 'undefined' },
      { name: 'Fetch API', test: () => typeof fetch !== 'undefined' },
    ];
    
    checks.forEach(check => {
      const result = check.test();
      console.log(`${result ? '✅' : '❌'} ${check.name}: ${result ? 'OK' : 'FAILED'}`);
    });
    
    return checks.every(check => check.test());
  },

  // 2. 本地儲存測試
  testLocalStorage() {
    console.log('💾 測試本地儲存...');
    
    try {
      const testKey = 'tea-app-test';
      const testData = { test: true, timestamp: Date.now() };
      
      // 寫入測試
      localStorage.setItem(testKey, JSON.stringify(testData));
      
      // 讀取測試
      const retrieved = JSON.parse(localStorage.getItem(testKey));
      
      // 清理
      localStorage.removeItem(testKey);
      
      const success = retrieved && retrieved.test === true;
      console.log(`${success ? '✅' : '❌'} 本地儲存: ${success ? 'OK' : 'FAILED'}`);
      
      return success;
    } catch (error) {
      console.error('❌ 本地儲存測試失敗:', error);
      return false;
    }
  },

  // 3. 購物車功能測試
  testShoppingCart() {
    console.log('🛒 測試購物車功能...');
    
    try {
      // 模擬購物車項目
      const mockItem = {
        id: 'test-' + Date.now(),
        product_id: 'tea-001',
        name: '測試珍珠奶茶',
        price: 50,
        quantity: 1,
        customizations: {
          sweetness: 'normal',
          ice: 'normal',
          topping: 'pearl'
        }
      };
      
      // 測試添加到購物車
      const cartKey = 'tea-app-cart';
      const currentCart = JSON.parse(localStorage.getItem(cartKey) || '[]');
      const newCart = [...currentCart, mockItem];
      
      localStorage.setItem(cartKey, JSON.stringify(newCart));
      
      // 驗證
      const savedCart = JSON.parse(localStorage.getItem(cartKey));
      const itemAdded = savedCart.some(item => item.id === mockItem.id);
      
      console.log(`${itemAdded ? '✅' : '❌'} 購物車添加: ${itemAdded ? 'OK' : 'FAILED'}`);
      
      // 清理測試數據
      const cleanCart = savedCart.filter(item => item.id !== mockItem.id);
      localStorage.setItem(cartKey, JSON.stringify(cleanCart));
      
      return itemAdded;
    } catch (error) {
      console.error('❌ 購物車測試失敗:', error);
      return false;
    }
  },

  // 4. 綜合測試
  async runAllTests() {
    console.log('🧪 開始執行完整測試套件...\n');
    
    const results = {
      environment: this.checkEnvironment(),
      localStorage: this.testLocalStorage(),
      shoppingCart: this.testShoppingCart(),
    };
    
    // 總結
    console.log('\n📊 測試結果總結:');
    Object.entries(results).forEach(([test, result]) => {
      console.log(`${result ? '✅' : '❌'} ${test}: ${result ? 'PASS' : 'FAIL'}`);
    });
    
    const passCount = Object.values(results).filter(Boolean).length;
    const totalCount = Object.keys(results).length;
    
    console.log(`\n🎯 通過率: ${passCount}/${totalCount} (${Math.round(passCount/totalCount*100)}%)`);
    
    if (passCount === totalCount) {
      console.log('🎉 所有測試通過！應用準備就緒！');
    } else {
      console.log('⚠️ 部分測試失敗，請檢查配置');
    }
    
    return results;
  }
};

// 自動執行基礎檢查
if (typeof window !== 'undefined') {
  console.log('🍵 茶語時光測試套件已載入');
  console.log('💡 使用 TeaAppTests.runAllTests() 執行完整測試');
}

export default window.TeaAppTests;
