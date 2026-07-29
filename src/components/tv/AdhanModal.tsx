'use client';

import React, { useEffect, useState } from 'react';
import { playAzanAudio, stopAzanAudio } from '@/lib/audio/azanAudioEngine';
import { AzanAudioSettings } from '@/lib/settings/settingsManager';

interface AdhanModalProps {
  prayerName: string;
  isOpen: boolean;
  onClose: () => void;
  audioSettings?: AzanAudioSettings;
}

export const AdhanModal: React.FC<AdhanModalProps> = ({ prayerName, isOpen, onClose, audioSettings }) => {
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      stopAzanAudio();
      setIsPlaying(false);
      return;
    }

    if (audioSettings && audioSettings.enabled) {
      const isFajr = prayerName.toLowerCase().includes('fajr');
      const targetAudio = isFajr
        ? audioSettings.fajrAudio
        : audioSettings.dhuhrAudio || audioSettings.fajrAudio;

      if (targetAudio) {
        setIsPlaying(true);
        playAzanAudio(targetAudio, audioSettings.volume, () => {
          setIsPlaying(false);
        });
      }
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/95 backdrop-blur-3xl p-8 animate-fade-in">
      <div className="glass-card-gold max-w-4xl w-full p-12 text-center rounded-3xl relative border-2 border-amber-400/80 shadow-2xl overflow-hidden">
        {/* Glow ambient background effect */}
        <div className="absolute -top-24 -left-24 w-72 h-72 bg-amber-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />

        <div className="text-amber-400 font-arabic text-5xl md:text-6xl mb-4 leading-relaxed tracking-wide drop-shadow-md">
          أَذَانُ صَلاَةِ {prayerName.toUpperCase()}
        </div>

        <h1 className="text-4xl md:text-5xl font-black text-amber-300 tracking-wider mb-3 uppercase">
          AZAN {prayerName} IS NOW ACTIVE
        </h1>

        <p className="text-xl md:text-2xl text-slate-200 font-light mb-6">
          Please prepare for congregational Solat (Jama&apos;at).
        </p>

        {/* Audio Wave Visualizer Indicator */}
        <div className="inline-flex items-center gap-4 px-8 py-3.5 rounded-2xl bg-amber-500/10 border border-amber-400/40 text-amber-300 text-lg font-semibold mb-8 shadow-inner">
          <span className="text-2xl animate-pulse">🕌</span>
          <span>{isPlaying ? '🔊 Full Azan Audio Broadcasting...' : '🔔 Azan Time Call'}</span>
          {isPlaying && (
            <div className="flex items-center gap-1.5 h-6 ml-2">
              <span className="w-1.5 bg-amber-400 animate-bounce h-4 rounded-full" />
              <span className="w-1.5 bg-amber-400 animate-bounce h-6 rounded-full delay-100" />
              <span className="w-1.5 bg-amber-400 animate-bounce h-3 rounded-full delay-200" />
              <span className="w-1.5 bg-amber-400 animate-bounce h-5 rounded-full delay-300" />
            </div>
          )}
        </div>

        <div className="bg-slate-900/80 border border-white/10 rounded-2xl p-6 mb-8 text-slate-300 text-sm italic leading-relaxed">
          “اللَّهُمَّ رَبَّ هَذِهِ الدَّعْوَةِ التَّامَّةِ، وَالصَّلاَةِ الْقَائِمَةِ، آتِ مُحَمَّدًا الْوَسِيلَةَ وَالْفَضِيلَةَ”
          <br />
          <span className="text-xs text-amber-400/90 not-italic font-sans mt-2 block font-medium">
            O Allah, Lord of this perfect call and established prayer, grant Muhammad the intercession and favor.
          </span>
        </div>

        <div>
          <button
            onClick={handleDismiss}
            className="px-10 py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-lg transition-all shadow-xl shadow-amber-500/30 uppercase tracking-wide"
          >
            Dismiss Azan Alert
          </button>
        </div>
      </div>
    </div>
  );
};
