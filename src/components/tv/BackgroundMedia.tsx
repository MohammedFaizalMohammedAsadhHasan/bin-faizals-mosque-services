'use client';

import React, { useState, useEffect } from 'react';
import { BackgroundSettings } from '@/lib/settings/settingsManager';

interface BackgroundMediaProps {
  settings: BackgroundSettings;
}

export const BackgroundMedia: React.FC<BackgroundMediaProps> = ({ settings }) => {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  const slides = settings.slides && settings.slides.length > 0
    ? settings.slides
    : [
        "https://images.unsplash.com/photo-1542816417-0983cbe82752?q=80&w=1920&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1564769625905-50e93615e769?q=80&w=1920&auto=format&fit=crop"
      ];

  useEffect(() => {
    if (settings.type !== 'slideshow' || slides.length <= 1) return;

    const intervalMs = Math.max(3, settings.slideIntervalSeconds || 10) * 1000;
    const timer = setInterval(() => {
      setCurrentSlideIndex((prev) => (prev + 1) % slides.length);
    }, intervalMs);

    return () => clearInterval(timer);
  }, [settings.type, settings.slideIntervalSeconds, slides.length]);

  const overlayOpacityDecimal = (settings.overlayOpacity ?? 55) / 100;
  const blurStyle = settings.blurPx > 0 ? { filter: `blur(${settings.blurPx}px)` } : {};

  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none select-none bg-slate-950">
      {/* Media Layer */}
      {settings.type === 'video' && settings.videoUrl ? (
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover scale-105 transition-all duration-700"
          style={blurStyle}
          src={settings.videoUrl}
        />
      ) : (
        <div className="absolute inset-0 w-full h-full">
          {slides.map((imgUrl, idx) => (
            <div
              key={imgUrl + idx}
              className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ease-in-out scale-105 transform ${
                idx === currentSlideIndex ? 'opacity-100' : 'opacity-0'
              }`}
              style={{
                backgroundImage: `url('${imgUrl}')`,
                ...blurStyle,
              }}
            />
          ))}
        </div>
      )}

      {/* Dark Overlay Tint Layer */}
      <div
        className="absolute inset-0 bg-slate-950 transition-opacity duration-500"
        style={{ opacity: overlayOpacityDecimal }}
      />

      {/* Decorative Radial Vignette & Gold Soft Ambient Glows */}
      <div className="absolute inset-0 bg-radial-vignette pointer-events-none" />
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-amber-500/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-emerald-600/10 rounded-full blur-[160px] pointer-events-none" />
    </div>
  );
};
