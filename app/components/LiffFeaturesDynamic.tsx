"use client";

import dynamic from 'next/dynamic';

const LiffFeatures = dynamic(
  () => import('./LiffFeatures').then(mod => mod.LiffFeatures),
  {
    loading: () => <p>載入功能中...</p>,
    ssr: false,
  }
);

export default LiffFeatures;
