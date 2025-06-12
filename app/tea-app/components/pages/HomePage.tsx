'use client';

import React from 'react';
import { useTeaApp } from '../../providers/TeaAppProvider';

const categories = [
  { id: 'all', label: '全部', emoji: '🌟' },
  { id: 'tea', label: '經典茶飲', emoji: '🍵' },
  { id: 'coffee', label: '咖啡系列', emoji: '☕' },
  { id: 'seasonal', label: '季節限定', emoji: '🌸' },
  { id: 'snacks', label: '輕食點心', emoji: '🧁' },
];

export const HomePage: React.FC = () => {
  const { 
    selectedStore, 
    products, 
    selectedCategory, 
    loadProducts, 
    showProductModal,
    isLoading 
  } = useTeaApp();

  return (
    <div className="p-4 space-y-6">
      {/* 門市選擇卡片 */}
      <div className="bg-gradient-to-r from-purple-500 to-blue-500 text-white p-4 rounded-xl shadow-lg">
        <div className="flex justify-between items-center">
          <div className="flex-1">
            <h3 className="font-semibold text-lg mb-1">
              {selectedStore?.name || '選擇門市'}
            </h3>
            <div className="flex items-center gap-2 text-sm text-white/90">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
              </svg>
              <span>
                目前等候: {selectedStore?.current_queue_count || 0}人 | 
                預計 {selectedStore?.average_wait_time || 0}分鐘
              </span>
            </div>
          </div>
          <button className="bg-white/20 backdrop-blur-sm p-2 rounded-lg hover:bg-white/30 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </button>
        </div>
      </div>

      {/* 分類標籤 */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => loadProducts(category.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap transition-all duration-200 ${
              selectedCategory === category.id
                ? 'bg-blue-600 text-white shadow-lg'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <span>{category.emoji}</span>
            <span className="text-sm font-medium">{category.label}</span>
          </button>
        ))}
      </div>

      {/* 商品網格 */}
      {isLoading ? (
        <div className="grid grid-cols-2 gap-4">
          {[...Array(6)].map((_, index) => (
            <div key={index} className="bg-gray-200 animate-pulse rounded-xl h-48" />
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🍵</div>
          <h3 className="text-lg font-semibold text-gray-700 mb-2">暫無商品</h3>
          <p className="text-gray-500">敬請期待更多商品上架</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          {products.map((product) => (
            <div
              key={product.id}
              onClick={() => showProductModal(product)}
              className="bg-white rounded-xl shadow-md overflow-hidden cursor-pointer transform hover:scale-105 transition-transform duration-200"
            >
              <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                {product.image_url ? (
                  <img
                    src={product.image_url}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-4xl">
                    {product.category === 'tea' && '🍵'}
                    {product.category === 'coffee' && '☕'}
                    {product.category === 'seasonal' && '🌸'}
                    {product.category === 'snacks' && '🧁'}
                  </div>
                )}
              </div>
              
              <div className="p-3">
                <h4 className="font-semibold text-gray-800 mb-1 line-clamp-2">
                  {product.name}
                </h4>
                
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-blue-600">
                    ${product.price}
                  </span>
                  
                  {product.rating && (
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <svg className="w-3 h-3 text-yellow-400 fill-current" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      <span>{product.rating}</span>
                    </div>
                  )}
                </div>
                
                {product.preparation_time && (
                  <div className="flex items-center gap-1 mt-2 text-xs text-gray-500">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                    </svg>
                    <span>約 {product.preparation_time} 分鐘</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
