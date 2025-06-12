import Link from 'next/link';
import { UserProfile } from './components/UserProfile';
import LiffFeatures from './components/LiffFeaturesDynamic';

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto py-8">
        <h1 className="text-3xl font-bold text-center mb-8">
          My LIFF App
        </h1>
        
        {/* 茶飲應用卡片 */}
        <div className="bg-gradient-to-r from-purple-500 via-blue-500 to-purple-700 rounded-2xl shadow-xl p-6 mb-6 text-white">
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
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <UserProfile />
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <LiffFeatures />
        </div>
      </div>
    </main>
  );
}
