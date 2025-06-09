'use client';

import { useState, useEffect } from 'react';
import { useLiff } from '../providers/LiffProvider';
import { Profile } from '@liff/get-profile';

export function UserProfile() {
  const { liff, isLoggedIn, isReady } = useLiff();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isReady && isLoggedIn && liff) {
      fetchProfile();
    }
  }, [isReady, isLoggedIn, liff]);

  const fetchProfile = async () => {
    if (!liff) return;
    
    setLoading(true);
    try {
      const userProfile = await liff.getProfile();
      setProfile(userProfile);
    } catch (error) {
      console.error('無法取得使用者資料:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = () => {
    if (liff) {
      liff.login();
    }
  };

  const handleLogout = () => {
    if (liff) {
      liff.logout();
      window.location.reload();
    }
  };

  if (!isReady) {
    return <div>載入中...</div>;
  }

  if (!isLoggedIn) {
    return (
      <div className="text-center p-8">
        <p className="mb-4">請先登入 LINE</p>
        <button
          onClick={handleLogin}
          className="bg-green-500 text-white px-6 py-2 rounded-md hover:bg-green-600 transition"
        >
          使用 LINE 登入
        </button>
      </div>
    );
  }

  if (loading) {
    return <div>載入使用者資料...</div>;
  }

  return (
    <div className="text-center p-8">
      {profile && (
        <div className="mb-6">
          <img
            src={profile.pictureUrl}
            alt="Profile"
            className="w-24 h-24 rounded-full mx-auto mb-4"
          />
          <h2 className="text-xl font-bold">{profile.displayName}</h2>
          <p className="text-gray-600 text-sm">{profile.userId}</p>
          {profile.statusMessage && (
            <p className="text-gray-500 mt-2">{profile.statusMessage}</p>
          )}
        </div>
      )}
      <button
        onClick={handleLogout}
        className="bg-red-500 text-white px-6 py-2 rounded-md hover:bg-red-600 transition"
      >
        登出
      </button>
    </div>
  );
}
