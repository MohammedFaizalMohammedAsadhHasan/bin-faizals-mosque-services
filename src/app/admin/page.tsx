'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { TimetableUploader } from '@/components/admin/TimetableUploader';

export default function AdminPage() {
  const [emergencyActive, setEmergencyActive] = useState(false);

  return (
    <main className="min-h-screen bg-[#05080e] text-slate-100 p-6 md:p-12 max-w-6xl mx-auto">
      {/* Header */}
      <header className="flex justify-between items-center mb-10 pb-6 border-b border-slate-800">
        <div>
          <h1 className="text-3xl font-extrabold text-amber-400 tracking-wide">
            MOSQUE ADMIN CONSOLE
          </h1>
          <p className="text-sm text-emerald-400 font-medium">
            BIN FAIZAL&apos;S Digital Management Suite
          </p>
        </div>

        <div className="flex gap-4">
          <button
            onClick={() => setEmergencyActive(!emergencyActive)}
            className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-all shadow-lg ${
              emergencyActive
                ? 'bg-red-600 hover:bg-red-500 text-white animate-pulse shadow-red-600/50'
                : 'bg-rose-950/80 hover:bg-rose-900 text-rose-300 border border-rose-500/40'
            }`}
          >
            {emergencyActive ? '🚨 EMERGENCY BROADCAST ACTIVE' : '⚠️ TRIGGER EMERGENCY BROADCAST'}
          </button>
          <Link
            href="/"
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-semibold border border-slate-700 transition-all flex items-center"
          >
            ← Back to Web App
          </Link>
        </div>
      </header>

      {/* Control Dashboard Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        {/* CSV Timetable Uploader */}
        <TimetableUploader />

        {/* Quick Announcement Publisher */}
        <div className="glass-card p-8 rounded-3xl border-slate-700">
          <h3 className="text-xl font-bold text-slate-100 mb-2">Publish Announcement Slide</h3>
          <p className="text-sm text-slate-400 mb-6">
            Broadcast message to connected Smart TV screens.
          </p>

          <form onSubmit={(e) => { e.preventDefault(); alert('Announcement published to TV displays!'); }}>
            <div className="mb-4">
              <label className="block text-xs font-bold text-slate-300 uppercase mb-2">Title</label>
              <input
                type="text"
                placeholder="e.g. Weekly Qur'an Class"
                className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 text-sm focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="mb-6">
              <label className="block text-xs font-bold text-slate-300 uppercase mb-2">Message Body</label>
              <textarea
                rows={3}
                placeholder="Enter details..."
                className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 text-sm focus:outline-none focus:border-emerald-500"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-base transition-all shadow-lg shadow-amber-500/20"
            >
              Publish to TV Screens
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
