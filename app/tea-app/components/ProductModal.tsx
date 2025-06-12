'use client';

import React, { useState } from 'react';
import { useTeaApp } from '../providers/TeaAppProvider';
import { CartItem, ProductCustomizations } from '../../../types/tea-app';

export const ProductModal: React.FC = () => {
  const { selectedProduct, closeModal, addToCart } = useTeaApp();
  const [quantity, setQuantity] = useState(1);
  const [customizations, setCustomizations] = useState<ProductCustomizations>({
    sweetness: 'normal',
    ice: 'normal',
    topping: 'none',
  });

  if (!selectedProduct) return null;

  const handleCustomizationChange = (key: keyof ProductCustomizations, value: string) => {
    setCustomizations(prev => ({ ...prev, [key]: value }));
  };

  const calculatePrice = () => {
    let price = selectedProduct.price;
    if (customizations.topping !== 'none') {
      price += 10; // 加料 +$10
    }
    return price * quantity;
  };

  const handleAddToCart = () => {
    const cartItem: CartItem = {
      id: Date.now().toString(),
      product_id: selectedProduct.id,
      name: selectedProduct.name,
      price: selectedProduct.price + (customizations.topping !== 'none' ? 10 : 0),
      quantity,
      customizations,
      image_url: selectedProduct.image_url,
    };

    addToCart(cartItem);
    closeModal();
    
    // 重置狀態
    setQuantity(1);
    setCustomizations({
      sweetness: 'normal',
      ice: 'normal',
      topping: 'none',
    });
  };

  const customizationOptions = {
    sweetness: [
      { value: 'normal', label: '正常糖' },
      { value: 'less', label: '少糖' },
      { value: 'half', label: '半糖' },
      { value: 'none', label: '無糖' },
    ],
    ice: [
      { value: 'normal', label: '正常冰' },
      { value: 'less', label: '少冰' },
      { value: 'none', label: '去冰' },
      { value: 'hot', label: '熱飲' },
    ],
    topping: [
      { value: 'none', label: '不加料' },
      { value: 'pearl', label: '珍珠 +$10' },
      { value: 'pudding', label: '布丁 +$10' },
      { value: 'jelly', label: '仙草 +$10' },
    ],
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* 標題列 */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold">商品詳情</h2>
          <button
            onClick={closeModal}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* 商品圖片 */}
        <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
          {selectedProduct.image_url ? (
            <img
              src={selectedProduct.image_url}
              alt={selectedProduct.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="text-8xl">
              {selectedProduct.category === 'tea' && '🍵'}
              {selectedProduct.category === 'coffee' && '☕'}
              {selectedProduct.category === 'seasonal' && '🌸'}
              {selectedProduct.category === 'snacks' && '🧁'}
            </div>
          )}
        </div>

        <div className="p-6">
          {/* 商品資訊 */}
          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-2">{selectedProduct.name}</h3>
            {selectedProduct.description && (
              <p className="text-gray-600 text-sm mb-3">{selectedProduct.description}</p>
            )}
            
            <div className="flex items-center gap-4 text-sm text-gray-500">
              {selectedProduct.rating && (
                <div className="flex items-center gap-1">
                  <svg className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <span>{selectedProduct.rating}</span>
                  <span>({selectedProduct.review_count})</span>
                </div>
              )}
              
              {selectedProduct.preparation_time && (
                <div className="flex items-center gap-1">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                  </svg>
                  <span>約 {selectedProduct.preparation_time} 分鐘</span>
                </div>
              )}
            </div>
          </div>

          {/* 客製化選項 */}
          {selectedProduct.category !== 'snacks' && (
            <div className="space-y-6 mb-6">
              {/* 甜度 */}
              <div>
                <h4 className="font-semibold mb-3">甜度</h4>
                <div className="grid grid-cols-2 gap-2">
                  {customizationOptions.sweetness.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => handleCustomizationChange('sweetness', option.value)}
                      className={`p-3 rounded-lg border-2 text-sm font-medium transition-all ${
                        customizations.sweetness === option.value
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-200 text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* 冰塊 */}
              <div>
                <h4 className="font-semibold mb-3">冰塊</h4>
                <div className="grid grid-cols-2 gap-2">
                  {customizationOptions.ice.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => handleCustomizationChange('ice', option.value)}
                      className={`p-3 rounded-lg border-2 text-sm font-medium transition-all ${
                        customizations.ice === option.value
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-200 text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* 加料 */}
              <div>
                <h4 className="font-semibold mb-3">加料</h4>
                <div className="grid grid-cols-2 gap-2">
                  {customizationOptions.topping.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => handleCustomizationChange('topping', option.value)}
                      className={`p-3 rounded-lg border-2 text-sm font-medium transition-all ${
                        customizations.topping === option.value
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-200 text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 數量選擇 */}
          <div className="mb-6">
            <h4 className="font-semibold mb-3">數量</h4>
            <div className="flex items-center justify-center gap-4">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                </svg>
              </button>
              
              <span className="text-2xl font-semibold min-w-[3rem] text-center">
                {quantity}
              </span>
              
              <button
                onClick={() => setQuantity(Math.min(10, quantity + 1))}
                className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </button>
            </div>
          </div>

          {/* 價格和加入購物車 */}
          <div className="border-t pt-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-lg font-semibold">總計</span>
              <span className="text-2xl font-bold text-blue-600">
                ${calculatePrice()}
              </span>
            </div>
            
            <button
              onClick={handleAddToCart}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-xl font-semibold text-lg hover:shadow-lg transform hover:scale-105 transition-all duration-200"
            >
              加入購物車
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
