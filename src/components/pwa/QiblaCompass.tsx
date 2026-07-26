'use client';

import React, { useState } from 'react';

export const QiblaCompass: React.FC = () => {
  const [bearing, setBearing] = useState<number>(292.5); // Default sample bearing for Makkah
  const [userHeading, setUserHeading] = useState<number>(0);

  const handleSimulateRotate = () => {
    setUserHeading((prev) => (prev + 30) % 360);
  };

  const qiblaRelativeAngle = (bearing - userHeading + 360) % 360;

  return (
    <div className="glass-card-emerald p-8 rounded-3xl text-center max-w-md w-full mx-auto flex flex-col items-center">
      <h2 className="text-2xl font-bold text-amber-400 mb-2">Qibla Direction Compass</h2>
      <p className="text-sm text-slate-300 mb-6">
        Align arrow with Kaaba (Makkah direction)
      </p>

      {/* Compass Dial */}
      <div className="relative w-64 h-64 rounded-full border-4 border-amber-400/50 flex items-center justify-center bg-emerald-950/60 shadow-2xl my-4">
        {/* Cardinal Directions */}
        <div className="absolute top-3 text-amber-300 font-bold text-sm">N</div>
        <div className="absolute right-4 text-amber-300 font-bold text-sm">E</div>
        <div className="absolute bottom-3 text-amber-300 font-bold text-sm">S</div>
        <div className="absolute left-4 text-amber-300 font-bold text-sm">W</div>

        {/* Qibla Indicator Arrow */}
        <div
          className="w-full h-full absolute top-0 left-0 flex items-center justify-center transition-transform duration-500"
          style={{ transform: `rotate(${qiblaRelativeAngle}deg)` }}
        >
          <div className="flex flex-col items-center -translate-y-12">
            <div className="w-6 h-6 bg-amber-400 rotate-45 rounded-sm shadow-lg shadow-amber-400/80 mb-1" />
            <span className="text-xs text-amber-300 font-black tracking-widest bg-black/80 px-2 py-0.5 rounded">
              KAABA
            </span>
          </div>
        </div>
      </div>

      <div className="text-emerald-300 font-mono text-lg font-semibold mt-4">
        Bearing: {bearing.toFixed(1)}° N
      </div>

      <button
        onClick={handleSimulateRotate}
        className="mt-6 px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-sm transition-all"
      >
        Simulate Device Rotation
      </button>
    </div>
  );
};
