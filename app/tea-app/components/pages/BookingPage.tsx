'use client';

import React, { useState, useEffect } from 'react';
import { useTeaApp } from '../../providers/TeaAppProvider';

interface TimeSlot {
  time: string;
  available: boolean;
  queueCount?: number;
}

export const BookingPage: React.FC = () => {
  const { selectedStore, stores, selectStore } = useTeaApp();
  const [pickupType, setPickupType] = useState<'now' | 'scheduled'>('now');
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);

  // 生成時間段
  useEffect(() => {
    if (pickupType === 'scheduled') {
      generateTimeSlots();
    }
  }, [pickupType]);

  const generateTimeSlots = () => {
    const now = new Date();
    const slots: TimeSlot[] = [];
    
    for (let i = 1; i <= 12; i++) {
      const time = new Date(now.getTime() + (i * 30 * 60 * 1000));
      const timeStr = time.toLocaleTimeString('zh-TW', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: false 
      });
      
      // 模擬可用性（隨機）
      const isAvailable = Math.random() > 0.2;
      const queueCount = Math.floor(Math.random() * 15);
      
      slots.push({
        time: timeStr,
        available: isAvailable,
        queueCount: isAvailable ? queueCount : undefined,
      });
    }
    
    setTimeSlots(slots);
  };

  const handleTimeSlotSelect = (time: string) => {
    setSelectedTime(time);
  };

  const handleConfirmBooking = () => {
    if (pickupType === 'scheduled' && !selectedTime) {
      alert('請選擇取餐時間');
      return;
    }

    const message = pickupType === 'now' 
      ? '已確認立即取餐，請準備前往門市'
      : `已確認預約 ${selectedTime} 取餐`;
    
    alert(message);
  };

  return (
    <div className="p-4 space-y-6">
      {/* 取餐方式選擇 */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4">取餐方式</h3>
        
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => setPickupType('now')}
            className={`p-4 rounded-xl border-2 transition-all duration-200 ${
              pickupType === 'now'
                ? 'border-blue-500 bg-blue-50 text-blue-700'
                : 'border-gray-200 bg-gray-50 text-gray-600 hover:border-gray-300'
            }`}
          >
            <div className="text-center">
              <div className="text-3xl mb-2">⚡</div>
              <div className="font-semibold">立即取餐</div>
              <div className="text-sm mt-1">約需 {selectedStore?.average_wait_time || 15} 分鐘</div>
            </div>
          </button>

          <button
            onClick={() => setPickupType('scheduled')}
            className={`p-4 rounded-xl border-2 transition-all duration-200 ${
              pickupType === 'scheduled'
                ? 'border-blue-500 bg-blue-50 text-blue-700'
                : 'border-gray-200 bg-gray-50 text-gray-600 hover:border-gray-300'
            }`}
          >
            <div className="text-center">
              <div className="text-3xl mb-2">🕐</div>
              <div className="font-semibold">預約取餐</div>
              <div className="text-sm mt-1">指定時間取餐</div>
            </div>
          </button>
        </div>
      </div>

      {/* 時間選擇（預約模式） */}
      {pickupType === 'scheduled' && (
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4">選擇時間</h3>
          
          <div className="grid grid-cols-3 gap-3">
            {timeSlots.map((slot) => (
              <button
                key={slot.time}
                onClick={() => slot.available && handleTimeSlotSelect(slot.time)}
                disabled={!slot.available}
                className={`p-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                  slot.time === selectedTime
                    ? 'bg-blue-600 text-white shadow-lg'
                    : slot.available
                    ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    : 'bg-gray-50 text-gray-400 cursor-not-allowed'
                }`}
              >
                <div>{slot.time}</div>
                {slot.available && slot.queueCount !== undefined && (
                  <div className="text-xs mt-1 opacity-75">
                    {slot.queueCount} 人排隊
                  </div>
                )}
                {!slot.available && (
                  <div className="text-xs mt-1">已滿</div>
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 門市選擇 */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4">選擇門市</h3>
        
        <div className="space-y-3">
          {stores.map((store) => (
            <button
              key={store.id}
              onClick={() => selectStore(store)}
              className={`w-full p-4 rounded-lg border-2 text-left transition-all duration-200 ${
                selectedStore?.id === store.id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
              }`}
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="font-semibold text-gray-800">{store.name}</div>
                  <div className="text-sm text-gray-600 mt-1">{store.address}</div>
                  <div className="text-sm text-gray-500 mt-1">{store.operating_hours}</div>
                </div>
                
                <div className="text-right">
                  <div className="text-sm font-medium text-gray-700">
                    等候 {store.current_queue_count} 人
                  </div>
                  <div className="text-xs text-gray-500">
                    約 {store.average_wait_time} 分鐘
                  </div>
                </div>
              </div>

              {/* 距離資訊（模擬） */}
              <div className="flex items-center gap-2 mt-3 text-xs text-gray-500">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>距離約 {Math.floor(Math.random() * 2000 + 500)}m</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* 預約摘要 */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl shadow-lg p-6">
        <h3 className="font-semibold text-lg mb-4">預約摘要</h3>
        
        <div className="space-y-2 mb-6">
          <div className="flex justify-between">
            <span>門市：</span>
            <span>{selectedStore?.name || '請選擇門市'}</span>
          </div>
          
          <div className="flex justify-between">
            <span>取餐方式：</span>
            <span>
              {pickupType === 'now' ? '立即取餐' : '預約取餐'}
            </span>
          </div>
          
          {pickupType === 'scheduled' && (
            <div className="flex justify-between">
              <span>預約時間：</span>
              <span>{selectedTime || '請選擇時間'}</span>
            </div>
          )}
          
          <div className="flex justify-between">
            <span>預計等候：</span>
            <span>
              {pickupType === 'now' 
                ? `${selectedStore?.average_wait_time || 15} 分鐘`
                : selectedTime 
                  ? timeSlots.find(slot => slot.time === selectedTime)?.queueCount + ' 人排隊'
                  : '-'
              }
            </span>
          </div>
        </div>

        <button
          onClick={handleConfirmBooking}
          disabled={!selectedStore || (pickupType === 'scheduled' && !selectedTime)}
          className="w-full bg-white text-blue-600 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          確認預約
        </button>
      </div>
    </div>
  );
};
