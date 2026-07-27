'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { QiblaCompass } from '@/components/pwa/QiblaCompass';
import { SplashScreen } from '@/components/ui/SplashScreen';
import { AmbientBubbles } from '@/components/ui/AmbientBubbles';
import { getTodayPrayerTimes, resolvePrayerState, formatTo12Hour, PrayerTimes, PrayerState } from '@/lib/prayer/prayerEngine';

export default function PublicHomePage() {
  const [showSplash, setShowSplash] = useState(true);
  const [times, setTimes] = useState<PrayerTimes | null>(null);
  const [prayerState, setPrayerState] = useState<PrayerState | null>(null);

  useEffect(() => {
    const now = new Date();
    const todayTimes = getTodayPrayerTimes(now);
    setTimes(todayTimes);
    setPrayerState(resolvePrayerState(todayTimes, now));

    const timer = setInterval(() => {
      const current = new Date();
      const activeTimes = getTodayPrayerTimes(current);
      setTimes(activeTimes);
      setPrayerState(resolvePrayerState(activeTimes, current));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatSeconds = (sec: number) => {
    const hrs = Math.floor(sec / 3600);
    const mins = Math.floor((sec % 3600) / 60);
    const secs = sec % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <>
      {showSplash && <SplashScreen onComplete={() => setShowSplash(false)} minDurationMs={1800} />}

      <div className="min-h-screen bg-[#020617] text-slate-100 relative overflow-x-hidden pb-24 md:pb-12">
        {/* Ambient Bubbles Particle Canvas */}
        <AmbientBubbles />

        <main className="relative z-10 p-4 sm:p-6 md:p-12 max-w-5xl mx-auto">
          {/* Header Bar */}
          <header className="glass-panel p-6 rounded-3xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 border border-emerald-500/20 shadow-2xl">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center font-bold text-slate-950 text-2xl shadow-lg shadow-amber-500/30">
                🕌
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-black text-amber-400 tracking-wide uppercase drop-shadow">
                  BIN FAIZAL&apos;S MOSQUE
                </h1>
                <p className="text-xs text-emerald-400 font-bold uppercase tracking-wider">
                  Smart Display & Community PWA
                </p>
              </div>
            </div>

            <div className="hidden sm:flex gap-3">
              <Link
                href="/tv"
                className="px-4 py-2.5 rounded-xl bg-emerald-800/80 hover:bg-emerald-700 text-emerald-100 text-xs font-bold border border-emerald-500/40 transition-all shadow-lg flex items-center gap-2"
              >
                <span>📺</span> Open Smart TV Kiosk
              </Link>
              <Link
                href="/admin"
                className="px-4 py-2.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-xs font-bold border border-amber-500/40 transition-all shadow-lg flex items-center gap-2"
              >
                <span>🛠</span> Admin Portal
              </Link>
            </div>
          </header>

          {/* Hero Section */}
          {prayerState && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch mb-8">
              {/* Prayer Countdown Glass Card */}
              <div className="glass-card-hero p-8 rounded-3xl border border-teal-400/40 shadow-2xl flex flex-col justify-between">
                <div>
                  <span className="text-xs font-black text-teal-200 tracking-widest uppercase bg-teal-950/90 px-4 py-1.5 rounded-full border border-teal-400/40 inline-block mb-4">
                    NEXT PRAYER: {prayerState.nextPrayer.toUpperCase()}
                  </span>

                  <div className="text-5xl sm:text-6xl font-black text-amber-400 font-mono my-2 tracking-tight drop-shadow-2xl">
                    {formatSeconds(prayerState.timeRemainingSeconds)}
                  </div>
                  <p className="text-teal-100 text-sm font-medium">
                    Congregational Solat Iqamah follows Azan.
                  </p>
                </div>

                <div className="mt-8 pt-6 border-t border-white/10 flex justify-between text-xs font-semibold">
                  <div>
                    <span className="text-teal-300/80 block uppercase">Gregorian Date</span>
                    <span className="font-bold text-white text-sm">
                      {new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-teal-300/80 block uppercase">Hijri Date</span>
                    <span className="font-bold text-amber-300 font-arabic text-sm">١٢ صَفَر ١٤٤٨ هـ</span>
                  </div>
                </div>
              </div>

              {/* Qibla Compass Card */}
              <QiblaCompass />
            </div>
          )}

          {/* Today's Timetable List */}
          {times && prayerState && (
            <section className="glass-panel p-6 sm:p-8 rounded-3xl mb-8 border border-slate-800 shadow-2xl">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-6">
                <div>
                  <h3 className="text-lg sm:text-xl font-black text-slate-100 uppercase tracking-wide">
                    Today&apos;s Official Schedule
                  </h3>
                  <p className="text-xs text-slate-400 font-semibold">12-Hour Format with Iqamah Delays</p>
                </div>
                <a
                  href="/sample-annual-timetable.csv"
                  download
                  className="px-3.5 py-1.5 rounded-lg bg-emerald-950 hover:bg-emerald-900 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase transition-colors"
                >
                  📥 Download CSV Timetable
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
                          ? 'glass-card-active pulse-gold'
                          : 'glass-card-inactive'
                      }`}
                    >
                      <div className={`text-xs font-black uppercase tracking-wider ${isActive ? 'text-amber-300' : 'text-emerald-400'}`}>
                        {item.name}
                      </div>
                      <div className={`text-2xl sm:text-3xl font-black font-mono my-2 ${isActive ? 'text-amber-400 drop-shadow' : 'text-slate-100'}`}>
                        {formatTo12Hour(item.azan)}
                      </div>
                      <div className="text-xs text-slate-400 font-semibold border-t border-white/10 pt-2">
                        Iqamah: {item.iqamah}
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {/* Announcements & Hadith */}
          <section className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-2xl">
            <h3 className="text-lg font-black text-amber-400 uppercase tracking-wide mb-4">
              📖 Hadith & Mosque Announcements
            </h3>
            <blockquote className="p-4 rounded-2xl bg-slate-900/80 border-l-4 border-amber-500 italic text-slate-200 text-sm leading-relaxed mb-4">
              &ldquo;The best among you are those who learn the Qur&apos;an and teach it to others.&rdquo;
              <footer className="text-xs text-amber-400 font-bold not-italic mt-2">— Sahih Al-Bukhari (5027)</footer>
            </blockquote>
          </section>
        </main>

        {/* Mobile Responsive Bottom Navigation Bar */}
        <nav className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#030712]/95 backdrop-blur-xl border-t border-slate-800 px-6 py-3 flex justify-between items-center text-xs font-bold shadow-2xl">
          <Link href="/" className="flex flex-col items-center gap-1 text-amber-400">
            <span className="text-lg">🕌</span>
            <span>Home</span>
          </Link>
          <Link href="/tv" className="flex flex-col items-center gap-1 text-slate-400 hover:text-emerald-400">
            <span className="text-lg">📺</span>
            <span>TV View</span>
          </Link>
          <Link href="/admin" className="flex flex-col items-center gap-1 text-slate-400 hover:text-amber-400">
            <span className="text-lg">🛠</span>
            <span>Admin</span>
          </Link>
        </nav>
      </div>
    </>
  );
}
