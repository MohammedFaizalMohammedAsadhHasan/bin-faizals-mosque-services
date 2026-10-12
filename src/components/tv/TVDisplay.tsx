'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  resolvePrayerState,
  resolvePrayerTimesAsync,
  getTodayPrayerTimes,
  formatTo12Hour,
  adjustTimeString,
  PrayerTimes,
  PrayerState
} from '@/lib/prayer/prayerEngine';
import { getFormattedHijriDate } from '@/lib/prayer/hijriEngine';
import { AdhanModal } from './AdhanModal';
import { SplashScreen } from '@/components/ui/SplashScreen';
import { BackgroundMedia } from './BackgroundMedia';
import { AmbientBubbles } from '@/components/ui/AmbientBubbles';
import { SpecialPrayerBanner } from './SpecialPrayerBanner';
import {
  getTVSettings,
  saveTVSettings,
  subscribeToSettingsChange,
  TVSettings,
  DEFAULT_SETTINGS,
  SRI_LANKA_ZONES
} from '@/lib/settings/settingsManager';
import { fetchLiveWeather, WeatherData } from '@/lib/weather/weatherEngine';
import { getTranslation, formatLocalizedDate, LANGUAGES, LanguageCode } from '@/lib/i18n/i18n';

// 5 Harmonic Luxury Font Color Themes connecting with Royal Mosque background
export interface FontTheme {
  id: string;
  name: string;
  previewColor: string;
  accentText: string;
  brandTitle: string;
  clockGlow: string;
  countdownGlow: string;
  prayerActiveTime: string;
  badgeBorder: string;
  cardActiveBorder: string;
  cardActiveGlow: string;
}

export const FONT_THEMES: FontTheme[] = [
  {
    id: 'sapphire',
    name: 'Royal Sapphire',
    previewColor: '#38bdf8',
    accentText: 'text-sky-300',
    brandTitle: 'from-sky-100 via-sky-300 to-blue-200',
    clockGlow: 'text-sky-200 drop-shadow-[0_0_25px_rgba(56,189,248,0.7)]',
    countdownGlow: 'text-sky-300 drop-shadow-[0_0_35px_rgba(56,189,248,0.85)]',
    prayerActiveTime: 'text-sky-300 drop-shadow-[0_0_20px_rgba(56,189,248,0.8)]',
    badgeBorder: 'border-sky-400/50 bg-blue-950/80 text-sky-200',
    cardActiveBorder: 'border-sky-400 shadow-sky-500/40',
    cardActiveGlow: 'bg-gradient-to-r from-blue-600 to-sky-400',
  },
  {
    id: 'gold',
    name: 'Imperial Gold',
    previewColor: '#fde047',
    accentText: 'text-amber-300',
    brandTitle: 'from-amber-100 via-yellow-200 to-amber-300',
    clockGlow: 'text-amber-100 drop-shadow-[0_0_25px_rgba(253,224,71,0.7)]',
    countdownGlow: 'text-yellow-300 drop-shadow-[0_0_35px_rgba(253,224,71,0.85)]',
    prayerActiveTime: 'text-yellow-300 drop-shadow-[0_0_20px_rgba(253,224,71,0.8)]',
    badgeBorder: 'border-amber-400/50 bg-amber-950/80 text-amber-200',
    cardActiveBorder: 'border-amber-400 shadow-amber-500/40',
    cardActiveGlow: 'bg-gradient-to-r from-amber-600 to-yellow-400',
  },
  {
    id: 'emerald',
    name: 'Sacred Emerald',
    previewColor: '#34d399',
    accentText: 'text-emerald-300',
    brandTitle: 'from-emerald-100 via-teal-200 to-cyan-200',
    clockGlow: 'text-emerald-100 drop-shadow-[0_0_25px_rgba(52,211,153,0.7)]',
    countdownGlow: 'text-emerald-300 drop-shadow-[0_0_35px_rgba(52,211,153,0.85)]',
    prayerActiveTime: 'text-emerald-300 drop-shadow-[0_0_20px_rgba(52,211,153,0.8)]',
    badgeBorder: 'border-emerald-400/50 bg-emerald-950/80 text-emerald-200',
    cardActiveBorder: 'border-emerald-400 shadow-emerald-500/40',
    cardActiveGlow: 'bg-gradient-to-r from-emerald-600 to-teal-400',
  },
  {
    id: 'diamond',
    name: 'Diamond Ice',
    previewColor: '#e0f2fe',
    accentText: 'text-cyan-200',
    brandTitle: 'from-white via-cyan-100 to-sky-200',
    clockGlow: 'text-white drop-shadow-[0_0_25px_rgba(224,242,254,0.8)]',
    countdownGlow: 'text-cyan-200 drop-shadow-[0_0_35px_rgba(224,242,254,0.9)]',
    prayerActiveTime: 'text-cyan-100 drop-shadow-[0_0_20px_rgba(224,242,254,0.8)]',
    badgeBorder: 'border-cyan-300/50 bg-slate-900/90 text-cyan-200',
    cardActiveBorder: 'border-cyan-300 shadow-cyan-400/40',
    cardActiveGlow: 'bg-gradient-to-r from-sky-500 to-cyan-300',
  },
  {
    id: 'lavender',
    name: 'Royal Twilight',
    previewColor: '#c084fc',
    accentText: 'text-purple-300',
    brandTitle: 'from-purple-100 via-pink-200 to-indigo-200',
    clockGlow: 'text-purple-100 drop-shadow-[0_0_25px_rgba(192,132,252,0.7)]',
    countdownGlow: 'text-purple-300 drop-shadow-[0_0_35px_rgba(192,132,252,0.85)]',
    prayerActiveTime: 'text-purple-300 drop-shadow-[0_0_20px_rgba(192,132,252,0.8)]',
    badgeBorder: 'border-purple-400/50 bg-purple-950/80 text-purple-200',
    cardActiveBorder: 'border-purple-400 shadow-purple-500/40',
    cardActiveGlow: 'bg-gradient-to-r from-purple-600 to-pink-400',
  },
];

