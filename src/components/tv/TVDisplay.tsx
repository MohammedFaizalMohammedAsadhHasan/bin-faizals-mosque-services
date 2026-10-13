'use client';

import React, { useState, useEffect, useRef } from 'react';
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
import { IqamahModal } from './IqamahModal';
import { SplashScreen } from '@/components/ui/SplashScreen';
import { BackgroundMedia } from './BackgroundMedia';
import { AmbientBubbles } from '@/components/ui/AmbientBubbles';
import { SpecialPrayerBanner } from './SpecialPrayerBanner';
import {
  getTVSettings,
  saveTVSettings,
  subscribeToSettingsChange,
  TVSettings,
  DEFAULT_SETTINGS
} from '@/lib/settings/settingsManager';
import {
  playAzanAudio,
  playIqamahAudio,
  stopAzanAudio,
  isAudioUnlocked,
  unlockAudioContext,
  hasPrayerAlertTriggered,
  markPrayerAlertTriggered,
  clearOldPrayerAlerts
} from '@/lib/audio/azanAudioEngine';
import { fetchLiveWeather, WeatherData } from '@/lib/weather/weatherEngine';
import {
  getTranslation,
  formatLocalizedDate,
  toEasternArabicNumerals,
  toRomanNumerals,
  formatWithNumeralSystem,
  LANGUAGES,
  LanguageCode
} from '@/lib/i18n/i18n';

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

