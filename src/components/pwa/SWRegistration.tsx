'use client';

import { useEffect, useState } from 'react';

export function SWRegistration() {
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [swRegistration, setSwRegistration] = useState<ServiceWorkerRegistration | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
      return;
    }

    // Register Service Worker
    navigator.serviceWorker
      .register('/sw.js')
      .then((reg) => {
        setSwRegistration(reg);

        // Check for updates on load
        reg.addEventListener('updatefound', () => {
          const newWorker = reg.installing;
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                setUpdateAvailable(true);
              }
            });
          }
        });
      })
      .catch((err) => {
        console.error('Service Worker registration failed:', err);
      });

    // Check version.json periodically (every 5 minutes)
    const checkVersion = async () => {
      try {
        const res = await fetch('/version.json', { cache: 'no-store' });
        if (res.ok) {
          const data = await res.json();
          const currentVersion = localStorage.getItem('app_version');

          if (currentVersion && currentVersion !== data.version) {
            localStorage.setItem('app_version', data.version);
            if (data.forceReload) {
              window.location.reload();
            } else {
              setUpdateAvailable(true);
            }
          } else {
            localStorage.setItem('app_version', data.version);
          }
        }
      } catch {
        // Ignore offline version check failures
      }
    };

    checkVersion();
    const interval = setInterval(checkVersion, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  const handleUpdate = () => {
    if (swRegistration && swRegistration.waiting) {
      swRegistration.waiting.postMessage({ type: 'SKIP_WAITING' });
    }
    window.location.reload();
  };

  if (!updateAvailable) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex items-center gap-3 bg-emerald-950 border border-emerald-500/30 text-emerald-100 px-4 py-3 rounded-xl shadow-2xl backdrop-blur-md animate-bounce">
      <div className="text-xs">
        <p className="font-semibold text-emerald-400">Update Available</p>
        <p className="text-emerald-300/80">New version of Mosque Services is ready.</p>
      </div>
      <button
        onClick={handleUpdate}
        className="bg-emerald-500 hover:bg-emerald-600 text-emerald-950 font-bold px-3 py-1.5 rounded-lg text-xs transition-colors"
      >
        Update Now
      </button>
    </div>
  );
}
