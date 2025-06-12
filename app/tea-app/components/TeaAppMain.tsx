'use client';

import React from 'react';
import { useTeaApp } from '../providers/TeaAppProvider';
import { AppHeader } from './AppHeader';
import { NavigationTabs } from './NavigationTabs';
import { HomePage } from './pages/HomePage';
import { CartPage } from './pages/CartPage';
import { BookingPage } from './pages/BookingPage';
import { MemberPage } from './pages/MemberPage';
import { ProductModal } from './ProductModal';
import { LoadingSpinner } from './LoadingSpinner';

export const TeaAppMain: React.FC = () => {
  const { currentPage, isLoading, isModalOpen } = useTeaApp();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage />;
      case 'cart':
        return <CartPage />;
      case 'booking':
        return <BookingPage />;
      case 'member':
        return <MemberPage />;
      default:
        return <HomePage />;
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white min-h-screen relative overflow-hidden">
      <AppHeader />
      <NavigationTabs />
      
      <main className="pb-20">
        {renderCurrentPage()}
      </main>

      {isModalOpen && <ProductModal />}
    </div>
  );
};
