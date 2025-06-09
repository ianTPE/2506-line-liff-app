import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // 圖片優化設定
  images: {
    domains: ['images.unsplash.com', 'cdn.example.com'],
    formats: ['image/webp', 'image/avif'],
  },
  // 多語系設定
  i18n: {
    locales: ['zh-TW', 'en'],
    defaultLocale: 'zh-TW',
  },
  // 自動導向設定
  async redirects() {
    return [
      {
        source: '/old-path',
        destination: '/new-path',
        permanent: true,
      },
    ];
  },
  // 自訂路由轉發
  async rewrites() {
    return [
      {
        source: '/api/:slug*',
        destination: 'https://api.example.com/:slug*',
      },
    ];
  },
  // 啟用實驗性功能
  experimental: {
    // 為認證錯誤提供更好的支援
    authInterrupts: true,
  },
};

export default nextConfig;
