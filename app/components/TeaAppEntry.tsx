// 在現有組件中添加茶飲應用入口的示例

import Link from 'next/link';
import React from 'react';

/**
 * 茶飲應用入口卡片組件
 * 可以在任何頁面中使用這個組件來添加茶飲應用的入口
 */
export const TeaAppEntryCard: React.FC = () => {
  return (
    <div className="bg-gradient-to-r from-purple-500 via-blue-500 to-purple-700 rounded-2xl shadow-xl p-6 text-white">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-4xl">🍵</span>
            <div>
              <h2 className="text-2xl font-bold">茶語時光</h2>
              <p className="text-white/80">智慧茶飲預約系統</p>
            </div>
          </div>
          
          <p className="text-white/90 mb-4">
            體驗全新的 LINE 生態圈茶飲點餐系統，支援線上預約、會員卡、點數累積。
          </p>
          
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1">
              <span>✨</span>
              <span>即時預約</span>
            </div>
            <div className="flex items-center gap-1">
              <span>🏆</span>
              <span>會員累點</span>
            </div>
            <div className="flex items-center gap-1">
              <span>🎁</span>
              <span>優惠活動</span>
            </div>
          </div>
        </div>
        
        <Link href="/tea-app">
          <button className="bg-white text-purple-600 px-6 py-3 rounded-xl font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-200 ml-4">
            立即體驗
            <span className="ml-2">→</span>
          </button>
        </Link>
      </div>
    </div>
  );
};

/**
 * 簡化版的茶飲應用入口按鈕
 */
export const TeaAppButton: React.FC = () => {
  return (
    <Link href="/tea-app">
      <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-200 flex items-center gap-2">
        <span>🍵</span>
        <span>茶語時光</span>
      </button>
    </Link>
  );
};

/**
 * 導航菜單中的茶飲應用鏈接
 */
export const TeaAppNavLink: React.FC = () => {
  return (
    <Link 
      href="/tea-app" 
      className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"
    >
      <span className="text-xl">🍵</span>
      <span className="font-medium">茶飲預約</span>
    </Link>
  );
};

/**
 * 如何在現有頁面中使用：
 * 
 * 1. 在主頁面中添加完整卡片：
 *    import { TeaAppEntryCard } from './components/TeaAppEntry';
 *    <TeaAppEntryCard />
 * 
 * 2. 在工具欄中添加按鈕：
 *    import { TeaAppButton } from './components/TeaAppEntry';
 *    <TeaAppButton />
 * 
 * 3. 在導航菜單中添加鏈接：
 *    import { TeaAppNavLink } from './components/TeaAppEntry';
 *    <TeaAppNavLink />
 */

// 也可以直接使用 Next.js Link 組件
export const SimpleTeaAppLink: React.FC = () => (
  <Link href="/tea-app" className="text-blue-600 hover:underline">
    前往茶飲預約系統
  </Link>
);

export default {
  TeaAppEntryCard,
  TeaAppButton,
  TeaAppNavLink,
  SimpleTeaAppLink,
};