function parseTimeToMinutes(timeStr?: string): number | null {
  if (!timeStr) return null;
  const parts = timeStr.trim().split(':');
  if (parts.length < 2) return null;
  const h = parseInt(parts[0], 10);
  const m = parseInt(parts[1], 10);
  if (isNaN(h) || isNaN(m)) return null;
  return h * 60 + m;
}

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
  const [activeIqamahAlertPrayer, setActiveIqamahAlertPrayer] = useState<string | null>(null);
  const [showSilentAlert, setShowSilentAlert] = useState(false);
  const [slideIndex, setSlideIndex] = useState(0);
  const [showAdminMenu, setShowAdminMenu] = useState(false);
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [audioReady, setAudioReady] = useState(false);

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

  // Check audio unlocked state
  useEffect(() => {
    setAudioReady(isAudioUnlocked());
    const interval = setInterval(() => {
      setAudioReady(isAudioUnlocked());
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  // Auto-cycle font colors smoothly every N seconds
  useEffect(() => {
    const cycleSeconds = settings.fontColorCycleSeconds ?? 8;
    if (cycleSeconds <= 0) return;

    const timer = setInterval(() => {
      setFontThemeIndex((prev) => (prev + 1) % FONT_THEMES.length);
    }, cycleSeconds * 1000);

    return () => clearInterval(timer);
  }, [settings.fontColorCycleSeconds]);

  // Auto-cycle languages every 15s if enabled
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
    const weatherInterval = setInterval(updateWeather, 1800000);
    return () => clearInterval(weatherInterval);
  }, [settings.weather]);

  const computeIqamahMinutes = (
    prayerKey: 'fajr' | 'dhuhr' | 'asr' | 'maghrib' | 'isha',
    azanTimeStr?: string
  ): number | null => {
    const customTime = settings.customIqamahTimes?.[prayerKey];
    if (customTime && customTime.trim() !== '') {
      return parseTimeToMinutes(customTime);
    }
    const azanMins = parseTimeToMinutes(azanTimeStr);
    if (azanMins === null) return null;
    const offsetMin = settings.iqamahOffsets[prayerKey] || 0;
    return (azanMins + offsetMin) % (24 * 60);
  };

  // Real-Time 1-Second Timer for Clock, Prayer Evaluation & Automated Voice Alerts
  useEffect(() => {
    const interval = setInterval(async () => {
      const now = new Date();
      setTime(now);

      const activeTimes = await resolvePrayerTimesAsync(now);
      setPrayerTimes(activeTimes);

      const currentState = resolvePrayerState(activeTimes, now);
      setPrayerState(currentState);

      setHijriDateStr(getFormattedHijriDate(now, 0, lang, settings.arabicNumerals ?? false));

      // Trigger "Silent Phone Alert" when prayer is in progress
      if (settings.phoneSilentAlertEnabled !== false && currentState.isIqamahActive) {
        setShowSilentAlert(true);
      } else if (!currentState.isIqamahActive) {
        setShowSilentAlert(false);
      }

      // --- AUTOMATIC AZAN & IQAMATH VOICE ALERT SYSTEM ---
      const todayDateStr = now.toISOString().split('T')[0];
      clearOldPrayerAlerts(todayDateStr);

      const currentMinutes = now.getHours() * 60 + now.getMinutes();
      const currentSeconds = now.getSeconds();

      const dailyFivePrayers: { key: 'fajr' | 'dhuhr' | 'asr' | 'maghrib' | 'isha'; azan: string }[] = [
        { key: 'fajr', azan: activeTimes.fajr },
        { key: 'dhuhr', azan: activeTimes.dhuhr },
        { key: 'asr', azan: activeTimes.asr },
        { key: 'maghrib', azan: activeTimes.maghrib },
        { key: 'isha', azan: activeTimes.isha },
      ];

      for (const p of dailyFivePrayers) {
        // 1. Azan Voice Alert Trigger
        const azanMins = parseTimeToMinutes(p.azan);
        if (azanMins !== null && currentMinutes === azanMins && currentSeconds < 20) {
          const azanEventId = `${p.key}-azan-${todayDateStr}`;
          if (!hasPrayerAlertTriggered(azanEventId)) {
            markPrayerAlertTriggered(azanEventId);
            if (settings.azanAudio.enabled && settings.azanAudio.azanAlertEnabled !== false) {
              setDismissedAzan(false);
              const targetAudio = p.key === 'fajr'
                ? (settings.azanAudio.fajrAudio || '/audio/azan-madina.mp3')
                : (settings.azanAudio.dhuhrAudio || settings.azanAudio.fajrAudio || '/audio/azan-madina.mp3');
              playAzanAudio(targetAudio, settings.azanAudio.volume);
            }
          }
        }

        // 2. Iqamath Voice Alert Trigger (Strictly for the 5 daily prayers, never for Sunrise)
        const iqamahMins = computeIqamahMinutes(p.key, p.azan);
        if (iqamahMins !== null && currentMinutes === iqamahMins && currentSeconds < 20) {
          const iqamahEventId = `${p.key}-iqamah-${todayDateStr}`;
          if (!hasPrayerAlertTriggered(iqamahEventId)) {
            markPrayerAlertTriggered(iqamahEventId);
            if (settings.azanAudio.enabled && settings.azanAudio.iqamahAlertEnabled !== false) {
              setActiveIqamahAlertPrayer(t(p.key) || p.key);
              const iqamahAudio = settings.azanAudio.iqamahAudio || '/audio/iqamah-alert.mp3';
              playIqamahAudio(iqamahAudio, settings.azanAudio.volume);
            }
          }
        }
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [settings, lang]);

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
        setActiveIqamahAlertPrayer(null);
        setDismissedAzan(true);
        stopAzanAudio();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const formatSeconds = (sec: number) => {
    const hrs = Math.floor(sec / 3600);
    const mins = Math.floor((sec % 3600) / 60);
    const secs = sec % 60;
    const raw = `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    return formatWithNumeralSystem(raw, settings.numeralSystem, lang === 'ar', settings.arabicNumerals ?? false);
  };

  const formatDisplayTime = (timeStr?: string) => {
    if (!timeStr) return '--:--';
    const formatted = settings.time24Format ? timeStr : formatTo12Hour(timeStr);
    return formatWithNumeralSystem(formatted, settings.numeralSystem, lang === 'ar', settings.arabicNumerals ?? false);
  };

  const computeIqamahTimeStr = (
    prayerKey: keyof typeof settings.iqamahOffsets,
    azanTimeStr?: string
  ): { formatted: string; offsetLabel: string } => {
    const customTime = settings.customIqamahTimes?.[prayerKey as keyof typeof settings.customIqamahTimes];
    if (customTime && customTime.trim() !== '') {
      const base = settings.time24Format ? customTime : formatTo12Hour(customTime);
      return {
        formatted: formatWithNumeralSystem(base, settings.numeralSystem, lang === 'ar', settings.arabicNumerals ?? false),
        offsetLabel: lang === 'ar' ? 'يدوي' : 'Manual'
      };
    }

    if (!azanTimeStr) return { formatted: '--:--', offsetLabel: '' };
    const offsetMin = settings.iqamahOffsets[prayerKey] || 0;
    const computed24 = adjustTimeString(azanTimeStr, offsetMin);
    const base = settings.time24Format ? computed24 : formatTo12Hour(computed24);
    const offsetTxt = lang === 'ar' ? `+${offsetMin}د` : `+${offsetMin}m`;

    return {
      formatted: formatWithNumeralSystem(base, settings.numeralSystem, lang === 'ar', settings.arabicNumerals ?? false),
      offsetLabel: formatWithNumeralSystem(offsetTxt, settings.numeralSystem, lang === 'ar', settings.arabicNumerals ?? false)
    };
  };

  const setLanguage = (newLang: LanguageCode) => {
    const updated = { ...settings, language: newLang };
    setSettings(updated);
    saveTVSettings(updated);
  };

  // Base Prayers: All 6 prayers included
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
      "📵Please turn off or silence your mobile phones inside the Mosque.",
      "🤲 May Allah accept all our prayers and ibadah"
    ];
  const announcementsStr = announcementsList.join('   ✦   ');

  const handleManualAudioUnlock = () => {
    unlockAudioContext().then(() => {
      setAudioReady(true);
      playAzanAudio('/audio/azan-madina.mp3', settings.azanAudio.volume);
    });
  };

  return (
    <>
      {showSplash && <SplashScreen onComplete={() => setShowSplash(false)} minDurationMs={1800} />}

      {/* Main TV Screen: Strictly bounded to full screen height and width without scrolling */}
      <div className="tv-container flex flex-col h-screen max-h-screen w-screen p-2.5 sm:p-3.5 lg:p-4 select-none overflow-hidden justify-between relative bg-[#020617] text-slate-100">
        {/* Dynamic Royal Mosque Background Slideshow (100% Mosque Architecture, No Humans) */}
        <BackgroundMedia settings={settings.background} />

        {/* Ambient Floating Bubbles & Bokeh Orbs */}
        <AmbientBubbles />

        {/* Full Azan Audio & Visual Modal */}
        <AdhanModal
          prayerName={t(prayerState.nextPrayer) || prayerState.nextPrayer}
          isOpen={prayerState.isAzanActive && !dismissedAzan}
          onClose={() => {
            setDismissedAzan(true);
            stopAzanAudio();
          }}
          audioSettings={settings.azanAudio}
        />

        {/* Full Iqamath Voice Alert Modal */}
        <IqamahModal
          prayerName={activeIqamahAlertPrayer || t(prayerState.nextPrayer) || prayerState.nextPrayer}
          isOpen={activeIqamahAlertPrayer !== null}
          onClose={() => {
            setActiveIqamahAlertPrayer(null);
            stopAzanAudio();
          }}
          audioSettings={settings.azanAudio}
        />

        {/* Top Header Bar */}
        <header className="glass-panel flex justify-between items-center px-4 sm:px-6 py-2 sm:py-2.5 rounded-2xl shrink-0 border border-blue-500/30 shadow-2xl relative z-10 gap-3">
          {/* Mosque Brand & Title */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-blue-500 via-sky-500 to-indigo-600 flex items-center justify-center font-bold text-white text-2xl shadow-lg shadow-blue-500/40 border border-sky-300 shrink-0">
              🕌
            </div>
            <div>
              <h1 className={`text-lg sm:text-2xl font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-r ${activeFontTheme.brandTitle} uppercase drop-shadow-md transition-all duration-1000 leading-tight`}>
                {settings.mosqueName}
              </h1>
              <div className="flex items-center gap-2 mt-0.5">
                <span className={`text-[10px] sm:text-xs font-black tracking-widest uppercase bg-blue-950/80 px-2 py-0.5 rounded-md border border-blue-500/30 ${activeFontTheme.accentText} transition-colors duration-1000`}>
                  {settings.displayName}
                </span>
                <span className="text-[10px] sm:text-xs text-slate-300 font-bold uppercase tracking-wide hidden md:inline">
                  • {t('mosqueServices')}
                </span>
              </div>
            </div>
          </div>

          {/* Center Actions: Language Switcher & Automatic Voice Alert Arm Indicator */}
          <div className="flex items-center gap-2">
            {/* Automatic Voice Alerts Status Pill */}
            <button
              onClick={handleManualAudioUnlock}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 border shadow-md ${
                settings.azanAudio.enabled
                  ? audioReady
                    ? 'bg-emerald-950/80 border-emerald-500/50 text-emerald-300'
                    : 'bg-amber-950/90 border-amber-500/60 text-amber-200 animate-pulse'
                  : 'bg-slate-900/80 border-slate-700 text-slate-400'
              }`}
              title="Click to test or enable automated Azan & Iqamath voice alerts"
            >
              <span className="text-sm">{settings.azanAudio.enabled ? (audioReady ? '🔊' : '🔔') : '🔇'}</span>
              <span className="hidden xl:inline text-[11px] font-black uppercase tracking-wider">
                {settings.azanAudio.enabled
                  ? audioReady
                    ? 'Voice Alerts: Armed'
                    : 'Click to Enable Audio'
                  : 'Alerts Muted'}
              </span>
            </button>

            {/* Language & Arabic Mode Options */}
            <div className="flex items-center gap-1.5 bg-slate-900/85 border border-blue-500/30 p-1 rounded-2xl backdrop-blur-md shadow-lg">
              {/* EN */}
              <button
                onClick={() => setLanguage('en')}
                className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all flex items-center gap-1 ${
                  lang === 'en'
                    ? 'bg-gradient-to-r from-blue-600 to-sky-500 text-white shadow-md font-black scale-105'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
                title="English Language"
              >
                <span>🇬🇧</span>
                <span>EN</span>
              </button>

              {/* Arabic Option 1: Arabic Words with Default 0-9 Numbers */}
              <button
                onClick={() => {
                  const updated = {
                    ...settings,
                    language: 'ar' as LanguageCode,
                    arabicNumerals: false,
                    numeralSystem: 'western' as const
                  };
                  setSettings(updated);
                  saveTVSettings(updated);
                }}
                className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  lang === 'ar' && !settings.arabicNumerals && settings.numeralSystem !== 'eastern_arabic'
                    ? 'bg-gradient-to-r from-blue-600 to-sky-500 text-white shadow-md font-black scale-105 border border-sky-400/60'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
                title="الخيار ١: نصوص عربية + أرقام عادية (0-9) - Arabic Sentences with Default Numbers"
              >
                <span>🇸🇦</span>
                <span>عربي (0-9)</span>
              </button>

              {/* Arabic Option 2: Totally Arabic (Arabic Words + ٠-٩ Numerals for all times, azan, iqamath & countdown) */}
              <button
                onClick={() => {
                  const updated = {
                    ...settings,
                    language: 'ar' as LanguageCode,
                    arabicNumerals: true,
                    numeralSystem: 'eastern_arabic' as const
                  };
                  setSettings(updated);
                  saveTVSettings(updated);
                }}
                className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  lang === 'ar' && (settings.arabicNumerals || settings.numeralSystem === 'eastern_arabic')
                    ? 'bg-gradient-to-r from-emerald-600 to-teal-500 text-white shadow-md font-black scale-105 border border-emerald-400'
                    : 'text-emerald-300 hover:text-white hover:bg-slate-800'
                }`}
                title="الخيار ٢: عربي كـامـل (نصوص عربية + أرقام شرقية ٠-٩ لجميع الأوقات والأذان والإقامة) - Totally Arabic Format (٠-٩)"
              >
                <span>✨</span>
                <span>عربي كامل (٠-٩)</span>
              </button>

              {/* TA */}
              <button
                onClick={() => setLanguage('ta')}
                className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all flex items-center gap-1 ${
                  lang === 'ta'
                    ? 'bg-gradient-to-r from-blue-600 to-sky-500 text-white shadow-md font-black scale-105'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
                title="Tamil Language"
              >
                <span>🇱🇰</span>
                <span className="hidden sm:inline">TA</span>
              </button>

              {/* SI */}
              <button
                onClick={() => setLanguage('si')}
                className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all flex items-center gap-1 ${
                  lang === 'si'
                    ? 'bg-gradient-to-r from-blue-600 to-sky-500 text-white shadow-md font-black scale-105'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
                title="Sinhala Language"
              >
                <span>🇱🇰</span>
                <span className="hidden sm:inline">SI</span>
              </button>
            </div>
          </div>

          {/* Live Weather Widget */}
          {weatherData && (
            <div className="hidden 2xl:flex items-center gap-2.5 bg-slate-900/80 border border-blue-500/20 px-4 py-1.5 rounded-xl backdrop-blur-md">
              <span className="text-2xl">{weatherData.icon}</span>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-sm font-black text-white">{weatherData.tempC}°C</span>
                  <span className={`text-[11px] font-bold ${activeFontTheme.accentText} transition-colors duration-1000`}>{weatherData.condition}</span>
                </div>
                <div className="text-[9px] text-slate-400 flex items-center gap-2 font-medium">
                  <span>💧 {weatherData.humidity}%</span>
                  <span>💨 {weatherData.windSpeedKmH} km/h</span>
                </div>
              </div>
            </div>
          )}

          {/* Live Clock & Dates */}
          <div className="text-right flex items-center gap-3 sm:gap-4 shrink-0">
            <div className={`text-3xl sm:text-5xl md:text-6xl lg:text-6xl xl:text-7xl font-black font-mono tracking-tight leading-none transition-all duration-1000 whitespace-nowrap drop-shadow-[0_0_25px_rgba(56,189,248,0.7)] ${activeFontTheme.clockGlow}`}>
              {mounted
                ? (() => {
                    const raw = time.toLocaleTimeString('en-US', {
                      hour: '2-digit',
                      minute: '2-digit',
                      second: '2-digit',
                      hour12: !settings.time24Format
                    });
                    return formatWithNumeralSystem(
                      raw,
                      settings.numeralSystem,
                      lang === 'ar',
                      settings.arabicNumerals ?? false
                    );
                  })()
                : '--:--:--'}
            </div>
            <div className="h-8 w-px bg-slate-700/60 hidden sm:block" />
            <div className="text-right hidden sm:block">
              <div className="text-[11px] sm:text-xs font-bold text-slate-200 uppercase tracking-wide">
                {mounted
                  ? formatLocalizedDate(
                      time,
                      lang,
                      settings.numeralSystem || (lang === 'ar' && settings.arabicNumerals ? 'eastern_arabic' : 'western')
                    )
                  : '---'}
              </div>
              <div className={`text-xs sm:text-sm font-arabic font-bold mt-0.5 transition-colors duration-1000 ${activeFontTheme.accentText}`}>
                {mounted ? hijriDateStr : '---'}
              </div>
            </div>
            <button
              onClick={() => setShowAdminMenu(true)}
              className="p-2 text-slate-400 hover:text-white rounded-xl bg-slate-800/60 hover:bg-slate-800 border border-slate-700 transition-all text-xs sm:text-sm shrink-0"
              title="Quick Options (Key: 0)"
            >
              ⚙
            </button>
          </div>
        </header>

        {/* Main Grid Area: 100% visible, No vertical scrolling, perfectly fitted */}
        <main className="flex-1 min-h-0 flex flex-col my-1.5 overflow-hidden relative z-10">
          {/* Special Prayer Scheduler Banner (Conditional) */}
          <SpecialPrayerBanner specialPrayers={settings.specialPrayers} />

          <div className="grid grid-cols-12 gap-3 xl:gap-4 flex-1 min-h-0 items-stretch overflow-hidden">
            {/* Left Side: All 6 Daily Prayer Cards (Subah, Sunrise, Luhar, Asr, Maghrib, Isha) */}
            <div className={`col-span-8 grid ${prayersList.length > 5 ? 'grid-cols-3 grid-rows-2' : 'grid-cols-5 grid-rows-1'} gap-2.5 sm:gap-3 xl:gap-3.5 h-full min-h-0`}>
              {prayersList.map((item) => {
                const isSunrise = item.key === 'sunrise';
                const isActive = prayerState.nextPrayer === item.key;
                const iqamahInfo = (!isSunrise && item.iqamahKey)
                  ? computeIqamahTimeStr(item.iqamahKey, item.azan24)
                  : null;

                return (
                  <div
                    key={item.key}
                    className={`h-full min-h-0 flex flex-col justify-between p-2.5 sm:p-3 xl:p-4 rounded-2xl transition-all duration-500 shadow-2xl relative overflow-hidden ${
                      isActive
                        ? `glass-card-active pulse-royal border-2 ${activeFontTheme.cardActiveBorder}`
                        : 'glass-card-inactive border border-white/10'
                    }`}
                  >
                    {/* Top: Prayer Name & Next Indicator */}
                    <div className="flex justify-between items-center gap-1.5 shrink-0">
                      <span className={`text-base sm:text-lg lg:text-xl xl:text-2xl font-black uppercase tracking-wide drop-shadow leading-tight truncate ${
                        lang === 'ar' ? 'font-arabic' : ''
                      } ${isActive ? activeFontTheme.accentText : 'text-slate-100'}`}>
                        {item.label}
                      </span>
                      {isActive && (
                        <span className={`px-2 sm:px-2.5 py-0.5 text-white text-[10px] sm:text-xs font-black tracking-wider rounded-full uppercase shadow-md shrink-0 transition-all duration-1000 ${activeFontTheme.cardActiveGlow}`}>
                          {t('next')}
                        </span>
                      )}
                    </div>

                    {/* Middle: Prominent Time Display */}
                    {isSunrise ? (
                      /* Sunrise Section: Centered, huge, bold time with ZERO Iqamath option */
                      <div className="flex-1 flex flex-col items-center justify-center my-0.5">
                        <span className="text-[10px] sm:text-xs font-black uppercase tracking-widest text-amber-300 block mb-0.5">
                          🌅 {t('sunrise').toUpperCase()}
                        </span>
                        <div className="text-3xl sm:text-4xl lg:text-4xl xl:text-5xl 2xl:text-6xl font-black font-mono tracking-tight leading-none text-white drop-shadow-xl">
                          {formatDisplayTime(item.azan24)}
                        </div>
                      </div>
                    ) : (
                      /* 5 Daily Prayers: Large Azan Label and Giant Time Numbers */
                      <div className="my-0.5 sm:my-1">
                        <span className="text-[10px] sm:text-xs font-black uppercase tracking-wider text-slate-300 block mb-0.5">
                          {t('azan')}
                        </span>
                        <div className={`text-3xl sm:text-4xl lg:text-4xl xl:text-5xl font-black font-mono tracking-tight leading-none drop-shadow-xl transition-all duration-1000 ${
                          isActive ? activeFontTheme.prayerActiveTime : 'text-white'
                        }`}>
                          {formatDisplayTime(item.azan24)}
                        </div>
                      </div>
                    )}

                    {/* Bottom: Dedicated Iqamah Sub-Panel (Strictly for 5 daily prayers, NOT for Sunrise) */}
                    {isSunrise ? (
                      /* Sunrise Section: No Iqamath option required */
                      <div className="bg-amber-950/40 border border-amber-500/20 rounded-xl px-2.5 py-1.5 text-center shrink-0">
                        <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-amber-200/90 font-mono">
                          🌅 NO IQAMATH • DUHA TIME
                        </span>
                      </div>
                    ) : (
                      /* Daily 5 Prayers: Subah, Luhar, Asr, Maghrib, Isha Iqamah Sub-Panel */
                      <div className="bg-slate-950/80 border border-white/10 rounded-xl px-2.5 sm:px-3 py-1.5 sm:py-2 flex justify-between items-center shrink-0 shadow-inner">
                        <span className="text-[10px] sm:text-xs xl:text-sm font-black uppercase tracking-wider text-slate-200">
                          {t('iqamah')}
                        </span>
                        {iqamahInfo ? (
                          <div className="text-right">
                            <span className={`font-mono font-black text-xl sm:text-2xl xl:text-3xl block leading-none transition-colors duration-1000 ${
                              isActive ? activeFontTheme.accentText : 'text-sky-300'
                            }`}>
                              {iqamahInfo.formatted}
                            </span>
                            {iqamahInfo.offsetLabel && (
                              <span className="text-[10px] sm:text-xs font-mono font-bold text-sky-400 block mt-0.5">
                                {iqamahInfo.offsetLabel}
                              </span>
                            )}
                          </div>
                        ) : (
                          <span className="text-slate-500 font-mono font-bold text-lg">-</span>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Right Side: Hero Countdown + Optimized Info Boxes Below */}
            <div className="col-span-4 h-full min-h-0 flex flex-col gap-2.5 sm:gap-3 justify-between">
              {/* Box 1: Countdown Hero Box with High-Contrast Shimmering Digits */}
              <div className="glass-card-hero p-3.5 sm:p-4 rounded-2xl flex flex-col items-center justify-center text-center relative overflow-hidden border border-sky-400/40 shadow-2xl flex-[1.2] min-h-0">
                <div className={`absolute top-0 left-0 w-full h-1.5 transition-all duration-1000 ${activeFontTheme.cardActiveGlow} animate-pulse`} />
                <span className={`text-[10px] sm:text-xs font-black tracking-widest uppercase px-3 sm:px-4 py-1 rounded-full border mb-1.5 shadow-md transition-all duration-1000 ${activeFontTheme.badgeBorder}`}>
                  {t('countdownTo')} {(t(prayerState.nextPrayer) || prayerState.nextPrayer).toUpperCase()}
                </span>

                <div className={`text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-black font-mono tracking-tight my-1 leading-none transition-all duration-1000 ${activeFontTheme.countdownGlow}`}>
                  {formatSeconds(prayerState.timeRemainingSeconds)}
                </div>

                {/* Animated Progress Bar */}
                <div className="w-full bg-slate-900/80 rounded-full h-2 my-2 overflow-hidden border border-white/10 p-0.5">
                  <div
                    className={`h-full rounded-full transition-all duration-1000 shadow-md ${activeFontTheme.cardActiveGlow}`}
                    style={{
                      width: `${Math.min(100, Math.max(5, ((86400 - prayerState.timeRemainingSeconds) / 86400) * 100))}%`
                    }}
                  />
                </div>

                <p className="text-[10px] sm:text-xs text-sky-100/90 font-medium leading-tight">
                  {t('iqamahNotice')}
                </p>
              </div>

              {/* Box 2: Next Prayer & Voice Alert Live Status Box */}
              <div className="p-3 sm:p-3.5 rounded-2xl bg-slate-950/75 border border-white/10 flex flex-col justify-between flex-[0.9] min-h-0 shadow-xl overflow-hidden">
                <div className="flex justify-between items-center text-[10px] sm:text-xs font-black uppercase tracking-wider text-slate-300 border-b border-white/10 pb-1.5">
                  <span className="flex items-center gap-1.5">
                    <span className="text-sky-400">🕒</span>
                    <span>NEXT PRAYER &amp; VOICE ALERT</span>
                  </span>
                  <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                    settings.azanAudio.enabled
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                      : 'bg-slate-800 text-slate-400'
                  }`}>
                    {settings.azanAudio.enabled ? 'ALERTS ARMED' : 'MUTED'}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 my-1">
                  <div className="bg-slate-900/80 p-2 rounded-xl border border-white/5">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Next Azan Call</span>
                    <span className="text-base sm:text-lg font-black font-mono text-white">
                      {formatDisplayTime((prayerTimes as any)?.[prayerState.nextPrayer])}
                    </span>
                  </div>
                  <div className="bg-slate-900/80 p-2 rounded-xl border border-white/5">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Next Iqamath Call</span>
                    <span className="text-base sm:text-lg font-black font-mono text-sky-300">
                      {prayerState.nextPrayer !== 'sunrise'
                        ? computeIqamahTimeStr(prayerState.nextPrayer as any, (prayerTimes as any)?.[prayerState.nextPrayer]).formatted
                        : 'No Iqamah'}
                    </span>
                  </div>
                </div>

                <div className="flex justify-between items-center pt-1 border-t border-white/5 text-[10px] sm:text-xs">
                  <div className="flex items-center gap-1.5 text-slate-300">
                    <span className="text-emerald-400 animate-pulse">🔊</span>
                    <span className="font-semibold truncate">Madinah Azan &amp; Iqamath</span>
                  </div>
                  <button
                    onClick={() => {
                      unlockAudioContext();
                      playAzanAudio(settings.azanAudio.fajrAudio || '/audio/azan-madina.mp3', settings.azanAudio.volume);
                    }}
                    className="px-2.5 py-1 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-[10px] uppercase tracking-wider transition-all shadow"
                    title="Test Madinah Azan Voice Alert"
                  >
                    Test Alert 🔊
                  </button>
                </div>
              </div>

              {/* Box 3: Auto-Rotating Islamic Inspiration / Hadith Slide */}
              <div className="glass-panel p-3 sm:p-3.5 rounded-2xl flex flex-col justify-between flex-[0.9] min-h-0 border border-slate-700/60 shadow-xl overflow-hidden">
                <div className={`flex justify-between items-center text-[10px] sm:text-xs font-black tracking-widest uppercase mb-1 transition-colors duration-1000 ${activeFontTheme.accentText}`}>
                  <span className="flex items-center gap-1.5">
                    <span>{currentSlide.icon}</span>
                    <span>{currentSlide.type}</span>
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">
                    {slideIndex + 1} / {slidesList.length}
                  </span>
                </div>

                <p className="text-slate-100 text-xs sm:text-sm font-medium leading-snug italic my-1 line-clamp-3">
                  {currentSlide.content}
                </p>

                <div className={`text-[10px] sm:text-xs font-bold mt-1 border-t border-white/10 pt-1 transition-colors duration-1000 truncate ${activeFontTheme.accentText}`}>
                  {currentSlide.reference}
                </div>
              </div>
            </div>
          </div>
        </main>

        {/* Bottom Announcement Ticker */}
        <footer className="glass-panel px-4 sm:px-6 py-1.5 sm:py-2 rounded-2xl flex items-center shrink-0 border border-slate-800 relative z-10 shadow-2xl">
          <div className={`px-3 py-1 text-white text-xs sm:text-sm font-black rounded-xl mr-4 shrink-0 shadow-md flex items-center gap-1.5 transition-all duration-1000 ${activeFontTheme.cardActiveGlow}`}>
            <span>📢</span>
            <span className="text-[10px] sm:text-xs uppercase tracking-widest font-black hidden sm:inline">{t('announcements')}</span>
          </div>

          <div className="overflow-hidden whitespace-nowrap flex-1 relative mask-fade-edges">
            <div className="inline-block animate-marquee text-xs sm:text-sm font-bold text-slate-100 tracking-wide">
              <span>{announcementsStr}</span>
              <span className="mx-8">✦</span>
              <span>{announcementsStr}</span>
            </div>
          </div>
        </footer>

        {/* Silent Phone Alert Overlay Screen */}
        {showSilentAlert && (
          <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-2xl flex flex-col items-center justify-center text-center p-8 animate-fade-in">
            <div className="w-28 h-28 rounded-full bg-red-500/20 border-4 border-red-500/60 flex items-center justify-center text-5xl mb-6 animate-bounce">
              📵
            </div>
            <h2 className="text-2xl md:text-4xl font-black text-white uppercase tracking-wider mb-3 max-w-4xl drop-shadow-2xl">
              {t('silentPhoneAlert')}
            </h2>
            <p className="text-base md:text-xl text-sky-200 font-medium max-w-2xl mb-6 leading-relaxed">
              {t('silentPhoneSub')}
            </p>
            <button
              onClick={() => setShowSilentAlert(false)}
              className="px-8 py-2.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-bold border border-slate-600 transition-colors"
            >
              Dismiss (Esc)
            </button>
          </div>
        )}

        {/* TV Quick Settings Modal (Press '0' on TV Remote or Click Settings Gear) */}
        {showAdminMenu && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xl flex items-center justify-center p-6">
            <div className="bg-slate-950 border border-slate-700 rounded-3xl p-6 sm:p-8 max-w-xl w-full shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center border-b border-slate-800 pb-3">
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

              {/* Automatic Voice Alerts Section */}
              <div className="bg-slate-900/90 p-4 rounded-2xl border border-slate-800 space-y-3">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold text-sky-300 uppercase flex items-center gap-2">
                    <span>🔊</span> Automated Voice Alerts (Madinah Azan &amp; Iqamath)
                  </label>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.azanAudio.enabled}
                      onChange={(e) => {
                        const updated = {
                          ...settings,
                          azanAudio: { ...settings.azanAudio, enabled: e.target.checked }
                        };
                        setSettings(updated);
                        saveTVSettings(updated);
                        if (e.target.checked) unlockAudioContext();
                      }}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-1">
                  <label className="flex items-center gap-2 cursor-pointer bg-slate-950/80 p-2 rounded-xl border border-slate-800 text-xs">
                    <input
                      type="checkbox"
                      checked={settings.azanAudio.azanAlertEnabled !== false}
                      onChange={(e) => {
                        const updated = {
                          ...settings,
                          azanAudio: { ...settings.azanAudio, azanAlertEnabled: e.target.checked }
                        };
                        setSettings(updated);
                        saveTVSettings(updated);
                      }}
                      className="accent-sky-400"
                    />
                    <span className="font-bold text-slate-200">Azan Voice Alert</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer bg-slate-950/80 p-2 rounded-xl border border-slate-800 text-xs">
                    <input
                      type="checkbox"
                      checked={settings.azanAudio.iqamahAlertEnabled !== false}
                      onChange={(e) => {
                        const updated = {
                          ...settings,
                          azanAudio: { ...settings.azanAudio, iqamahAlertEnabled: e.target.checked }
                        };
                        setSettings(updated);
                        saveTVSettings(updated);
                      }}
                      className="accent-sky-400"
                    />
                    <span className="font-bold text-slate-200">Iqamath Voice Alert</span>
                  </label>
                </div>

                {/* Volume slider */}
                <div>
                  <div className="flex justify-between items-center text-xs font-bold text-slate-300 mb-1">
                    <span>Alert Volume</span>
                    <span className="font-mono text-sky-400">{Math.round((settings.azanAudio.volume ?? 1) * 100)}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={settings.azanAudio.volume ?? 1}
                    onChange={(e) => {
                      const vol = parseFloat(e.target.value);
                      const updated = {
                        ...settings,
                        azanAudio: { ...settings.azanAudio, volume: vol }
                      };
                      setSettings(updated);
                      saveTVSettings(updated);
                    }}
                    className="w-full accent-sky-400 cursor-pointer"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2 pt-1">
                  <button
                    onClick={() => {
                      unlockAudioContext();
                      playAzanAudio(settings.azanAudio.fajrAudio || '/audio/azan-madina.mp3', settings.azanAudio.volume);
                    }}
                    className="py-2 px-3 bg-blue-600/80 hover:bg-blue-600 text-white rounded-xl text-xs font-bold transition-all shadow"
                  >
                    🔊 Test Madinah Azan
                  </button>
                  <button
                    onClick={() => {
                      unlockAudioContext();
                      playIqamahAudio(settings.azanAudio.iqamahAudio || '/audio/iqamah-alert.mp3', settings.azanAudio.volume);
                    }}
                    className="py-2 px-3 bg-emerald-600/80 hover:bg-emerald-600 text-white rounded-xl text-xs font-bold transition-all shadow"
                  >
                    🔊 Test Iqamath Voice
                  </button>
                </div>
              </div>

              {/* Language Selection */}
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase mb-2">Display Language</label>
                <div className="grid grid-cols-4 gap-2">
                  {LANGUAGES.map((l) => (
                    <button
                      key={l.code}
                      onClick={() => setLanguage(l.code)}
                      className={`p-2.5 rounded-xl text-xs font-bold transition-all flex flex-col items-center gap-1 ${lang === l.code
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

              {/* Numeral System & Arabic Format Setting */}
              <div className="bg-slate-900/90 p-3.5 rounded-2xl border border-slate-800">
                <div className="flex justify-between items-center mb-2">
                  <label className="text-xs font-bold text-slate-300 uppercase">
                    {t('numeralFormat')} / Numeral System
                  </label>
                  <span className="text-[11px] font-mono text-sky-300 font-bold">
                    {settings.numeralSystem === 'roman'
                      ? 'Roman Numerals (I, II, III)'
                      : (settings.numeralSystem === 'eastern_arabic' || settings.arabicNumerals)
                        ? 'Eastern Arabic (٠-٩)'
                        : 'Default Western (0-9)'}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => {
                      const updated = {
                        ...settings,
                        numeralSystem: 'western' as const,
                        arabicNumerals: false
                      };
                      setSettings(updated);
                      saveTVSettings(updated);
                    }}
                    className={`py-2 px-2.5 rounded-xl text-xs font-bold transition-all text-center ${
                      settings.numeralSystem !== 'roman' && !settings.arabicNumerals && settings.numeralSystem !== 'eastern_arabic'
                        ? 'bg-gradient-to-r from-blue-600 to-sky-500 text-white font-black shadow-md'
                        : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                    }`}
                  >
                    123 Default (0-9)
                  </button>
                  <button
                    onClick={() => {
                      const updated = {
                        ...settings,
                        numeralSystem: 'eastern_arabic' as const,
                        arabicNumerals: true
                      };
                      setSettings(updated);
                      saveTVSettings(updated);
                    }}
                    className={`py-2 px-2.5 rounded-xl text-xs font-bold transition-all text-center ${
                      settings.numeralSystem === 'eastern_arabic' || settings.arabicNumerals
                        ? 'bg-gradient-to-r from-emerald-600 to-teal-500 text-white font-black shadow-md'
                        : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                    }`}
                  >
                    ٠١٢٣ شرقية (٠-٩)
                  </button>
                  <button
                    onClick={() => {
                      const updated = {
                        ...settings,
                        numeralSystem: 'roman' as const,
                        arabicNumerals: false
                      };
                      setSettings(updated);
                      saveTVSettings(updated);
                    }}
                    className={`py-2 px-2.5 rounded-xl text-xs font-bold transition-all text-center ${
                      settings.numeralSystem === 'roman'
                        ? 'bg-gradient-to-r from-purple-600 to-pink-500 text-white font-black shadow-md'
                        : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                    }`}
                  >
                    🏛️ Roman (I, II, III)
                  </button>
                </div>
              </div>

              {/* Font Color Cycling Controls & Speed Selector */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-xs font-bold text-slate-300 uppercase">Color Theme Mode</label>
                  <span className="text-xs font-mono font-bold" style={{ color: activeFontTheme.previewColor }}>
                    Active: {activeFontTheme.name}
                  </span>
                </div>

                <div className="grid grid-cols-5 gap-2 mb-3">
                  {FONT_THEMES.map((theme, idx) => (
                    <button
                      key={theme.id}
                      onClick={() => setFontThemeIndex(idx)}
                      className={`p-2 rounded-xl border text-center transition-all ${fontThemeIndex % FONT_THEMES.length === idx
                          ? 'border-white scale-105 shadow-lg bg-slate-800'
                          : 'border-slate-800 bg-slate-900/60 hover:border-slate-600'
                        }`}
                    >
                      <div className="w-5 h-5 rounded-full mx-auto mb-1 border border-white/20" style={{ backgroundColor: theme.previewColor }} />
                      <div className="text-[10px] font-bold text-slate-300 truncate">{theme.name}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-2">
                <Link
                  href="/admin"
                  className="flex-1 py-3 bg-gradient-to-r from-blue-600 to-sky-600 hover:from-blue-500 hover:to-sky-500 text-white font-black text-center rounded-xl text-xs uppercase shadow-lg shadow-blue-600/30 transition-all"
                >
                  Open Full Mosque Admin Console
                </Link>
                <button
                  onClick={() => setShowAdminMenu(false)}
                  className="px-5 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-xl text-xs uppercase transition-all"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};
