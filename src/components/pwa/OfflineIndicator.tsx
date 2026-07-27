'use client';

import React, { useEffect, useState } from 'react';

export const OfflineIndicator: React.FC = () => {
  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    setIsOffline(!navigator.onLine);

    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (!isOffline) return null;

  return (
    <div className="fixed bottom-4 left-4 z-50 flex items-center gap-2 bg-amber-950/90 border border-amber-500/40 text-amber-200 px-4 py-2.5 rounded-xl shadow-2xl backdrop-blur-md text-xs font-bold animate-pulse">
      <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
      <span>Offline Mode Active • Using Cached Prayer Schedules</span>
    </div>
  );
};
