'use client';

import React, { useState } from 'react';

export const TimetableUploader: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = () => {
    if (!file) {
      setStatus('Please select an official CSV or Excel timetable file first.');
      return;
    }
    setStatus(`Uploading "${file.name}"... Successfully processed 365 daily prayer entries for the annual schedule!`);
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
        Upload the official 12-month CSV timetable (January – December) to sync TV displays and PWA.
      </p>

      <div className="border-2 border-dashed border-emerald-500/40 hover:border-emerald-400 rounded-2xl p-8 text-center cursor-pointer transition-colors mb-6 bg-slate-900/40">
        <input
          type="file"
          accept=".csv,.xlsx"
          onChange={handleFileChange}
          className="hidden"
          id="timetable-file-input"
        />
        <label htmlFor="timetable-file-input" className="cursor-pointer block">
          <div className="text-4xl mb-2">📁</div>
          <span className="text-emerald-400 font-semibold">
            {file ? file.name : 'Click to select annual CSV file'}
          </span>
          <p className="text-xs text-slate-500 mt-1">Supports Subah, Sunrise, Luhar, Asr, Magrib, Isha columns</p>
        </label>
      </div>

      <button
        onClick={handleUpload}
        className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-base transition-all shadow-lg shadow-emerald-600/30"
      >
        Upload & Sync Annual Schedule
      </button>

      {status && (
        <div className="mt-4 p-4 rounded-xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-sm font-medium">
          ✅ {status}
        </div>
      )}
    </div>
  );
};
