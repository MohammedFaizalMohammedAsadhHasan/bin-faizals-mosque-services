'use client';

import React from 'react';

interface AdhanModalProps {
  prayerName: string;
  isOpen: boolean;
  onClose: () => void;
}

export const AdhanModal: React.FC<AdhanModalProps> = ({ prayerName, isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-2xl p-8 animate-fade-in">
      <div className="glass-card-gold max-w-3xl w-full p-12 text-center rounded-3xl relative border-2 border-amber-400/80 shadow-2xl">
        <div className="text-amber-400 font-arabic text-6xl mb-6 leading-relaxed">
          أَذَانُ صَلاَةِ {prayerName.toUpperCase()}
        </div>

        <h1 className="text-5xl font-extrabold text-amber-300 tracking-wide mb-4 uppercase">
          AZAN {prayerName} IS NOW ACTIVE
        </h1>

        <p className="text-2xl text-slate-200 font-light mb-8">
          Please prepare for congregational Solat (Jama&apos;at).
        </p>

        <div className="inline-block px-8 py-4 rounded-2xl bg-amber-500/20 border border-amber-400/40 text-amber-300 text-xl font-medium mb-8">
          🔊 Audio Visual Azan Broadcast in Progress
        </div>

        <div>
          <button
            onClick={onClose}
            className="px-8 py-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-lg transition-all shadow-lg shadow-amber-500/30"
          >
            Dismiss Alert
          </button>
        </div>
      </div>
    </div>
  );
};
