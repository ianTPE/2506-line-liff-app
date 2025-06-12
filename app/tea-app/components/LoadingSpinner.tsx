'use client';

import React from 'react';

export const LoadingSpinner: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-500 via-blue-500 to-purple-700 flex items-center justify-center">
      <div className="bg-white rounded-2xl p-8 shadow-2xl">
        <div className="flex flex-col items-center">
          {/* 旋轉的茶杯動畫 */}
          <div className="relative mb-6">
            <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-2xl">🍵</span>
            </div>
          </div>
          
          <h3 className="text-xl font-semibold text-gray-800 mb-2">載入中...</h3>
          <p className="text-gray-600 text-center">正在為您準備最棒的茶飲體驗</p>
          
          {/* 進度條動畫 */}
          <div className="w-48 bg-gray-200 rounded-full h-2 mt-4 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>
    </div>
  );
};
