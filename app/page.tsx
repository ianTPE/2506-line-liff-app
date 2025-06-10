import { UserProfile } from './components/UserProfile';
import dynamic from 'next/dynamic';
const LiffFeatures = dynamic(
  () => import('./components/LiffFeatures').then(mod => mod.LiffFeatures),
  { 
    loading: () => <p>載入功能中...</p>,
    ssr: false // LIFF 功能只在客戶端執行
  }
);

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto py-8">
        <h1 className="text-3xl font-bold text-center mb-8">
          My LIFF App
        </h1>
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
