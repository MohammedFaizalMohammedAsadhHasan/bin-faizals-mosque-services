'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { QiblaCompass } from '@/components/pwa/QiblaCompass';
import { getTodayPrayerTimes, resolvePrayerState, formatTo12Hour, PrayerTimes, PrayerState } from '@/lib/prayer/prayerEngine';

export default function PublicHomePage() {
  const [times, setTimes] = useState<PrayerTimes | null>(null);
  const [prayerState, setPrayerState] = useState<PrayerState | null>(null);

  useEffect(() => {
    const now = new Date();
    const todayTimes = getTodayPrayerTimes(now);
    setTimes(todayTimes);
    setPrayerState(resolvePrayerState(todayTimes, now));
  }, []);

  if (!times || !prayerState) {
    return (
      <div className="min-h-screen bg-[#030712] text-amber-400 font-bold text-center flex items-center justify-center p-6">
        Loading BIN FAIZAL&apos;S Mosque Services...
      </div>
    );
  }

  const formatSeconds = (sec: number) => {
    const hrs = Math.floor(sec / 3600);
    const mins = Math.floor((sec % 3600) / 60);
    const secs = sec % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <main className="min-h-screen bg-[#030712] text-slate-100 p-6 md:p-12 max-w-5xl mx-auto">
      {/* Header Bar */}
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10 pb-6 border-b border-slate-800">
        <div>
          <h1 className="text-3xl font-black text-amber-400 tracking-wide uppercase">
            BIN FAIZAL&apos;S MOSQUE
          </h1>
          <p className="text-sm text-emerald-400 font-semibold uppercase tracking-wider">
            COMMUNITY PORTAL & PWA
          </p>
        </div>

        <div className="flex gap-4">
          <Link
            href="/tv"
            className="px-4 py-2.5 rounded-xl bg-emerald-800/60 hover:bg-emerald-700 text-emerald-200 text-sm font-bold border border-emerald-500/30 transition-all shadow-md"
          >
            📺 Open TV Display
          </Link>
          <Link
            href="/admin"
            className="px-4 py-2.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-sm font-bold border border-amber-500/40 transition-all shadow-md"
          >
            🛠 Admin Portal
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center mb-12">
        <div className="glass-panel p-8 rounded-3xl border border-emerald-500/30">
          <span className="text-xs font-black text-teal-300 tracking-widest uppercase bg-teal-950 px-3.5 py-1.5 rounded-full border border-teal-500/30 inline-block mb-4">
            NEXT PRAYER: {prayerState.nextPrayer.toUpperCase()}
          </span>

          <div className="text-6xl font-black text-amber-400 font-mono my-2 tracking-tight">
            {formatSeconds(prayerState.timeRemainingSeconds)}
          </div>
          <p className="text-slate-300 text-sm font-medium mt-1">
            Congregational Solat Iqamah follows Azan.
          </p>

          <div className="mt-8 pt-6 border-t border-slate-800 flex justify-between text-sm">
            <div>
              <span className="text-slate-400 block text-xs font-semibold uppercase">Gregorian Date</span>
              <span className="font-bold text-slate-100">
                {new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
              </span>
            </div>
            <div className="text-right">
              <span className="text-slate-400 block text-xs font-semibold uppercase">Hijri Date</span>
              <span className="font-bold text-amber-300 font-arabic">١٢ صَفَر ١٤٤٨ هـ</span>
            </div>
          </div>
        </div>

        {/* Qibla Compass Widget */}
        <QiblaCompass />
      </div>

      {/* Today's Timetable List */}
      <section className="glass-panel p-8 rounded-3xl mb-12 border border-slate-800">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-black text-slate-100 uppercase tracking-wide">
            Today&apos;s Official Schedule (12-Hour Format)
          </h3>
          <a
            href="/sample-annual-timetable.csv"
            download
            className="text-xs text-amber-400 hover:underline font-bold uppercase"
          >
            📥 Download Annual Timetable CSV
          </a>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {[
            { name: 'Subah / Fajr', azan: times.fajr, iqamah: '+15 mins' },
            { name: 'Sunrise', azan: times.sunrise, iqamah: '-' },
            { name: 'Luhar / Dhuhr', azan: times.dhuhr, iqamah: '+15 mins' },
            { name: 'Asr', azan: times.asr, iqamah: '+15 mins' },
            { name: 'Magrib / Maghrib', azan: times.maghrib, iqamah: '+15 mins' },
            { name: 'Isha', azan: times.isha, iqamah: '+15 mins' },
          ].map((item) => {
            const isActive = prayerState.nextPrayer.toLowerCase().includes(item.name.toLowerCase().split(' ')[0]);
            return (
              <div
                key={item.name}
                className={`p-5 rounded-2xl border transition-all ${
                  isActive
                    ? 'bg-amber-500/20 border-amber-400 shadow-lg shadow-amber-400/20'
                    : 'bg-slate-900/60 border-slate-800'
                }`}
              >
                <div className={`text-xs font-extrabold uppercase tracking-wider ${isActive ? 'text-amber-300' : 'text-emerald-400'}`}>
                  {item.name}
                </div>
                <div className={`text-2xl font-black font-mono my-2 ${isActive ? 'text-amber-400' : 'text-slate-100'}`}>
                  {formatTo12Hour(item.azan)}
                </div>
                <div className="text-xs text-slate-400 font-semibold">Iqamah: {item.iqamah}</div>
              </div>
            );
          })}
        </div>
      </section>
    </main>
  );
}
