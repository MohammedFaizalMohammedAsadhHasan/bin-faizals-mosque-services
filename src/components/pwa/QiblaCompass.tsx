'use client';

import React, { useState } from 'react';

export const QiblaCompass: React.FC = () => {
  const [bearing] = useState<number>(292.5); // Default sample bearing for Makkah from Colombo, Sri Lanka
  const [userHeading, setUserHeading] = useState<number>(0);

  const handleSimulateRotate = () => {
    setUserHeading((prev) => (prev + 30) % 360);
  };

  const qiblaRelativeAngle = (bearing - userHeading + 360) % 360;

  return (
    <div className="glass-card-emerald p-4 xs:p-6 sm:p-8 rounded-3xl text-center w-full mx-auto flex flex-col items-center justify-between shadow-2xl border border-emerald-500/30">
      <div>
        <h2 className="text-xl sm:text-2xl font-black text-sky-300 tracking-wide uppercase mb-1">
          Qibla Direction Compass
        </h2>
        <p className="text-xs sm:text-sm text-slate-300 mb-2 sm:mb-4">
          Align arrow with Kaaba (Makkah direction)
        </p>
      </div>

      {/* Responsive Compass Dial */}
      <div className="relative w-44 h-44 xs:w-52 xs:h-52 sm:w-60 sm:h-60 rounded-full border-4 border-sky-400/50 flex items-center justify-center bg-slate-950/90 shadow-2xl my-2 sm:my-4 shrink-0">
        {/* Cardinal Directions */}
        <div className="absolute top-2.5 sm:top-3 text-sky-300 font-black text-xs sm:text-sm">N</div>
        <div className="absolute right-3 sm:right-4 text-sky-300 font-black text-xs sm:text-sm">E</div>
        <div className="absolute bottom-2.5 sm:bottom-3 text-sky-300 font-black text-xs sm:text-sm">S</div>
        <div className="absolute left-3 sm:left-4 text-sky-300 font-black text-xs sm:text-sm">W</div>

        {/* Qibla Indicator Arrow */}
        <div
          className="w-full h-full absolute top-0 left-0 flex items-center justify-center transition-transform duration-500"
          style={{ transform: `rotate(${qiblaRelativeAngle}deg)` }}
        >
          <div className="flex flex-col items-center -translate-y-8 xs:-translate-y-10 sm:-translate-y-12">
            <div className="w-5 h-5 xs:w-6 xs:h-6 bg-sky-400 rotate-45 rounded-sm shadow-lg shadow-sky-400/80 mb-1" />
            <span className="text-[10px] sm:text-xs text-sky-200 font-black tracking-widest bg-black/90 px-2 py-0.5 rounded border border-sky-400/30">
              KAABA
            </span>
          </div>
        </div>
      </div>

      <div>
        <div className="text-sky-300 font-mono text-base sm:text-lg font-bold mt-2">
          Bearing: {bearing.toFixed(1)}° N
        </div>

        <button
          onClick={handleSimulateRotate}
          className="mt-3 sm:mt-4 px-5 sm:px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-sky-500 hover:from-blue-500 hover:to-sky-400 text-white font-bold text-xs sm:text-sm shadow-lg shadow-blue-500/30 transition-all min-h-[44px] flex items-center justify-center mx-auto"
        >
          Simulate Device Rotation
        </button>
      </div>
    </div>
  );
};
