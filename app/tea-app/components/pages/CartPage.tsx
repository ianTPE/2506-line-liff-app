'use client';

import React from 'react';
import { useTeaApp } from '../../providers/TeaAppProvider';

const getCustomizationLabel = (key: string, value: string): string => {
  const labels: Record<string, Record<string, string>> = {
    sweetness: { normal: '正常糖', less: '少糖', half: '半糖', none: '無糖' },
    ice: { normal: '正常冰', less: '少冰', none: '去冰', hot: '熱飲' },
    topping: { none: '不加料', pearl: '珍珠', pudding: '布丁', jelly: '仙草' }
  };
  return labels[key]?.[value] || value;
};

export const CartPage: React.FC = () => {
  const { 
    cartItems, 
    cartTotal, 
    cartCount,
    updateCartItem, 
    removeFromCart,
    createOrder,
    user 
  } = useTeaApp();

  const handleCheckout = async () => {
    if (cartItems.length === 0) {
      alert('購物車是空的');
      return;
    }

    try {
      const result = await createOrder({
        order_type: 'pickup_now',
        payment_method: 'wallet',
      });

      if (result.status === 'success') {
        alert('訂單已送出成功！');
      } else {
        alert(`訂單送出失敗: ${result.error}`);
      }
    } catch (error) {
      console.error('Checkout error:', error);
      alert('網路錯誤，請重試');
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-96 p-8">
        <div className="text-8xl mb-6">🛒</div>
        <h3 className="text-xl font-semibold text-gray-700 mb-2">購物車是空的</h3>
        <p className="text-gray-500 text-center mb-6">
          快去選購您喜愛的飲品吧！
        </p>
        <div className="w-20 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded"></div>
      </div>
    );
  }

  const memberDiscount = Math.floor(cartTotal * 0.05); // 5% 會員折扣
  const finalTotal = cartTotal - memberDiscount;

  return (
    <div className="p-4 space-y-4">
      {/* 購物車項目 */}
      <div className="space-y-3">
        {cartItems.map((item) => (
          <div key={item.id} className="bg-white rounded-xl shadow-md p-4">
            <div className="flex gap-4">
              {/* 商品圖片 */}
              <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center">
                {item.image_url ? (
                  <img
                    src={item.image_url}
                    alt={item.name}
                    className="w-full h-full object-cover rounded-lg"
                  />
                ) : (
                  <span className="text-2xl">🍵</span>
                )}
              </div>

              {/* 商品詳情 */}
              <div className="flex-1">
                <h4 className="font-semibold text-gray-800 mb-1">{item.name}</h4>
                
                {/* 客製化選項 */}
                <div className="text-xs text-gray-500 mb-2">
                  {Object.entries(item.customizations)
                  .filter(([, value]) => value !== 'none')
                  .map(([key, value]) => getCustomizationLabel(key, value))
                  .join(' | ')
                  }
                </div>

                {/* 數量控制和價格 */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => updateCartItem(item.id, item.quantity - 1)}
                      className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                      </svg>
                    </button>
                    
                    <span className="font-medium min-w-[2rem] text-center">
                      {item.quantity}
                    </span>
                    
                    <button
                      onClick={() => updateCartItem(item.id, item.quantity + 1)}
                      className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                    </button>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="font-bold text-blue-600">
                      ${item.price * item.quantity}
                    </span>
                    
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-red-500 hover:text-red-700 p-1"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 結帳摘要 */}
      <div className="bg-white rounded-xl shadow-md p-6 sticky bottom-4">
        <h3 className="font-semibold text-lg mb-4">訂單摘要</h3>
        
        <div className="space-y-2 mb-4">
          <div className="flex justify-between text-gray-600">
            <span>小計 ({cartCount} 件商品)</span>
            <span>${cartTotal}</span>
          </div>
          
          {memberDiscount > 0 && (
            <div className="flex justify-between text-green-600">
              <span>會員折扣 ({user?.membership_level})</span>
              <span>-${memberDiscount}</span>
            </div>
          )}
          
          <div className="border-t pt-2">
            <div className="flex justify-between font-bold text-lg text-blue-600">
              <span>總計</span>
              <span>${finalTotal}</span>
            </div>
          </div>
        </div>

        {/* 付款方式選擇 */}
        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-700 mb-2">付款方式</h4>
          <div className="grid grid-cols-2 gap-2">
            <label className="flex items-center gap-2 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
              <input type="radio" name="payment" value="wallet" defaultChecked className="text-blue-600" />
              <div className="flex-1">
                <div className="text-sm font-medium">錢包餘額</div>
                <div className="text-xs text-gray-500">${user?.wallet_balance || 0}</div>
              </div>
            </label>
            
            <label className="flex items-center gap-2 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
              <input type="radio" name="payment" value="points" className="text-blue-600" />
              <div className="flex-1">
                <div className="text-sm font-medium">點數折抵</div>
                <div className="text-xs text-gray-500">{user?.points_balance || 0} 點可用</div>
              </div>
            </label>
          </div>
        </div>

        <button
          onClick={handleCheckout}
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-xl font-semibold text-lg hover:shadow-lg transform hover:scale-105 transition-all duration-200"
        >
          確認結帳 ${finalTotal}
        </button>
      </div>
    </div>
  );
};