export const TVDisplay: React.FC = () => {
  const [settings, setSettings] = useState<TVSettings>(DEFAULT_SETTINGS);
  const [showSplash, setShowSplash] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const [time, setTime] = useState<Date>(() => new Date());
  const [prayerTimes, setPrayerTimes] = useState<PrayerTimes>(() => getTodayPrayerTimes());
  const [prayerState, setPrayerState] = useState<PrayerState>(() => resolvePrayerState(getTodayPrayerTimes(), new Date()));
  const [hijriDateStr, setHijriDateStr] = useState<string>(() => getFormattedHijriDate(new Date(), 0, 'en'));

  const [dismissedAzan, setDismissedAzan] = useState(false);
  const [showSilentAlert, setShowSilentAlert] = useState(false);
  const [slideIndex, setSlideIndex] = useState(0);
  const [showAdminMenu, setShowAdminMenu] = useState(false);
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);

  // Dynamic Font Color Theme Index
  const [fontThemeIndex, setFontThemeIndex] = useState(0);

  const lang: LanguageCode = settings.language || 'en';
  const t = (key: string) => getTranslation(lang, key);

  // Current Active Font Theme
  const activeFontTheme = FONT_THEMES[fontThemeIndex % FONT_THEMES.length];

  // Initialize & Listen to Settings changes from /admin console
  useEffect(() => {
    const activeSettings = getTVSettings();
    setSettings(activeSettings);

    const unsubscribe = subscribeToSettingsChange(() => {
      setSettings(getTVSettings());
    });

    return () => unsubscribe();
  }, []);

  // Auto-cycle font colors smoothly every N seconds (Harmonizing with background)
  useEffect(() => {
    const cycleSeconds = settings.fontColorCycleSeconds ?? 8;
    if (cycleSeconds <= 0) return; // 0 means locked

    const timer = setInterval(() => {
      setFontThemeIndex((prev) => (prev + 1) % FONT_THEMES.length);
    }, cycleSeconds * 1000);

    return () => clearInterval(timer);
  }, [settings.fontColorCycleSeconds]);

  // Auto-cycle languages every 15s if enabled (MDisplay style)
  useEffect(() => {
    if (!settings.autoCycleLanguages) return;
    const cycleLanguages: LanguageCode[] = ['en', 'ar', 'ta', 'si'];
    const cycleTimer = setInterval(() => {
      setSettings((prev) => {
        const currentIdx = cycleLanguages.indexOf(prev.language || 'en');
        const nextLang = cycleLanguages[(currentIdx + 1) % cycleLanguages.length];
        const updated = { ...prev, language: nextLang };
        saveTVSettings(updated);
        return updated;
      });
    }, 15000);

    return () => clearInterval(cycleTimer);
  }, [settings.autoCycleLanguages]);

  // Fetch Live Weather
  useEffect(() => {
    const updateWeather = async () => {
      const w = await fetchLiveWeather(
        settings.weather.latitude,
        settings.weather.longitude,
        settings.weather.city
      );
      if (w) setWeatherData(w);
    };
    updateWeather();
    const weatherInterval = setInterval(updateWeather, 1800000); // 30 mins
    return () => clearInterval(weatherInterval);
  }, [settings.weather]);

  // Real-Time 1-Second Timer for Clock & Prayer Status Evaluation
  useEffect(() => {
    const interval = setInterval(async () => {
      const now = new Date();
      setTime(now);

      const activeTimes = await resolvePrayerTimesAsync(now);
      setPrayerTimes(activeTimes);

      const currentState = resolvePrayerState(activeTimes, now);
      setPrayerState(currentState);

      setHijriDateStr(getFormattedHijriDate(now, 0, lang));

      // Trigger "Silent Phone Alert" when prayer is in progress (passed Azan & at/near Iqamah)
      if (settings.phoneSilentAlertEnabled !== false && currentState.isIqamahActive) {
        setShowSilentAlert(true);
      } else if (!currentState.isIqamahActive) {
        setShowSilentAlert(false);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [settings.phoneSilentAlertEnabled, lang]);

  // 12-Second Islamic Content Slide Rotator
  const slidesList = settings.islamicContent && settings.islamicContent.length > 0
    ? settings.islamicContent
    : DEFAULT_SETTINGS.islamicContent;

  useEffect(() => {
    const slideInterval = setInterval(() => {
      setSlideIndex((prev) => (prev + 1) % slidesList.length);
    }, 12000);
    return () => clearInterval(slideInterval);
  }, [slidesList.length]);

  // Remote Control Key Listener: Press 0 to open TV Quick Settings
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '0') {
        setShowAdminMenu((prev) => !prev);
      } else if (e.key === 'Escape') {
        setShowAdminMenu(false);
        setShowSilentAlert(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const formatSeconds = (sec: number) => {
    const hrs = Math.floor(sec / 3600);
    const mins = Math.floor((sec % 3600) / 60);
    const secs = sec % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const formatDisplayTime = (timeStr?: string) => {
    if (!timeStr) return '--:--';
    if (settings.time24Format) return timeStr;
    return formatTo12Hour(timeStr);
  };

  const computeIqamahTimeStr = (
    prayerKey: keyof typeof settings.iqamahOffsets,
    azanTimeStr?: string
  ): { formatted: string; offsetLabel: string } => {
    const customTime = settings.customIqamahTimes?.[prayerKey as keyof typeof settings.customIqamahTimes];
    if (customTime && customTime.trim() !== '') {
      return {
        formatted: settings.time24Format ? customTime : formatTo12Hour(customTime),
        offsetLabel: 'Manual Time'
      };
    }

    if (!azanTimeStr) return { formatted: '--:--', offsetLabel: '' };
    const offsetMin = settings.iqamahOffsets[prayerKey] || 0;
    const computed24 = adjustTimeString(azanTimeStr, offsetMin);

    return {
      formatted: settings.time24Format ? computed24 : formatTo12Hour(computed24),
      offsetLabel: `+${offsetMin}m`
    };
  };

  const setLanguage = (newLang: LanguageCode) => {
    const updated = { ...settings, language: newLang };
    setSettings(updated);
    saveTVSettings(updated);
  };

  const basePrayers: { key: keyof PrayerTimes; label: string; azan24: string; iqamahKey?: keyof typeof settings.iqamahOffsets }[] = prayerTimes ? [
    { key: 'fajr', label: t('fajr'), azan24: prayerTimes.fajr, iqamahKey: 'fajr' },
    { key: 'sunrise', label: t('sunrise'), azan24: prayerTimes.sunrise },
    { key: 'dhuhr', label: t('dhuhr'), azan24: prayerTimes.dhuhr, iqamahKey: 'dhuhr' },
    { key: 'asr', label: t('asr'), azan24: prayerTimes.asr, iqamahKey: 'asr' },
    { key: 'maghrib', label: t('maghrib'), azan24: prayerTimes.maghrib, iqamahKey: 'maghrib' },
    { key: 'isha', label: t('isha'), azan24: prayerTimes.isha, iqamahKey: 'isha' },
  ] : [];

  const prayersList = settings.showSunrise === false
    ? basePrayers.filter((p) => p.key !== 'sunrise')
    : basePrayers;

  const currentSlide = slidesList[slideIndex] || slidesList[0];
  const announcementsList = settings.announcements && settings.announcements.length > 0
    ? settings.announcements
    : [
        "📢 Welcome to BIN FAIZAL'S Mosque Smart TV",
        "Please turn off or silence your mobile phones inside the prayer hall.",
        "🤲 May Allah accept all our prayers and ibadah"
      ];
  const announcementsStr = announcementsList.join('   ✦   ');

  return (
    <>
      {showSplash && <SplashScreen onComplete={() => setShowSplash(false)} minDurationMs={1800} />}

      <div className="tv-container flex flex-col h-screen w-screen p-6 select-none overflow-hidden justify-between relative bg-[#020617] text-slate-100">
        {/* Dynamic Royal Mosque Background Slideshow */}
        <BackgroundMedia settings={settings.background} />

        {/* 95+ Beautiful Ambient Floating Bubbles & Bokeh Orbs */}
        <AmbientBubbles />

        {/* Full Azan Audio & Visual Modal */}
        <AdhanModal
          prayerName={t(prayerState.nextPrayer) || prayerState.nextPrayer}
          isOpen={prayerState.isAzanActive && !dismissedAzan}
          onClose={() => setDismissedAzan(true)}
          audioSettings={settings.azanAudio}
        />

        {/* Redesigned Luxury Header Bar */}
        <header className="glass-panel flex justify-between items-center px-8 py-3.5 rounded-2xl shrink-0 border border-blue-500/30 shadow-2xl relative z-10">
          {/* Mosque Brand & Title */}
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 via-sky-500 to-indigo-600 flex items-center justify-center font-bold text-white text-3xl shadow-lg shadow-blue-500/40 border border-sky-300 shrink-0">
              🕌
            </div>
            <div>
              <h1 className={`text-2xl md:text-3xl font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-r ${activeFontTheme.brandTitle} uppercase drop-shadow-md transition-all duration-1000`}>
                {settings.mosqueName}
              </h1>
              <div className="flex items-center gap-2 mt-0.5">
                <span className={`text-xs font-black tracking-widest uppercase bg-blue-950/80 px-2.5 py-0.5 rounded-md border border-blue-500/30 ${activeFontTheme.accentText} transition-colors duration-1000`}>
                  {settings.displayName}
                </span>
                <span className="text-xs text-slate-300 font-bold uppercase tracking-wide">
                  • {t('mosqueServices')}
                </span>
              </div>
            </div>
          </div>

          {/* Multi-Language Selector Controls */}
          <div className="flex items-center gap-1.5 bg-slate-900/80 border border-blue-500/30 px-3 py-1.5 rounded-xl backdrop-blur-md">
            {LANGUAGES.map((l) => (
              <button
                key={l.code}
                onClick={() => setLanguage(l.code)}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
                  lang === l.code
                    ? 'bg-gradient-to-r from-blue-600 to-sky-500 text-white shadow-md font-black scale-105'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
                title={l.label}
              >
                <span>{l.flag}</span>
                <span>{l.code.toUpperCase()}</span>
              </button>
            ))}
          </div>

          {/* Live Weather Widget */}
          {weatherData && (
            <div className="hidden xl:flex items-center gap-3 bg-slate-900/80 border border-blue-500/20 px-5 py-2 rounded-xl backdrop-blur-md">
              <span className="text-3xl">{weatherData.icon}</span>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-base font-black text-white">{weatherData.tempC}°C</span>
                  <span className={`text-xs font-bold ${activeFontTheme.accentText} transition-colors duration-1000`}>{weatherData.condition}</span>
                </div>
                <div className="text-[10px] text-slate-400 flex items-center gap-2.5 font-medium">
                  <span>💧 {weatherData.humidity}%</span>
                  <span>💨 {weatherData.windSpeedKmH} km/h</span>
                  <span>🌅 {weatherData.sunrise}</span>
                </div>
              </div>
            </div>
          )}

          {/* Live Clock & Dates with Dynamic Glowing Font Theme */}
          <div className="text-right flex items-center gap-6">
            <div className={`text-4xl md:text-5xl font-black font-mono tracking-tight transition-all duration-1000 ${activeFontTheme.clockGlow}`}>
              {mounted
                ? time.toLocaleTimeString(lang === 'ar' ? 'ar-SA' : 'en-US', {
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                    hour12: !settings.time24Format
                  })
                : '--:--:--'}
            </div>
            <div className="h-10 w-px bg-slate-700/60" />
            <div className="text-right">
              <div className="text-xs md:text-sm font-bold text-slate-200 uppercase tracking-wide">
                {mounted ? formatLocalizedDate(time, lang) : '---'}
              </div>
              <div className={`text-sm md:text-base font-arabic font-bold mt-0.5 transition-colors duration-1000 ${activeFontTheme.accentText}`}>
                {mounted ? hijriDateStr : '---'}
              </div>
            </div>
            <button
              onClick={() => setShowAdminMenu(true)}
              className="p-2 text-slate-400 hover:text-white rounded-xl bg-slate-800/60 hover:bg-slate-800 border border-slate-700 transition-all text-sm"
              title="Quick Options (Key: 0)"
            >
              ⚙
            </button>
          </div>
        </header>

        {/* Main Grid Area */}
        <main className="flex-1 flex flex-col justify-between my-3 overflow-hidden relative z-10">
          {/* Special Prayer Scheduler Banner */}
          <SpecialPrayerBanner specialPrayers={settings.specialPrayers} />

          <div className="grid grid-cols-12 gap-5 flex-1 items-stretch overflow-hidden">
            {/* Left Side: Daily Prayer Cards with Azan & Iqamah */}
            <div className={`col-span-8 grid ${prayersList.length > 5 ? 'grid-cols-3 grid-rows-2' : 'grid-cols-5 grid-rows-1'} gap-4 h-full`}>
              {prayersList.map((item) => {
                const isActive = prayerState.nextPrayer === item.key;
                const iqamahInfo = item.iqamahKey
                  ? computeIqamahTimeStr(item.iqamahKey, item.azan24)
                  : null;

                return (
                  <div
                    key={item.key}
                    className={`flex flex-col justify-between p-5 rounded-2xl transition-all duration-500 ${
                      isActive
                        ? `glass-card-active pulse-royal border-2 ${activeFontTheme.cardActiveBorder}`
                        : 'glass-card-inactive'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <span className={`text-sm font-black tracking-widest uppercase transition-colors duration-1000 ${isActive ? activeFontTheme.accentText : 'text-slate-300'}`}>
                        {item.label}
                      </span>
                      {isActive && (
                        <span className={`px-3 py-0.5 text-white text-[10px] font-black tracking-widest rounded-full uppercase shadow-md transition-all duration-1000 ${activeFontTheme.cardActiveGlow}`}>
                          {t('next')}
                        </span>
                      )}
                    </div>

                    {/* Azan Time */}
                    <div>
                      <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block mb-0.5">{t('azan')}</span>
                      <div className={`text-3xl lg:text-4xl font-black font-mono tracking-tight transition-all duration-1000 ${
                        isActive ? activeFontTheme.prayerActiveTime : 'text-slate-100'
                      }`}>
                        {formatDisplayTime(item.azan24)}
                      </div>
                    </div>

                    {/* Iqamah Time Display */}
                    <div className="flex justify-between items-center text-xs font-semibold border-t border-white/10 pt-2.5">
                      <span className="text-slate-400 font-bold text-[11px]">{t('iqamah')}</span>
                      {iqamahInfo ? (
                        <div className="text-right">
                          <span className={`font-mono font-bold text-sm block transition-colors duration-1000 ${activeFontTheme.accentText}`}>
                            {iqamahInfo.formatted}
                          </span>
                          {iqamahInfo.offsetLabel && (
                            <span className="text-[9px] text-slate-400 font-mono block">
                              {iqamahInfo.offsetLabel}
                            </span>
                          )}
                        </div>
                      ) : (
                        <span className="text-slate-500 font-mono">-</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Right Side: Hero Countdown + Auto-Rotating Educational Content */}
            <div className="col-span-4 flex flex-col gap-4 h-full justify-between">
              {/* Countdown Hero Box with Dynamic Shimmering Digits */}
              <div className="glass-card-hero p-6 rounded-2xl flex flex-col items-center justify-center text-center flex-1 relative overflow-hidden border border-sky-400/40 shadow-2xl">
                <div className={`absolute top-0 left-0 w-full h-1.5 transition-all duration-1000 ${activeFontTheme.cardActiveGlow} animate-pulse`} />
                <span className={`text-xs font-black tracking-widest uppercase px-4 py-1.5 rounded-full border mb-2 shadow-md transition-all duration-1000 ${activeFontTheme.badgeBorder}`}>
                  {t('countdownTo')} {(t(prayerState.nextPrayer) || prayerState.nextPrayer).toUpperCase()}
                </span>

                <div className={`text-5xl lg:text-6xl font-black font-mono tracking-tight my-2 transition-all duration-1000 ${activeFontTheme.countdownGlow}`}>
                  {formatSeconds(prayerState.timeRemainingSeconds)}
                </div>

                {/* Animated Progress Bar */}
                <div className="w-full bg-slate-900/80 rounded-full h-2.5 my-3 overflow-hidden border border-white/10 p-0.5">
                  <div
                    className={`h-full rounded-full transition-all duration-1000 shadow-md ${activeFontTheme.cardActiveGlow}`}
                    style={{
                      width: `${Math.min(100, Math.max(5, ((86400 - prayerState.timeRemainingSeconds) / 86400) * 100))}%`
                    }}
                  />
                </div>

                <p className="text-xs text-sky-100/90 font-medium">
                  {t('iqamahNotice')}
                </p>
              </div>

              {/* Auto-Rotating Slide Carousel */}
              <div className="glass-panel p-5 rounded-2xl flex flex-col justify-between flex-1 border border-slate-700/60 shadow-xl transition-all duration-500">
                <div className={`flex justify-between items-center text-xs font-extrabold tracking-widest uppercase mb-1 transition-colors duration-1000 ${activeFontTheme.accentText}`}>
                  <span className="flex items-center gap-2">
                    <span>{currentSlide.icon}</span>
                    <span>{currentSlide.type}</span>
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">
                    {slideIndex + 1} / {slidesList.length}
                  </span>
                </div>

                <p className="text-slate-100 text-sm font-medium leading-relaxed italic my-2">
                  {currentSlide.content}
                </p>

                <div className={`text-xs font-bold mt-2 border-t border-white/10 pt-2 transition-colors duration-1000 ${activeFontTheme.accentText}`}>
                  {currentSlide.reference}
                </div>
              </div>
            </div>
          </div>
        </main>

        {/* Bottom Announcement Ticker */}
        <footer className="glass-panel px-6 py-2.5 rounded-2xl flex items-center shrink-0 border border-slate-800 relative z-10 shadow-2xl">
          <div className={`px-3.5 py-1 text-white text-base font-black rounded-xl mr-5 shrink-0 shadow-md flex items-center gap-2 transition-all duration-1000 ${activeFontTheme.cardActiveGlow}`}>
            <span>📢</span>
            <span className="text-xs uppercase tracking-widest font-black hidden sm:inline">{t('announcements')}</span>
          </div>

          <div className="overflow-hidden whitespace-nowrap flex-1 relative mask-fade-edges">
            <div className="inline-block animate-marquee text-base font-bold text-slate-100 tracking-wide">
              <span>{announcementsStr}</span>
              <span className="mx-8">✦</span>
              <span>{announcementsStr}</span>
            </div>
          </div>
        </footer>

        {/* Silent Phone Alert Overlay Screen */}
        {showSilentAlert && (
          <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-2xl flex flex-col items-center justify-center text-center p-8 animate-fade-in">
            <div className="w-32 h-32 rounded-full bg-red-500/20 border-4 border-red-500/60 flex items-center justify-center text-6xl mb-8 animate-bounce">
              📵
            </div>
            <h2 className="text-3xl md:text-5xl font-black text-white uppercase tracking-wider mb-4 max-w-4xl drop-shadow-2xl">
              {t('silentPhoneAlert')}
            </h2>
            <p className="text-lg md:text-2xl text-sky-200 font-medium max-w-2xl mb-8 leading-relaxed">
              {t('silentPhoneSub')}
            </p>
            <button
              onClick={() => setShowSilentAlert(false)}
              className="px-8 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-bold border border-slate-600 transition-colors"
            >
              Dismiss (Esc)
            </button>
          </div>
        )}

        {/* TV Quick Settings Modal (Press '0' on TV Remote or Click Settings Gear) */}
        {showAdminMenu && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xl flex items-center justify-center p-6">
            <div className="bg-slate-950 border border-slate-700 rounded-3xl p-8 max-w-xl w-full shadow-2xl space-y-6">
              <div className="flex justify-between items-center border-b border-slate-800 pb-4">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">⚙️</span>
                  <div>
                    <h3 className="text-lg font-black text-white uppercase">TV Quick Settings</h3>
                    <p className="text-xs text-sky-400 font-medium">Remote Key Shortcut: Press 0</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowAdminMenu(false)}
                  className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center text-sm font-bold"
                >
                  ✕
                </button>
              </div>

              {/* Language Selection */}
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase mb-2">Display Language</label>
                <div className="grid grid-cols-4 gap-2">
                  {LANGUAGES.map((l) => (
                    <button
                      key={l.code}
                      onClick={() => setLanguage(l.code)}
                      className={`p-2.5 rounded-xl text-xs font-bold transition-all flex flex-col items-center gap-1 ${
                        lang === l.code
                          ? 'bg-gradient-to-r from-blue-600 to-sky-500 text-white font-black shadow-md'
                          : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                      }`}
                    >
                      <span>{l.flag}</span>
                      <span>{l.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Font Color Cycling Controls & Speed Selector */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-xs font-bold text-slate-300 uppercase">
                    🎨 Font Color Theme & Cycle Speed
                  </label>
                  <span className="text-[11px] font-mono text-sky-300">
                    Active: {activeFontTheme.name}
                  </span>
                </div>

                {/* 5 Theme Buttons */}
                <div className="grid grid-cols-5 gap-1.5 mb-3">
                  {FONT_THEMES.map((theme, idx) => (
                    <button
                      key={theme.id}
                      onClick={() => setFontThemeIndex(idx)}
                      className={`p-2 rounded-xl text-[11px] font-bold border transition-all flex flex-col items-center gap-1 ${
                        (fontThemeIndex % FONT_THEMES.length) === idx
                          ? 'border-white bg-slate-800 shadow-lg scale-105'
                          : 'border-slate-800 bg-slate-900/80 hover:border-slate-600'
                      }`}
                    >
                      <span className="w-4 h-4 rounded-full border border-white/40" style={{ backgroundColor: theme.previewColor }} />
                      <span className="truncate w-full text-center text-[10px]" style={{ color: theme.previewColor }}>{theme.name.split(' ')[0]}</span>
                    </button>
                  ))}
                </div>

                {/* Cycle Interval Selector */}
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400 font-semibold">Change Color Every:</span>
                  <div className="grid grid-cols-4 gap-2 flex-1">
                    {[
                      { sec: 4, label: '4s' },
                      { sec: 8, label: '8s (Ideal)' },
                      { sec: 15, label: '15s' },
                      { sec: 0, label: 'Lock (Off)' },
                    ].map((opt) => (
                      <button
                        key={opt.sec}
                        onClick={() => {
                          const updated = { ...settings, fontColorCycleSeconds: opt.sec };
                          setSettings(updated);
                          saveTVSettings(updated);
                        }}
                        className={`py-1.5 px-2 rounded-lg text-xs font-bold transition-all ${
                          (settings.fontColorCycleSeconds ?? 8) === opt.sec
                            ? 'bg-gradient-to-r from-blue-600 to-sky-500 text-white shadow-sm'
                            : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Auto Cycle Languages & 24h Clock Toggles */}
              <div className="grid grid-cols-2 gap-3">
                <label className="flex items-center gap-2 p-3 bg-slate-900 rounded-xl border border-slate-800 text-xs font-bold text-slate-200 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.autoCycleLanguages}
                    onChange={(e) => {
                      const updated = { ...settings, autoCycleLanguages: e.target.checked };
                      setSettings(updated);
                      saveTVSettings(updated);
                    }}
                    className="accent-sky-400 w-4 h-4"
                  />
                  <span>Auto-Cycle Languages (15s)</span>
                </label>

                <label className="flex items-center gap-2 p-3 bg-slate-900 rounded-xl border border-slate-800 text-xs font-bold text-slate-200 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.time24Format}
                    onChange={(e) => {
                      const updated = { ...settings, time24Format: e.target.checked };
                      setSettings(updated);
                      saveTVSettings(updated);
                    }}
                    className="accent-sky-400 w-4 h-4"
                  />
                  <span>24-Hour Time Format</span>
                </label>

                <label className="flex items-center gap-2 p-3 bg-slate-900 rounded-xl border border-slate-800 text-xs font-bold text-slate-200 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.showSunrise !== false}
                    onChange={(e) => {
                      const updated = { ...settings, showSunrise: e.target.checked };
                      setSettings(updated);
                      saveTVSettings(updated);
                    }}
                    className="accent-sky-400 w-4 h-4"
                  />
                  <span>Show Sunrise Card</span>
                </label>

                <label className="flex items-center gap-2 p-3 bg-slate-900 rounded-xl border border-slate-800 text-xs font-bold text-slate-200 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.phoneSilentAlertEnabled !== false}
                    onChange={(e) => {
                      const updated = { ...settings, phoneSilentAlertEnabled: e.target.checked };
                      setSettings(updated);
                      saveTVSettings(updated);
                    }}
                    className="accent-sky-400 w-4 h-4"
                  />
                  <span>Silent Phone Alert</span>
                </label>
              </div>

              {/* Sri Lanka Zone Selection */}
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase mb-2">Sri Lanka Prayer Zone</label>
                <select
                  value={settings.selectedZoneId || 'ZONE4'}
                  onChange={(e) => {
                    const updated = { ...settings, selectedZoneId: e.target.value };
                    setSettings(updated);
                    saveTVSettings(updated);
                  }}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sky-300 text-xs font-bold focus:border-sky-400 focus:outline-none"
                >
                  {SRI_LANKA_ZONES.map((z) => (
                    <option key={z.id} value={z.id}>
                      {z.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Action buttons */}
              <div className="flex flex-col gap-2 pt-2">
                <button
                  onClick={() => {
                    setShowSilentAlert(true);
                    setShowAdminMenu(false);
                  }}
                  className="py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-sky-300 font-bold rounded-xl text-xs transition-colors flex items-center justify-center gap-2"
                >
                  📵 Test Silent Phone Alert Display
                </button>
                <Link
                  href="/admin"
                  className="py-2.5 px-4 bg-gradient-to-r from-blue-600 to-sky-600 hover:from-blue-500 hover:to-sky-500 text-white font-bold rounded-xl text-xs transition-colors text-center shadow-lg shadow-blue-600/30"
                >
                  🛠 Open Full Admin Console
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};
