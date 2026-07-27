'use client';

import React, { useState } from 'react';
import { saveTimetable, OfflineTimetableEntry } from '@/lib/offline/db';

export const TimetableUploader: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const parseCSVAndSave = async (text: string) => {
    const lines = text.split(/\r?\n/).filter((l) => l.trim().length > 0);
    if (lines.length < 2) throw new Error('CSV file is empty or missing data rows.');

    const entries: OfflineTimetableEntry[] = [];
    const currentYear = new Date().getFullYear();

    // Skip header row
    for (let i = 1; i < lines.length; i++) {
      const parts = lines[i].split(',').map((p) => p.trim());
      if (parts.length >= 7) {
        const dateStr = parts[0]; // e.g. YYYY-MM-DD or MM-DD
        const dateKey = dateStr.includes('-') && dateStr.length === 10 ? dateStr : `${currentYear}-${dateStr}`;

        entries.push({
          date: dateKey,
          fajr: parts[1],
          sunrise: parts[2],
          dhuhr: parts[3],
          asr: parts[4],
          maghrib: parts[5],
          isha: parts[6],
        });
      }
    }

    if (entries.length > 0) {
      await saveTimetable(entries);
    }
    return entries.length;
  };

  const handleUpload = async () => {
    if (!file) {
      setStatus('Please select an official CSV timetable file first.');
      return;
    }

    setIsProcessing(true);
    setStatus('Parsing timetable and updating IndexedDB offline cache...');

    try {
      const text = await file.text();
      const count = await parseCSVAndSave(text);
      setStatus(`Successfully saved ${count} daily prayer records into IndexedDB offline storage!`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to parse CSV file.';
      setStatus(`Error: ${msg}`);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="glass-panel p-8 rounded-3xl max-w-xl w-full border border-slate-800">
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-xl font-bold text-slate-100">Annual Prayer Timetable Importer</h3>
        <a
          href="/sample-annual-timetable.csv"
          download
          className="text-xs text-amber-400 hover:underline font-bold uppercase"
        >
          📥 CSV Template
        </a>
      </div>
      <p className="text-sm text-slate-400 mb-6">
        Upload the official 12-month CSV timetable to sync TV displays and PWA with IndexedDB offline caching.
      </p>

      <div className="border-2 border-dashed border-emerald-500/40 hover:border-emerald-400 rounded-2xl p-8 text-center cursor-pointer transition-colors mb-6 bg-slate-900/40">
        <input
          type="file"
          accept=".csv"
          onChange={handleFileChange}
          className="hidden"
          id="timetable-file-input"
        />
        <label htmlFor="timetable-file-input" className="cursor-pointer block">
          <div className="text-4xl mb-2">📁</div>
          <span className="text-emerald-400 font-semibold">
            {file ? file.name : 'Click to select annual CSV file'}
          </span>
          <p className="text-xs text-slate-500 mt-1">Supports Date, Subah, Sunrise, Luhar, Asr, Magrib, Isha columns</p>
        </label>
      </div>

      <button
        onClick={handleUpload}
        disabled={isProcessing}
        className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold text-base transition-all shadow-lg shadow-emerald-600/30"
      >
        {isProcessing ? 'Processing...' : 'Upload & Sync Offline Schedule'}
      </button>

      {status && (
        <div className="mt-4 p-4 rounded-xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-sm font-medium">
          {status}
        </div>
      )}
    </div>
  );
};
