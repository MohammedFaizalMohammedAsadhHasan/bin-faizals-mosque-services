'use client';

import React from 'react';
import { SpecialPrayerSchedule } from '@/lib/settings/settingsManager';

interface SpecialPrayerBannerProps {
  specialPrayers: SpecialPrayerSchedule;
}

export const SpecialPrayerBanner: React.FC<SpecialPrayerBannerProps> = ({ specialPrayers }) => {
  const activeItems = Object.entries(specialPrayers).filter(([_, item]) => item && item.enabled);

  if (activeItems.length === 0) return null;

  return (
    <div className="flex flex-col sm:flex-row flex-wrap gap-2.5 sm:gap-4 items-stretch justify-between p-2.5 sm:p-4 rounded-2xl bg-slate-900/60 backdrop-blur-md border border-blue-500/30 shadow-xl mb-2 sm:mb-4 text-slate-100">
      {activeItems.map(([key, item]) => (
        <div
          key={key}
          className="flex-1 flex flex-col xs:flex-row items-start xs:items-center justify-between gap-2.5 sm:gap-4 px-3 sm:px-4 py-2 bg-gradient-to-r from-blue-950/50 via-slate-900/60 to-slate-900/50 rounded-xl border border-blue-400/30"
        >
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
            <span className="text-xl sm:text-2xl shrink-0">🕌</span>
            <div className="min-w-0">
              <span className="text-sky-300 font-black text-xs sm:text-sm tracking-wider uppercase block truncate">
                {item.title}
              </span>
              {item.notes && (
                <span className="text-[11px] sm:text-xs text-slate-300 font-medium italic block truncate">
                  {item.notes}
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-4 text-xs font-mono shrink-0">
            {item.khutbahTime && (
              <div className="bg-slate-950/80 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg border border-blue-500/30">
                <span className="text-slate-400 text-[9px] sm:text-[10px] block uppercase font-sans">Khutbah / Start</span>
                <span className="text-sky-300 font-bold text-xs sm:text-sm">{item.khutbahTime}</span>
              </div>
            )}
            {item.iqamahTime && (
              <div className="bg-slate-950/80 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg border border-sky-400/30">
                <span className="text-slate-400 text-[9px] sm:text-[10px] block uppercase font-sans font-bold">Iqamah</span>
                <span className="text-sky-300 font-bold text-xs sm:text-sm">{item.iqamahTime}</span>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};
