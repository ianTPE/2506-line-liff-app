import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { LiffProvider } from './providers/LiffProvider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'My LIFF App',
  description: '使用 Next.js 15 和 React 19 打造的 LIFF 應用程式',
  openGraph: {
    images: [
      {
        url: '/images/default-og-image.webp',
        width: 1200,
        height: 630,
        alt: 'My LIFF App 預設分享圖',
      },
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-TW">
      <body className={inter.className}>
        <LiffProvider liffId={process.env.NEXT_PUBLIC_LIFF_ID || ''}>
          {children}
        </LiffProvider>
      </body>
    </html>
  );
}
