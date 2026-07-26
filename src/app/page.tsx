'use client';

import React from 'react';
import Link from 'next/link';
import { QiblaCompass } from '@/components/pwa/QiblaCompass';

export default function PublicHomePage() {
  return (
    <main className="min-h-screen bg-[#05080e] text-slate-100 p-6 md:p-12 max-w-5xl mx-auto">
      {/* Header Bar */}
      <header className="flex justify-between items-center mb-10 pb-6 border-b border-slate-800">
        <div>
          <h1 className="text-3xl font-extrabold text-amber-400 tracking-wide">
            BIN FAIZAL&apos;S MOSQUE
          </h1>
          <p className="text-sm text-emerald-400 font-medium">Community Portal & PWA</p>
        </div>

        <div className="flex gap-4">
          <Link
            href="/tv"
            className="px-4 py-2 rounded-xl bg-emerald-800/60 hover:bg-emerald-700 text-emerald-200 text-sm font-semibold border border-emerald-500/30 transition-all"
          >
            📺 Open TV Display
          </Link>
          <Link
            href="/admin"
            className="px-4 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-sm font-semibold border border-amber-500/40 transition-all"
          >
            🛠 Admin Portal
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center mb-12">
        <div className="glass-card-emerald p-8 rounded-3xl">
          <span className="text-xs font-black text-teal-300 tracking-widest uppercase bg-teal-900/60 px-3 py-1 rounded-full border border-teal-500/30 inline-block mb-3">
            NEXT PRAYER: MAGHRIB
          </span>
          <div className="text-5xl font-black text-amber-400 font-mono my-2">
            18:50
          </div>
          <p className="text-slate-300 text-sm">
            Iqamah in 5 minutes following Azan.
          </p>

          <div className="mt-6 pt-6 border-t border-teal-500/30 flex justify-between text-sm">
            <div>
              <span className="text-slate-400 block text-xs">Today&apos;s Date</span>
              <span className="font-semibold text-slate-100">27 July 2026</span>
            </div>
            <div className="text-right">
              <span className="text-slate-400 block text-xs">Hijri Date</span>
              <span className="font-semibold text-amber-300 font-arabic">١٢ صَفَر ١٤٤٨ هـ</span>
            </div>
          </div>
        </div>

        {/* Qibla Widget */}
        <QiblaCompass />
      </div>

      {/* Today's Timetable List */}
      <section className="glass-card p-8 rounded-3xl mb-12">
        <h3 className="text-xl font-bold text-slate-100 mb-6">Today&apos;s Prayer Schedule</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {[
            { name: 'Fajr', azan: '04:30', iqamah: '04:45' },
            { name: 'Sunrise', azan: '05:48', iqamah: '-' },
            { name: 'Dhuhr', azan: '12:30', iqamah: '12:45' },
            { name: 'Asr', azan: '15:45', iqamah: '16:00' },
            { name: 'Maghrib', azan: '18:50', iqamah: '18:55' },
            { name: 'Isha', azan: '20:10', iqamah: '20:25' },
          ].map((item) => (
            <div key={item.name} className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
              <div className="text-sm font-bold text-emerald-400 uppercase">{item.name}</div>
              <div className="text-2xl font-black font-mono text-slate-100 my-1">{item.azan}</div>
              <div className="text-xs text-slate-400">Iqamah: {item.iqamah}</div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
