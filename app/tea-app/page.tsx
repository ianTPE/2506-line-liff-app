'use client';

import React from 'react';
import { TeaAppProvider } from './providers/TeaAppProvider';
import { TeaAppMain } from './components/TeaAppMain';

export default function TeaAppPage() {
  return (
    <TeaAppProvider>
      <div className="min-h-screen bg-gradient-to-br from-purple-500 via-blue-500 to-purple-700">
        <TeaAppMain />
      </div>
    </TeaAppProvider>
  );
}
