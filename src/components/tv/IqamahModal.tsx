'use client';

import React, { useEffect, useState } from 'react';
import { playIqamahAudio, stopAzanAudio } from '@/lib/audio/azanAudioEngine';
import { AzanAudioSettings } from '@/lib/settings/settingsManager';

interface IqamahModalProps {
  prayerName: string;
  isOpen: boolean;
  onClose: () => void;
  audioSettings?: AzanAudioSettings;
}

export const IqamahModal: React.FC<IqamahModalProps> = ({
  prayerName,
  isOpen,
  onClose,
  audioSettings
}) => {
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      stopAzanAudio();
      setIsPlaying(false);
      return;
    }

    if (audioSettings && audioSettings.enabled && audioSettings.iqamahAlertEnabled !== false) {
      const audioUrl = audioSettings.iqamahAudio || '/audio/iqamah-alert.mp3';
      setIsPlaying(true);
      playIqamahAudio(audioUrl, audioSettings.volume, () => {
        setIsPlaying(false);
      });
    }

    return () => {
      stopAzanAudio();
      setIsPlaying(false);
    };
  }, [isOpen, prayerName, audioSettings]);

  if (!isOpen) return null;

  const handleDismiss = () => {
    stopAzanAudio();
    setIsPlaying(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/95 backdrop-blur-3xl p-6 sm:p-8 animate-fade-in">
      <div className="glass-card-royal max-w-4xl w-full p-8 sm:p-12 text-center rounded-3xl relative border-2 border-emerald-400/80 shadow-2xl overflow-hidden">
        {/* Glow ambient background effect */}
        <div className="absolute -top-24 -left-24 w-72 h-72 bg-emerald-600/25 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-teal-500/20 rounded-full blur-3xl pointer-events-none" />

        <div className="text-emerald-300 font-arabic text-4xl sm:text-5xl md:text-6xl mb-3 leading-relaxed tracking-wide drop-shadow-md">
          قَدْ قَامَتِ الصَّلَاةُ • {prayerName.toUpperCase()}
        </div>

        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-wider mb-3 uppercase">
          IQAMATH TIME: STAND FOR PRAYER
        </h1>

        <p className="text-lg sm:text-xl md:text-2xl text-emerald-100 font-light mb-6">
          Straighten the rows and establish khushu for congregational Solat (Jama&apos;at).
        </p>

        {/* Audio Wave Visualizer Indicator */}
        <div className="inline-flex items-center gap-3 px-6 sm:px-8 py-3 rounded-2xl bg-emerald-500/15 border border-emerald-400/50 text-emerald-200 text-base sm:text-lg font-semibold mb-6 shadow-inner">
          <span className="text-2xl animate-pulse">🔊</span>
          <span>{isPlaying ? 'Iqamath Voice Alert Broadcasting...' : 'Iqamath Call Completed'}</span>
          {isPlaying && (
            <div className="flex items-center gap-1.5 h-6 ml-2">
              <span className="w-1.5 bg-emerald-400 animate-bounce h-4 rounded-full" />
              <span className="w-1.5 bg-emerald-400 animate-bounce h-6 rounded-full delay-100" />
              <span className="w-1.5 bg-emerald-400 animate-bounce h-3 rounded-full delay-200" />
              <span className="w-1.5 bg-emerald-400 animate-bounce h-5 rounded-full delay-300" />
            </div>
          )}
        </div>

        <div className="bg-slate-900/80 border border-white/10 rounded-2xl p-5 mb-6 text-slate-300 text-sm sm:text-base italic leading-relaxed">
          &ldquo;سَوُّوا صُفُوفَكُمْ، فَإِنَّ تَسْوِيَةَ الصَّفِّ مِنْ تَمَامِ الصَّلَاةِ&rdquo;
          <br />
          <span className="text-xs sm:text-sm text-emerald-300 not-italic font-sans mt-2 block font-medium">
            — &ldquo;Straighten your rows, for straightening the rows is part of perfecting the prayer.&rdquo; (Sahih Al-Bukhari)
          </span>
        </div>

        <div>
          <button
            onClick={handleDismiss}
            className="px-8 sm:px-10 py-3 sm:py-3.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-black text-base sm:text-lg transition-all shadow-xl shadow-emerald-500/35 uppercase tracking-wide"
          >
            Acknowledge &amp; Dismiss (Esc)
          </button>
        </div>
      </div>
    </div>
  );
};
