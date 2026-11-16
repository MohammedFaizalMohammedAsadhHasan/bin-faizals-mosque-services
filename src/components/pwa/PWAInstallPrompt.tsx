'use client';

import React, { useEffect, useState } from 'react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export const PWAInstallPrompt: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setIsVisible(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setIsVisible(false);
    }
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed top-[max(env(safe-area-inset-top,0px),1rem)] left-1/2 -translate-x-1/2 z-50 w-[94%] max-w-md bg-emerald-950/95 border border-emerald-500/40 text-emerald-100 p-3.5 sm:p-4 rounded-2xl shadow-2xl backdrop-blur-xl flex items-center justify-between gap-3 animate-fade-in">
      <div className="flex items-center gap-2.5 xs:gap-3 min-w-0">
        <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-xl shrink-0">
          🕌
        </div>
        <div className="min-w-0">
          <h4 className="font-bold text-xs xs:text-sm text-emerald-300 truncate">Install Mosque App</h4>
          <p className="text-[11px] xs:text-xs text-emerald-200/80 truncate">Add to home screen for offline prayer alerts</p>
        </div>
      </div>

      <div className="flex items-center gap-1.5 xs:gap-2 shrink-0">
        <button
          onClick={handleInstallClick}
          className="px-3.5 xs:px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-sky-500 hover:from-blue-500 hover:to-sky-400 text-white font-black text-xs transition-colors shadow-md shadow-blue-500/30 min-h-[40px] flex items-center"
        >
          Install
        </button>
        <button
          onClick={handleDismiss}
          className="p-2 text-emerald-400 hover:text-white text-xs font-bold min-w-[36px] min-h-[40px] flex items-center justify-center rounded-lg"
          aria-label="Dismiss install prompt"
        >
          ✕
        </button>
      </div>
    </div>
  );
};
