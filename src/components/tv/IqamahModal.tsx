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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/95 backdrop-blur-3xl p-3 xs:p-4 sm:p-8 animate-fade-in overflow-y-auto">
      <div className="glass-card-royal max-w-3xl w-full p-5 xs:p-6 sm:p-8 md:p-12 text-center rounded-3xl relative border-2 border-emerald-400/80 shadow-2xl overflow-hidden max-h-[92vh] overflow-y-auto">
        {/* Glow ambient background effect */}
        <div className="absolute -top-24 -left-24 w-72 h-72 bg-emerald-600/25 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-teal-500/20 rounded-full blur-3xl pointer-events-none" />

        <div className="text-emerald-300 font-arabic text-2xl xs:text-3xl sm:text-4xl md:text-5xl mb-2 sm:mb-3 leading-relaxed tracking-wide drop-shadow-md">
          قَدْ قَامَتِ الصَّلَاةُ • {prayerName.toUpperCase()}
        </div>

        <h1 className="text-xl xs:text-2xl sm:text-3xl md:text-4xl font-black text-white tracking-wider mb-2 sm:mb-3 uppercase">
          IQAMATH TIME: STAND FOR PRAYER
        </h1>

        <p className="text-sm xs:text-base sm:text-lg md:text-xl text-emerald-100 font-light mb-4 sm:mb-6">
          Straighten the rows and establish khushu for congregational Solat (Jama&apos;at).
        </p>

        {/* Audio Wave Visualizer Indicator */}
        <div className="inline-flex items-center gap-2.5 xs:gap-3 px-4 xs:px-6 sm:px-8 py-2.5 sm:py-3 rounded-2xl bg-emerald-500/15 border border-emerald-400/50 text-emerald-200 text-xs xs:text-sm sm:text-base font-semibold mb-4 sm:mb-6 shadow-inner">
          <span className="text-xl sm:text-2xl animate-pulse">🔊</span>
          <span>{isPlaying ? 'Iqamath Voice Alert Broadcasting...' : 'Iqamath Call Completed'}</span>
          {isPlaying && (
            <div className="flex items-center gap-1.5 h-5 ml-1 sm:ml-2">
              <span className="w-1.5 bg-emerald-400 animate-bounce h-3 sm:h-4 rounded-full" />
              <span className="w-1.5 bg-emerald-400 animate-bounce h-5 sm:h-6 rounded-full delay-100" />
              <span className="w-1.5 bg-emerald-400 animate-bounce h-2.5 sm:h-3 rounded-full delay-200" />
              <span className="w-1.5 bg-emerald-400 animate-bounce h-4 sm:h-5 rounded-full delay-300" />
            </div>
          )}
        </div>

        <div className="bg-slate-900/80 border border-white/10 rounded-2xl p-4 sm:p-5 mb-5 sm:mb-6 text-slate-300 text-xs sm:text-sm italic leading-relaxed">
          &ldquo;سَوُّوا صُفُوفَكُمْ، فَإِنَّ تَسْوِيَةَ الصَّفِّ مِنْ تَمَامِ الصَّلَاةِ&rdquo;
          <br />
          <span className="text-[11px] sm:text-xs text-emerald-300 not-italic font-sans mt-2 block font-medium">
            — &ldquo;Straighten your rows, for straightening the rows is part of perfecting the prayer.&rdquo; (Sahih Al-Bukhari)
          </span>
        </div>

        <div>
          <button
            onClick={handleDismiss}
            className="px-6 xs:px-8 sm:px-10 py-3 sm:py-3.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-black text-sm sm:text-base transition-all shadow-xl shadow-emerald-500/35 uppercase tracking-wide min-h-[48px] focus-visible:ring-4 focus-visible:ring-emerald-400"
          >
            Acknowledge &amp; Dismiss (Esc)
          </button>
        </div>
      </div>
    </div>
  );
};
