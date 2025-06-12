'use client';

import React, { useState } from 'react';
import { useTeaApp } from '../../providers/TeaAppProvider';

const membershipLevels = {
  bronze: { label: '銅卡', color: 'from-orange-400 to-orange-600', icon: '🥉' },
  silver: { label: '銀卡', color: 'from-gray-400 to-gray-600', icon: '🥈' },
  gold: { label: '金卡', color: 'from-yellow-400 to-yellow-600', icon: '🥇' },
};

// 模擬訂單歷史
const mockOrderHistory = [
  {
    id: 'order-001',
    date: '2024-01-15',
    items: ['珍珠奶茶', '冬瓜檸檬'],
    total: 95,
    status: 'completed' as const,
  },
  {
    id: 'order-002',
    date: '2024-01-12',
    items: ['美式咖啡', '起司蛋糕'],
    total: 140,
    status: 'completed' as const,
  },
  {
    id: 'order-003',
    date: '2024-01-10',
    items: ['草莓奶昔'],
    total: 75,
    status: 'processing' as const,
  },
];

export const MemberPage: React.FC = () => {
  const { user } = useTeaApp();
  const [activeTab, setActiveTab] = useState<'overview' | 'points' | 'orders' | 'settings'>('overview');

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="text-6xl mb-4">👤</div>
          <h3 className="text-lg font-semibold text-gray-700">載入中...</h3>
        </div>
      </div>
    );
  }

  const memberLevel = membershipLevels[user.membership_level];

  const renderOverview = () => (
    <div className="space-y-6">
      {/* 會員卡片 */}
      <div className={`bg-gradient-to-r ${memberLevel.color} text-white rounded-2xl p-6 shadow-xl`}>
        <div className="flex justify-between items-start mb-4">
          <div>
            <div className="text-lg opacity-90">{memberLevel.label}會員</div>
            <div className="text-2xl font-bold">{user.display_name}</div>
          </div>
          <div className="text-4xl">{memberLevel.icon}</div>
        </div>
        
        <div className="grid grid-cols-2 gap-6 mt-6">
          <div>
            <div className="text-sm opacity-80">可用點數</div>
            <div className="text-xl font-bold">{user.points_balance.toLocaleString()}</div>
          </div>
          <div>
            <div className="text-sm opacity-80">錢包餘額</div>
            <div className="text-xl font-bold">${user.wallet_balance.toLocaleString()}</div>
          </div>
        </div>
      </div>

      {/* 快捷功能 */}
      <div className="grid grid-cols-2 gap-4">
        <button
          onClick={() => alert('儲值功能開發中')}
          className="bg-white rounded-xl shadow-md p-6 text-center hover:shadow-lg transition-shadow"
        >
          <div className="text-3xl mb-2">💰</div>
          <div className="font-semibold">線上儲值</div>
          <div className="text-sm text-gray-500 mt-1">享儲值優惠</div>
        </button>

        <button
          onClick={() => setActiveTab('points')}
          className="bg-white rounded-xl shadow-md p-6 text-center hover:shadow-lg transition-shadow"
        >
          <div className="text-3xl mb-2">🎁</div>
          <div className="font-semibold">點數兌換</div>
          <div className="text-sm text-gray-500 mt-1">查看兌換商品</div>
        </button>

        <button
          onClick={() => alert('優惠券功能開發中')}
          className="bg-white rounded-xl shadow-md p-6 text-center hover:shadow-lg transition-shadow"
        >
          <div className="text-3xl mb-2">🎫</div>
          <div className="font-semibold">我的優惠券</div>
          <div className="text-sm text-gray-500 mt-1">3 張可用</div>
        </button>

        <button
          onClick={() => setActiveTab('settings')}
          className="bg-white rounded-xl shadow-md p-6 text-center hover:shadow-lg transition-shadow"
        >
          <div className="text-3xl mb-2">⚙️</div>
          <div className="font-semibold">帳戶設定</div>
          <div className="text-sm text-gray-500 mt-1">個人資料管理</div>
        </button>
      </div>

      {/* 會員權益 */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4">會員權益</h3>
        
        <div className="space-y-3">
          <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
            <div className="text-green-600">✅</div>
            <div className="flex-1">
              <div className="font-medium">點數回饋</div>
              <div className="text-sm text-gray-600">
                {user.membership_level === 'bronze' && '消費滿額送 1% 點數'}
                {user.membership_level === 'silver' && '消費滿額送 1.5% 點數'}
                {user.membership_level === 'gold' && '消費滿額送 2% 點數'}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
            <div className="text-blue-600">🎂</div>
            <div className="flex-1">
              <div className="font-medium">生日優惠</div>
              <div className="text-sm text-gray-600">生日當月享 9 折優惠</div>
            </div>
          </div>

          {user.membership_level !== 'bronze' && (
            <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
              <div className="text-purple-600">⚡</div>
              <div className="flex-1">
                <div className="font-medium">預約免排隊</div>
                <div className="text-sm text-gray-600">享受優先製作服務</div>
              </div>
            </div>
          )}

          {user.membership_level === 'gold' && (
            <div className="flex items-center gap-3 p-3 bg-yellow-50 rounded-lg">
              <div className="text-yellow-600">🌟</div>
              <div className="flex-1">
                <div className="font-medium">每週免費飲品</div>
                <div className="text-sm text-gray-600">每週可兌換一杯免費飲品</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderPoints = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4">點數概況</h3>
        
        <div className="text-center mb-6">
          <div className="text-4xl font-bold text-blue-600 mb-2">
            {user.points_balance.toLocaleString()}
          </div>
          <div className="text-gray-600">可用點數</div>
        </div>

        <div className="bg-blue-50 rounded-lg p-4 mb-4">
          <div className="text-sm text-blue-800 font-medium mb-1">兌換提醒</div>
          <div className="text-sm text-blue-600">
            100 點數 = $1 折抵，點數有效期限為 12 個月
          </div>
        </div>
      </div>

      {/* 點數兌換選項 */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4">點數兌換</h3>
        
        <div className="grid grid-cols-2 gap-4">
          <button className="p-4 border-2 border-dashed border-gray-300 rounded-lg text-center hover:border-blue-400 transition-colors">
            <div className="text-2xl mb-2">☕</div>
            <div className="font-medium">免費飲品</div>
            <div className="text-sm text-gray-500">500 點數</div>
          </button>

          <button className="p-4 border-2 border-dashed border-gray-300 rounded-lg text-center hover:border-blue-400 transition-colors">
            <div className="text-2xl mb-2">🎂</div>
            <div className="font-medium">甜點優惠</div>
            <div className="text-sm text-gray-500">300 點數</div>
          </button>

          <button className="p-4 border-2 border-dashed border-gray-300 rounded-lg text-center hover:border-blue-400 transition-colors">
            <div className="text-2xl mb-2">🔄</div>
            <div className="font-medium">升級大杯</div>
            <div className="text-sm text-gray-500">100 點數</div>
          </button>

          <button className="p-4 border-2 border-dashed border-gray-300 rounded-lg text-center hover:border-blue-400 transition-colors">
            <div className="text-2xl mb-2">💸</div>
            <div className="font-medium">現金折抵</div>
            <div className="text-sm text-gray-500">任意點數</div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderOrders = () => (
    <div className="space-y-4">
      {mockOrderHistory.map((order) => (
        <div key={order.id} className="bg-white rounded-xl shadow-md p-4">
          <div className="flex justify-between items-start mb-3">
            <div>
              <div className="font-semibold">訂單 #{order.id.slice(-3)}</div>
              <div className="text-sm text-gray-500">{order.date}</div>
            </div>
            
            <div className={`px-3 py-1 rounded-full text-xs font-medium ${
              order.status === 'completed' 
                ? 'bg-green-100 text-green-800' 
                : 'bg-orange-100 text-orange-800'
            }`}>
              {order.status === 'completed' ? '已完成' : '處理中'}
            </div>
          </div>

          <div className="text-sm text-gray-600 mb-2">
            {order.items.join('、')}
          </div>

          <div className="flex justify-between items-center">
            <span className="font-semibold text-blue-600">${order.total}</span>
            <button className="text-blue-600 text-sm hover:underline">
              查看詳情
            </button>
          </div>
        </div>
      ))}
    </div>
  );

  const renderSettings = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4">個人資料</h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              顯示名稱
            </label>
            <input
              type="text"
              value={user.display_name}
              readOnly
              className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              手機號碼
            </label>
            <input
              type="tel"
              placeholder="請輸入手機號碼"
              className="w-full p-3 border border-gray-300 rounded-lg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              電子郵件
            </label>
            <input
              type="email"
              placeholder="請輸入電子郵件"
              className="w-full p-3 border border-gray-300 rounded-lg"
            />
          </div>
        </div>

        <button className="w-full mt-6 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
          儲存變更
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4">通知設定</h3>
        
        <div className="space-y-4">
          <label className="flex items-center justify-between">
            <span>訂單狀態通知</span>
            <input type="checkbox" defaultChecked className="w-5 h-5 text-blue-600 rounded" />
          </label>

          <label className="flex items-center justify-between">
            <span>優惠活動通知</span>
            <input type="checkbox" defaultChecked className="w-5 h-5 text-blue-600 rounded" />
          </label>

          <label className="flex items-center justify-between">
            <span>生日優惠提醒</span>
            <input type="checkbox" defaultChecked className="w-5 h-5 text-blue-600 rounded" />
          </label>
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-4">
      {/* Tab 導航 */}
      <div className="flex bg-white rounded-xl shadow-md mb-6 p-1">
        {[
          { id: 'overview', label: '概況', icon: '📊' },
          { id: 'points', label: '點數', icon: '🎁' },
          { id: 'orders', label: '訂單', icon: '📋' },
          { id: 'settings', label: '設定', icon: '⚙️' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? 'bg-blue-100 text-blue-700'
                : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
            }`}
          >
            <span>{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab 內容 */}
      {activeTab === 'overview' && renderOverview()}
      {activeTab === 'points' && renderPoints()}
      {activeTab === 'orders' && renderOrders()}
      {activeTab === 'settings' && renderSettings()}
    </div>
  );
};
