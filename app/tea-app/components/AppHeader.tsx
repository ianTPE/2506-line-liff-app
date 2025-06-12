'use client';

import React from 'react';
import { useTeaApp } from '../providers/TeaAppProvider';

export const AppHeader: React.FC = () => {
  const { user } = useTeaApp();

  return (
    <header className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 sticky top-0 z-50 shadow-lg">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          {user?.picture_url && (
            <img
              src={user.picture_url}
              alt="User Avatar"
              className="w-10 h-10 rounded-full border-2 border-white/30"
            />
          )}
          <div>
            <div className="font-semibold text-lg">
              {user?.display_name || '載入中...'}
            </div>
            <div className="text-sm text-white/80 capitalize">
              {user?.membership_level || 'bronze'} 會員
            </div>
          </div>
        </div>
        
        <div className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
          <div className="flex items-center gap-1 text-sm">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z"/>
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd"/>
            </svg>
            <span>{user?.points_balance || 0} 點</span>
          </div>
        </div>
      </div>
    </header>
  );
};
