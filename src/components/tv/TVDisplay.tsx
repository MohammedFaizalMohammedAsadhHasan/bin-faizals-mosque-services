'use client';

import React, { useState, useEffect } from 'react';
import { resolvePrayerState, getTodayPrayerTimes, formatTo12Hour, PrayerTimes, PrayerState } from '@/lib/prayer/prayerEngine';
import { AdhanModal } from './AdhanModal';

export const TVDisplay: React.FC = () => {
  const [time, setTime] = useState<Date | null>(null);
  const [prayerTimes, setPrayerTimes] = useState<PrayerTimes | null>(null);
  const [prayerState, setPrayerState] = useState<PrayerState | null>(null);
  const [dismissedAzan, setDismissedAzan] = useState(false);

  useEffect(() => {
    const now = new Date();
    const activeTimes = getTodayPrayerTimes(now);
    setTime(now);
    setPrayerTimes(activeTimes);
    setPrayerState(resolvePrayerState(activeTimes, now));

    const timer = setInterval(() => {
      const current = new Date();
      const todayTimes = getTodayPrayerTimes(current);
      setTime(current);
      setPrayerTimes(todayTimes);
      setPrayerState(resolvePrayerState(todayTimes, current));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  if (!time || !prayerTimes || !prayerState) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-[#030712] text-amber-400 font-extrabold text-3xl tracking-widest uppercase">
        Initializing BIN FAIZAL&apos;S TV Display System...
      </div>
    );
  }

  const formatSeconds = (sec: number) => {
    const hrs = Math.floor(sec / 3600);
    const mins = Math.floor((sec % 3600) / 60);
    const secs = sec % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const prayersList: { key: keyof PrayerTimes; label: string; timeStr: string }[] = [
    { key: 'fajr', label: 'FAJR / SUBAH', timeStr: prayerTimes.fajr },
    { key: 'sunrise', label: 'SUNRISE', timeStr: prayerTimes.sunrise },
    { key: 'dhuhr', label: 'DHUHR / LUHAR', timeStr: prayerTimes.dhuhr },
    { key: 'asr', label: 'ASR', timeStr: prayerTimes.asr },
    { key: 'maghrib', label: 'MAGHRIB', timeStr: prayerTimes.maghrib },
    { key: 'isha', label: 'ISHA', timeStr: prayerTimes.isha },
  ];

  return (
    <div className="tv-container flex flex-col h-screen w-screen p-6 select-none overflow-hidden justify-between">
      {/* Adhan Modal Overlay */}
      <AdhanModal
        prayerName={prayerState.nextPrayer}
        isOpen={prayerState.isAzanActive && !dismissedAzan}
        onClose={() => setDismissedAzan(true)}
      />

      {/* Top Header Bar */}
      <header className="glass-panel flex justify-between items-center px-8 py-4 rounded-2xl shrink-0 border border-slate-800">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center font-bold text-slate-950 text-2xl shadow-lg shadow-amber-500/30">
            BF
          </div>
          <div>
            <h1 className="text-3xl font-black tracking-wider text-amber-400 uppercase">
              BIN FAIZAL&apos;S MOSQUE
            </h1>
            <p className="text-sm font-semibold tracking-widest text-emerald-400 uppercase">
              OFFICIAL ANNUAL PRAYER TIMETABLE DISPLAY
            </p>
          </div>
        </div>

        {/* Real-time Clock (12-hour format with AM/PM) & Dates */}
        <div className="text-right flex items-center gap-6">
          <div className="text-5xl font-black font-mono tracking-tight text-white drop-shadow-md">
            {time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true })}
          </div>
          <div className="h-10 w-px bg-slate-700/60" />
          <div className="text-right">
            <div className="text-sm font-bold text-slate-200 uppercase tracking-wide">
              {time.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
            </div>
            <div className="text-base font-arabic font-bold text-amber-300 mt-0.5">
              ١٢ صَفَر ١٤٤٨ هـ
            </div>
          </div>
        </div>
      </header>

      {/* Center Grid Area */}
      <main className="grid grid-cols-12 gap-6 my-4 flex-1 items-stretch overflow-hidden">
        {/* Left Side: 6 Prayer Time Cards */}
        <div className="col-span-8 grid grid-cols-3 grid-rows-2 gap-5 h-full">
          {prayersList.map((item) => {
            const isActive = prayerState.nextPrayer === item.key;
            return (
              <div
                key={item.key}
                className={`flex flex-col justify-between p-6 rounded-2xl transition-all duration-300 ${
                  isActive ? 'glass-card-active pulse-gold' : 'glass-card-inactive hover:border-slate-600'
                }`}
              >
                <div className="flex justify-between items-center">
                  <span className={`text-base font-black tracking-widest uppercase ${isActive ? 'text-amber-300' : 'text-slate-400'}`}>
                    {item.label}
                  </span>
                  {isActive && (
                    <span className="px-3 py-1 bg-amber-400 text-slate-950 text-xs font-extrabold tracking-widest rounded-full uppercase shadow-md shadow-amber-400/40">
                      NEXT
                    </span>
                  )}
                </div>

                {/* 12-Hour Formatted Prayer Time */}
                <div className={`text-4xl font-black font-mono tracking-tight ${isActive ? 'text-amber-400 drop-shadow-lg' : 'text-white'}`}>
                  {formatTo12Hour(item.timeStr)}
                </div>

                <div className="flex justify-between items-center text-xs font-semibold text-slate-400 border-t border-white/5 pt-3">
                  <span>IQAMAH</span>
                  <span className="text-slate-200">+15 MINS</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Side: Hero Countdown + Educational Slide */}
        <div className="col-span-4 flex flex-col gap-5 h-full">
          {/* Countdown Hero Box */}
          <div className="glass-card-hero p-6 rounded-2xl flex flex-col items-center justify-center text-center flex-1 relative overflow-hidden border border-emerald-500/40">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-teal-400 via-amber-400 to-teal-400" />
            <span className="text-xs font-black tracking-widest uppercase text-teal-300 bg-teal-950/80 px-4 py-1.5 rounded-full border border-teal-500/40 mb-2">
              COUNTDOWN TO {prayerState.nextPrayer.toUpperCase()}
            </span>

            <div className="text-6xl font-black font-mono text-amber-400 tracking-tight my-2 drop-shadow-xl">
              {formatSeconds(prayerState.timeRemainingSeconds)}
            </div>

            <p className="text-xs text-slate-300 font-medium">
              Congregational Solat Iqamah follows Azan.
            </p>
          </div>

          {/* Hadith / Quran Slide */}
          <div className="glass-panel p-6 rounded-2xl flex flex-col justify-center flex-1 border border-slate-700/60">
            <div className="flex items-center gap-2 text-amber-400 text-xs font-extrabold tracking-widest uppercase mb-3">
              <span>📖 HADITH OF THE DAY</span>
            </div>
            <p className="text-slate-100 text-sm font-medium leading-relaxed italic">
              &ldquo;The best among you are those who learn the Qur&apos;an and teach it to others.&rdquo;
            </p>
            <div className="text-xs text-amber-300/80 font-bold mt-3">
              — Sahih Al-Bukhari (5027)
            </div>
          </div>
        </div>
      </main>

      {/* Bottom Announcement Ticker */}
      <footer className="glass-panel px-6 py-3 rounded-2xl flex items-center shrink-0 border border-slate-800">
        <div className="px-4 py-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-xs font-black tracking-widest uppercase rounded-lg mr-5 shrink-0 shadow-md">
          ANNOUNCEMENT
        </div>
        <div className="overflow-hidden relative w-full">
          <div className="animate-ticker text-slate-200 font-semibold text-base">
            🕌 Jummah Khutbah begins at 12:45 PM. Please turn off or silent your mobile phones inside the prayer hall. • 🤲 Weekly Quran Study Circle every Saturday after Maghrib Solat. • 💳 Scan the donation QR code at the entrance to support mosque maintenance.
          </div>
        </div>
      </footer>
    </div>
  );
};
