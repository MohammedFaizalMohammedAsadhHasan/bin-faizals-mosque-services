'use client';

import React, { useState, useEffect } from 'react';
import { resolvePrayerState, PrayerTimes, PrayerState } from '@/lib/prayer/prayerEngine';
import { AdhanModal } from './AdhanModal';

const DEFAULT_PRAYER_TIMES: PrayerTimes = {
  fajr: '04:30',
  sunrise: '05:48',
  dhuhr: '12:30',
  asr: '15:45',
  maghrib: '18:50',
  isha: '20:10',
};

export const TVDisplay: React.FC = () => {
  const [time, setTime] = useState<Date | null>(null);
  const [prayerState, setPrayerState] = useState<PrayerState | null>(null);
  const [dismissedAzan, setDismissedAzan] = useState(false);

  useEffect(() => {
    setTime(new Date());
    const state = resolvePrayerState(DEFAULT_PRAYER_TIMES, new Date());
    setPrayerState(state);

    const timer = setInterval(() => {
      const now = new Date();
      setTime(now);
      const newState = resolvePrayerState(DEFAULT_PRAYER_TIMES, now);
      setPrayerState(newState);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  if (!time || !prayerState) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#05080e] text-emerald-400 font-bold text-3xl">
        Loading BIN FAIZAL&apos;S TV Kiosk System...
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
    { key: 'fajr', label: 'FAJR', timeStr: DEFAULT_PRAYER_TIMES.fajr },
    { key: 'sunrise', label: 'SUNRISE', timeStr: DEFAULT_PRAYER_TIMES.sunrise },
    { key: 'dhuhr', label: 'DHUHR', timeStr: DEFAULT_PRAYER_TIMES.dhuhr },
    { key: 'asr', label: 'ASR', timeStr: DEFAULT_PRAYER_TIMES.asr },
    { key: 'maghrib', label: 'MAGHRIB', timeStr: DEFAULT_PRAYER_TIMES.maghrib },
    { key: 'isha', label: 'ISHA', timeStr: DEFAULT_PRAYER_TIMES.isha },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-[#05080e] text-slate-100 p-8 select-none justify-between overflow-hidden">
      {/* Adhan Modal Overlay */}
      <AdhanModal
        prayerName={prayerState.nextPrayer}
        isOpen={prayerState.isAzanActive && !dismissedAzan}
        onClose={() => setDismissedAzan(true)}
      />

      {/* Top Bar / Header */}
      <header className="flex justify-between items-center glass-card px-8 py-5 rounded-2xl border-emerald-500/20">
        <div>
          <h1 className="text-3xl font-extrabold tracking-wider text-amber-400">
            BIN FAIZAL&apos;S MOSQUE
          </h1>
          <p className="text-lg text-emerald-400 font-medium tracking-wide">
            MAIN PRAYER HALL SMART DISPLAY
          </p>
        </div>

        {/* Live Clock & Dates */}
        <div className="text-right">
          <div className="text-5xl font-black tracking-tight text-slate-50 font-mono">
            {time.toLocaleTimeString('en-US', { hour12: false })}
          </div>
          <div className="text-lg text-slate-300 font-medium mt-1">
            {time.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            <span className="mx-2 text-amber-400">|</span>
            <span className="font-arabic text-amber-300">١٢ صَفَر ١٤٤٨ هـ</span>
          </div>
        </div>
      </header>

      {/* Main Grid View */}
      <main className="grid grid-cols-12 gap-8 my-6 flex-1 items-stretch">
        {/* Left Side - 6 Prayer Cards */}
        <div className="col-span-8 grid grid-cols-3 gap-6">
          {prayersList.map((item) => {
            const isActive = prayerState.nextPrayer === item.key;
            return (
              <div
                key={item.key}
                className={`flex flex-col justify-between p-6 rounded-2xl transition-all duration-300 ${
                  isActive
                    ? 'glass-card-gold pulse-active border-amber-400'
                    : 'glass-card hover:border-emerald-500/40'
                }`}
              >
                <div className="flex justify-between items-center">
                  <span className={`text-xl font-bold tracking-widest ${isActive ? 'text-amber-300' : 'text-slate-400'}`}>
                    {item.label}
                  </span>
                  {isActive && (
                    <span className="px-3 py-1 bg-amber-500/30 text-amber-300 text-xs font-black tracking-wider rounded-full border border-amber-400/50 uppercase">
                      NEXT
                    </span>
                  )}
                </div>

                <div className={`text-4xl font-extrabold my-4 font-mono ${isActive ? 'text-amber-400' : 'text-slate-100'}`}>
                  {item.timeStr}
                </div>

                <div className="text-xs text-slate-400 font-medium">
                  Iqamah: +15 mins
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Side - Next Prayer Countdown & Content Slide */}
        <div className="col-span-4 flex flex-col gap-6">
          {/* Active Countdown Box */}
          <div className="glass-card-emerald p-8 rounded-2xl flex flex-col items-center justify-center text-center flex-1 border-teal-500/40">
            <span className="text-teal-300 font-bold uppercase tracking-widest text-sm mb-2">
              COUNTDOWN TO {prayerState.nextPrayer.toUpperCase()}
            </span>
            <div className="text-6xl font-black font-mono text-amber-400 my-2 tracking-tight">
              {formatSeconds(prayerState.timeRemainingSeconds)}
            </div>
            <p className="text-sm text-slate-300 mt-2">
              Congregational Solat Iqamah follows Azan.
            </p>
          </div>

          {/* Daily Hadith / Quran Slide */}
          <div className="glass-card p-6 rounded-2xl flex flex-col justify-center flex-1">
            <div className="text-amber-400 text-sm font-bold tracking-wider uppercase mb-2">
              📖 HADITH OF THE DAY
            </div>
            <p className="text-slate-200 text-base leading-relaxed italic">
              &ldquo;The best among you are those who learn the Qur&apos;an and teach it to others.&rdquo;
            </p>
            <div className="text-xs text-slate-400 mt-3 font-semibold">
              — Sahih Al-Bukhari (5027)
            </div>
          </div>
        </div>
      </main>

      {/* Bottom News & Announcement Ticker */}
      <footer className="glass-card px-6 py-4 rounded-2xl border-emerald-500/20 overflow-hidden flex items-center">
        <div className="px-4 py-1.5 bg-emerald-700/60 text-emerald-200 text-xs font-black tracking-widest uppercase rounded-lg mr-6 shrink-0">
          ANNOUNCEMENT
        </div>
        <div className="overflow-hidden relative w-full">
          <div className="animate-ticker text-slate-200 font-medium text-lg">
            🕌 Jummah Khutbah begins at 12:45 PM. Please turn off or silent your mobile phones inside the prayer hall. • 🤲 Weekly Quran Study Circle every Saturday after Maghrib Solat. • 💳 Scan the donation QR code at the entrance to support mosque maintenance.
          </div>
        </div>
      </footer>
    </div>
  );
};
