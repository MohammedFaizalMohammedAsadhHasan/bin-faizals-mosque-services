'use client';

import React, { useEffect, useState } from 'react';

interface SplashScreenProps {
  onComplete?: () => void;
  minDurationMs?: number;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({
  onComplete,
  minDurationMs = 2200,
}) => {
  const [progress, setProgress] = useState(0);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const currentProgress = Math.min(100, Math.floor((elapsed / minDurationMs) * 100));
      setProgress(currentProgress);

      if (currentProgress >= 100) {
        clearInterval(interval);
        setFadeOut(true);
        setTimeout(() => {
          if (onComplete) onComplete();
        }, 500);
      }
    }, 30);

    return () => clearInterval(interval);
  }, [minDurationMs, onComplete]);

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#020617] text-white transition-opacity duration-500 ${
        fadeOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* Background Glow */}
      <div className="absolute w-[500px] h-[500px] bg-gradient-to-tr from-amber-500/20 via-emerald-600/20 to-teal-500/10 rounded-full blur-3xl animate-pulse pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center text-center px-6">
        {/* Animated Mosque Crescent Logo */}
        <div className="relative flex items-center justify-center mb-6">
          <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-amber-400 via-amber-500 to-amber-600 p-0.5 shadow-2xl shadow-amber-500/30 animate-bounce">
            <div className="w-full h-full bg-[#030712] rounded-[22px] flex items-center justify-center text-4xl">
              🌙
            </div>
          </div>
          <div className="absolute -inset-2 rounded-full border border-amber-400/30 animate-ping pointer-events-none" />
        </div>

        {/* Brand Name */}
        <h1 className="text-3xl md:text-5xl font-black uppercase tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-400 to-amber-500 drop-shadow-md">
          BIN FAIZAL&apos;S
        </h1>
        <p className="text-emerald-400 text-sm md:text-base font-bold tracking-widest uppercase mt-2">
          Mosque Services • Smart Kiosk & PWA
        </p>

        {/* Loading Progress Bar */}
        <div className="w-64 md:w-80 h-2 bg-slate-900 rounded-full overflow-hidden mt-8 border border-slate-800 p-0.5 shadow-inner">
          <div
            className="h-full bg-gradient-to-r from-emerald-500 via-teal-400 to-amber-400 rounded-full transition-all duration-75 ease-out shadow-lg shadow-emerald-500/50"
            style={{ width: `${progress}%` }}
          />
        </div>

        <span className="text-xs font-mono text-slate-400 mt-3 font-semibold tracking-wider">
          Initializing Engine... {progress}%
        </span>
      </div>
    </div>
  );
};
