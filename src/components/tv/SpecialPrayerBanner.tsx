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
    <div className="flex flex-wrap gap-4 items-center justify-between p-4 rounded-2xl bg-slate-900/60 backdrop-blur-md border border-amber-500/30 shadow-xl mb-4 text-slate-100">
      {activeItems.map(([key, item]) => (
        <div key={key} className="flex-1 flex items-center justify-between gap-4 px-4 py-2 bg-gradient-to-r from-amber-950/40 via-emerald-950/30 to-slate-900/50 rounded-xl border border-amber-400/20">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🕌</span>
            <div>
              <span className="text-amber-400 font-extrabold text-sm tracking-wider uppercase block">
                {item.title}
              </span>
              <span className="text-xs text-slate-300 font-medium italic">
                {item.notes}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs font-mono">
            {item.khutbahTime && (
              <div className="bg-slate-950/80 px-3 py-1.5 rounded-lg border border-amber-500/20">
                <span className="text-slate-400 text-[10px] block uppercase font-sans">Khutbah / Start</span>
                <span className="text-amber-300 font-bold text-sm">{item.khutbahTime}</span>
              </div>
            )}
            {item.iqamahTime && (
              <div className="bg-slate-950/80 px-3 py-1.5 rounded-lg border border-emerald-500/20">
                <span className="text-slate-400 text-[10px] block uppercase font-sans font-bold">Iqamah</span>
                <span className="text-emerald-400 font-bold text-sm">{item.iqamahTime}</span>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};
