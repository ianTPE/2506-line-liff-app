'use client';

import { useState } from 'react';
import { useLiff } from '../providers/LiffProvider';

export function LiffFeatures() {
  const { liff, isInClient } = useLiff();
  const [scanResult, setScanResult] = useState<string>('');

  const sendMessage = async () => {
    if (!liff || !liff.isInClient()) {
      alert('此功能只能在 LINE 應用程式內使用');
      return;
    }

    try {
      await liff.sendMessages([
        {
          type: 'text',
          text: '這是從 LIFF 應用程式發送的訊息！',
        },
      ]);
      alert('訊息已發送');
    } catch (error) {
      console.error('發送訊息失敗:', error);
      alert('發送訊息失敗');
    }
  };

  const scanCode = async () => {
    if (!liff || !liff.isInClient()) {
      alert('此功能只能在 LINE 應用程式內使用');
      return;
    }

    try {
      const result = await liff.scanCodeV2();
      setScanResult(result.value || '無法讀取');
    } catch (error) {
      console.error('掃描失敗:', error);
      alert('掃描失敗');
    }
  };

  const shareMessage = async () => {
    if (!liff) return;

    try {
      await liff.shareTargetPicker([
        {
          type: 'text',
          text: '來自 LIFF 應用程式的分享訊息！',
        },
      ]);
    } catch (error) {
      console.error('分享失敗:', error);
      alert('分享失敗');
    }
  };

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-6">LIFF 功能展示</h2>
      
      <div className="space-y-4">
        <div>
          <button
            onClick={sendMessage}
            disabled={!isInClient}
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition disabled:bg-gray-400"
          >
            發送訊息到聊天室
          </button>
          {!isInClient && (
            <p className="text-sm text-gray-500 mt-1">僅限 LINE 應用程式內使用</p>
          )}
        </div>

        <div>
          <button
            onClick={scanCode}
            disabled={!isInClient}
            className="bg-purple-500 text-white px-4 py-2 rounded-md hover:bg-purple-600 transition disabled:bg-gray-400"
          >
            掃描 QR Code
          </button>
          {scanResult && (
            <p className="mt-2 p-2 bg-gray-100 rounded">掃描結果：{scanResult}</p>
          )}
        </div>

        <div>
          <button
            onClick={shareMessage}
            className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition"
          >
            分享訊息
          </button>
        </div>
      </div>
    </div>
  );
}
