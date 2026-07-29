'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  resolvePrayerState,
  resolvePrayerTimesAsync,
  getTodayPrayerTimes,
  formatTo12Hour,
  PrayerTimes,
  PrayerState
} from '@/lib/prayer/prayerEngine';
import { getFormattedHijriDate } from '@/lib/prayer/hijriEngine';
import { AdhanModal } from './AdhanModal';
import { SplashScreen } from '@/components/ui/SplashScreen';
import { BackgroundMedia } from './BackgroundMedia';
import { SpecialPrayerBanner } from './SpecialPrayerBanner';
import {
  getTVSettings,
  subscribeToSettingsChange,
  TVSettings,
  DEFAULT_SETTINGS
} from '@/lib/settings/settingsManager';
import { fetchLiveWeather, WeatherData } from '@/lib/weather/weatherEngine';

export const TVDisplay: React.FC = () => {
  const [settings, setSettings] = useState<TVSettings>(DEFAULT_SETTINGS);
  const [showSplash, setShowSplash] = useState(true);
  const [mounted, setMounted] = useState(false);

  // Client-side mount indicator to prevent React SSR Hydration Mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  const [time, setTime] = useState<Date>(() => new Date());
  const [prayerTimes, setPrayerTimes] = useState<PrayerTimes>(() => getTodayPrayerTimes());
  const [prayerState, setPrayerState] = useState<PrayerState>(() => resolvePrayerState(getTodayPrayerTimes(), new Date()));
  const [hijriDateStr, setHijriDateStr] = useState<string>(() => getFormattedHijriDate(new Date()));

  const [dismissedAzan, setDismissedAzan] = useState(false);
  const [slideIndex, setSlideIndex] = useState(0);
  const [showAdminMenu, setShowAdminMenu] = useState(false);
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);

  // Initialize & Listen to Settings changes from /admin console
  useEffect(() => {
    const activeSettings = getTVSettings();
    setSettings(activeSettings);

    const unsubscribe = subscribeToSettingsChange(() => {
      setSettings(getTVSettings());
    });

    return () => unsubscribe();
  }, []);

  // Fetch Live Weather
  useEffect(() => {
    const updateWeather = async () => {
      const w = await fetchLiveWeather(
        settings.weather.latitude,
        settings.weather.longitude,
        settings.weather.city
      );
      setWeatherData(w);
    };

    updateWeather();
    const weatherTimer = setInterval(updateWeather, 15 * 60 * 1000); // 15 mins
    return () => clearInterval(weatherTimer);
  }, [settings.weather]);

  // Main Live Clock & Prayer Schedule Loop
  useEffect(() => {
    const updateSchedule = async () => {
      const current = new Date();
      const activeTimes = await resolvePrayerTimesAsync(current);

      const mergedTimes: PrayerTimes = {
        fajr: settings.customPrayerTimes?.fajr || activeTimes.fajr,
        sunrise: settings.customPrayerTimes?.sunrise || activeTimes.sunrise,
        dhuhr: settings.customPrayerTimes?.dhuhr || activeTimes.dhuhr,
        asr: settings.customPrayerTimes?.asr || activeTimes.asr,
        maghrib: settings.customPrayerTimes?.maghrib || activeTimes.maghrib,
        isha: settings.customPrayerTimes?.isha || activeTimes.isha,
      };

      setTime(current);
      setPrayerTimes(mergedTimes);
      setPrayerState(resolvePrayerState(mergedTimes, current));
      setHijriDateStr(getFormattedHijriDate(current));
    };

    updateSchedule();

    const timer = setInterval(updateSchedule, 1000);
    return () => clearInterval(timer);
  }, [settings.customPrayerTimes]);

  // Auto-rotating Islamic Content Slide Carousel
  const slidesList = settings.islamicContent && settings.islamicContent.length > 0
    ? settings.islamicContent
    : DEFAULT_SETTINGS.islamicContent;

  useEffect(() => {
    const slideTimer = setInterval(() => {
      setSlideIndex((prev) => (prev + 1) % slidesList.length);
    }, 10000);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '0' || e.key === 'i' || e.key === 'I') {
        setShowAdminMenu((prev) => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      clearInterval(slideTimer);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [slidesList.length]);

  const formatSeconds = (sec: number) => {
    const hrs = Math.floor(sec / 3600);
    const mins = Math.floor((sec % 3600) / 60);
    const secs = sec % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Helper to calculate Iqamah time string from Azan time & offset
  const computeIqamahTimeStr = (prayerKey: keyof typeof settings.iqamahOffsets, azanTime24: string) => {
    if (settings.customIqamahTimes?.[prayerKey]) {
      return {
        formatted: formatTo12Hour(settings.customIqamahTimes[prayerKey]!),
        offsetLabel: 'Custom'
      };
    }

    const offsetMins = settings.iqamahOffsets[prayerKey] ?? 15;
    if (!azanTime24 || azanTime24 === '-') return { formatted: '-', offsetLabel: '' };

    const [h, m] = azanTime24.split(':').map(Number);
    const totalMinutes = h * 60 + m + offsetMins;
    const finalH = Math.floor(totalMinutes / 60) % 24;
    const finalM = totalMinutes % 60;
    const finalTime24 = `${finalH.toString().padStart(2, '0')}:${finalM.toString().padStart(2, '0')}`;

    return {
      formatted: formatTo12Hour(finalTime24),
      offsetLabel: `+${offsetMins} MINS`
    };
  };

  const prayersList: { key: keyof PrayerTimes; label: string; azan24: string; iqamahKey?: keyof typeof settings.iqamahOffsets }[] = prayerTimes ? [
    { key: 'fajr', label: 'FAJR / SUBAH', azan24: prayerTimes.fajr, iqamahKey: 'fajr' },
    { key: 'sunrise', label: 'SUNRISE', azan24: prayerTimes.sunrise },
    { key: 'dhuhr', label: 'DHUHR / LUHAR', azan24: prayerTimes.dhuhr, iqamahKey: 'dhuhr' },
    { key: 'asr', label: 'ASR', azan24: prayerTimes.asr, iqamahKey: 'asr' },
    { key: 'maghrib', label: 'MAGHRIB', azan24: prayerTimes.maghrib, iqamahKey: 'maghrib' },
    { key: 'isha', label: 'ISHA', azan24: prayerTimes.isha, iqamahKey: 'isha' },
  ] : [];

  const currentSlide = slidesList[slideIndex] || slidesList[0];
  const announcementsStr = settings.announcements && settings.announcements.length > 0
    ? settings.announcements.join(' • ')
    : "📢 Welcome to BIN FAIZAL'S Mosque Smart TV • Please turn off or silence your mobile phones inside the prayer hall. • 🤲 May Allah accept all our prayers and ibadah • Contact Us +94 769383982";

  return (
    <>
      {showSplash && <SplashScreen onComplete={() => setShowSplash(false)} minDurationMs={1800} />}

      <div className="tv-container flex flex-col h-screen w-screen p-6 select-none overflow-hidden justify-between relative bg-[#020617] text-slate-100">
        {/* Dynamic Media Background System */}
        <BackgroundMedia settings={settings.background} />

        {/* Full Azan Audio & Visual Modal */}
        <AdhanModal
          prayerName={prayerState.nextPrayer}
          isOpen={prayerState.isAzanActive && !dismissedAzan}
          onClose={() => setDismissedAzan(true)}
          audioSettings={settings.azanAudio}
        />

        {/* Redesigned Luxury Header Bar */}
        <header className="glass-panel flex justify-between items-center px-8 py-3.5 rounded-2xl shrink-0 border border-amber-500/20 shadow-2xl relative z-10">
          {/* Mosque Brand & Title */}
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-400 via-amber-500 to-amber-600 flex items-center justify-center font-bold text-slate-950 text-3xl shadow-lg shadow-amber-500/40 border border-amber-300 shrink-0">
              🕌
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-black tracking-wider text-amber-400 uppercase drop-shadow-md">
                {settings.mosqueName}
              </h1>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-xs font-black tracking-widest text-emerald-400 uppercase bg-emerald-950/80 px-2.5 py-0.5 rounded-md border border-emerald-500/30">
                  {settings.displayName}
                </span>
                <span className="text-xs text-slate-300 font-bold uppercase tracking-wide">
                  • {settings.subtitle}
                </span>
              </div>
            </div>
          </div>

          {/* Live Weather Widget */}
          {weatherData && (
            <div className="flex items-center gap-3 bg-slate-900/80 border border-amber-500/20 px-5 py-2.5 rounded-xl backdrop-blur-md">
              <span className="text-3xl">{weatherData.icon}</span>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-base font-black text-white">{weatherData.tempC}°C</span>
                  <span className="text-xs font-bold text-amber-400">{weatherData.condition}</span>
                </div>
                <div className="text-[10px] text-slate-400 flex items-center gap-2.5 font-medium">
                  <span>💧 {weatherData.humidity}%</span>
                  <span>💨 {weatherData.windSpeedKmH} km/h</span>
                  <span>🌅 {weatherData.sunrise}</span>
                </div>
              </div>
            </div>
          )}

          {/* Live Clock & Dates with Hydration Safety */}
          <div className="text-right flex items-center gap-6">
            <div className="text-4xl md:text-5xl font-black font-mono tracking-tight text-white drop-shadow-lg">
              {mounted
                ? time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true })
                : '--:--:-- AM'}
            </div>
            <div className="h-10 w-px bg-slate-700/60" />
            <div className="text-right">
              <div className="text-xs md:text-sm font-bold text-slate-200 uppercase tracking-wide">
                {mounted
                  ? time.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })
                  : '---'}
              </div>
              <div className="text-sm md:text-base font-arabic font-bold text-amber-300 mt-0.5">
                {mounted ? hijriDateStr : '---'}
              </div>
            </div>
          </div>
        </header>

        {/* Main Grid Area */}
        <main className="flex-1 flex flex-col justify-between my-3 overflow-hidden relative z-10">
          {/* Special Prayer Scheduler Banner */}
          <SpecialPrayerBanner specialPrayers={settings.specialPrayers} />

          <div className="grid grid-cols-12 gap-5 flex-1 items-stretch overflow-hidden">
            {/* Left Side: 6 Daily Prayer Cards with Azan & Iqamah */}
            <div className="col-span-8 grid grid-cols-3 grid-rows-2 gap-4 h-full">
              {prayersList.map((item) => {
                const isActive = prayerState.nextPrayer === item.key;
                const iqamahInfo = item.iqamahKey
                  ? computeIqamahTimeStr(item.iqamahKey, item.azan24)
                  : null;

                return (
                  <div
                    key={item.key}
                    className={`flex flex-col justify-between p-5 rounded-2xl transition-all duration-300 ${
                      isActive ? 'glass-card-active pulse-gold border-2 border-amber-400' : 'glass-card-inactive'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <span className={`text-sm font-black tracking-widest uppercase ${isActive ? 'text-amber-300' : 'text-emerald-300/80'}`}>
                        {item.label}
                      </span>
                      {isActive && (
                        <span className="px-3 py-0.5 bg-amber-400 text-slate-950 text-[10px] font-black tracking-widest rounded-full uppercase shadow-md shadow-amber-400/40">
                          NEXT
                        </span>
                      )}
                    </div>

                    {/* Azan Time */}
                    <div>
                      <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block mb-0.5">AZAN</span>
                      <div className={`text-3xl lg:text-4xl font-black font-mono tracking-tight ${isActive ? 'text-amber-400 drop-shadow-xl' : 'text-white'}`}>
                        {formatTo12Hour(item.azan24)}
                      </div>
                    </div>

                    {/* Iqamah Time Display */}
                    <div className="flex justify-between items-center text-xs font-semibold border-t border-white/10 pt-2.5">
                      <span className="text-slate-400 font-bold text-[11px]">IQAMATH</span>
                      {iqamahInfo ? (
                        <div className="text-right">
                          <span className="text-amber-300 font-mono font-bold text-sm block">
                            {iqamahInfo.formatted}
                          </span>
                          {iqamahInfo.offsetLabel && (
                            <span className="text-[9px] text-emerald-400 font-mono block">
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
              {/* Countdown Hero Box with Progress Bar */}
              <div className="glass-card-hero p-6 rounded-2xl flex flex-col items-center justify-center text-center flex-1 relative overflow-hidden border border-amber-400/40 shadow-2xl">
                <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-teal-400 via-amber-400 to-emerald-400 animate-pulse" />
                <span className="text-xs font-black tracking-widest uppercase text-amber-300 bg-amber-950/90 px-4 py-1.5 rounded-full border border-amber-400/40 mb-2 shadow-md">
                  COUNTDOWN TO {prayerState.nextPrayer.toUpperCase()}
                </span>

                <div className="text-5xl lg:text-6xl font-black font-mono text-amber-400 tracking-tight my-2 drop-shadow-2xl">
                  {formatSeconds(prayerState.timeRemainingSeconds)}
                </div>

                {/* Animated Progress Bar */}
                <div className="w-full bg-slate-900/80 rounded-full h-2.5 my-3 overflow-hidden border border-white/10 p-0.5">
                  <div
                    className="bg-gradient-to-r from-amber-500 via-emerald-400 to-amber-300 h-full rounded-full transition-all duration-1000 shadow-md"
                    style={{
                      width: `${Math.min(100, Math.max(5, ((86400 - prayerState.timeRemainingSeconds) / 86400) * 100))}%`
                    }}
                  />
                </div>

                <p className="text-xs text-amber-100/90 font-medium">
                  Congregational Solat Iqamah follows Azan call.
                </p>
              </div>

              {/* Auto-Rotating Slide Carousel */}
              <div className="glass-panel p-5 rounded-2xl flex flex-col justify-between flex-1 border border-slate-700/60 shadow-xl transition-all duration-500">
                <div className="flex justify-between items-center text-amber-400 text-xs font-extrabold tracking-widest uppercase mb-1">
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

                <div className="text-xs text-amber-300/90 font-bold mt-2 border-t border-white/10 pt-2">
                  {currentSlide.reference}
                </div>
              </div>
            </div>
          </div>
        </main>

        {/* Bottom Announcement Ticker */}
        <footer className="glass-panel px-6 py-2.5 rounded-2xl flex items-center shrink-0 border border-slate-800 relative z-10 shadow-2xl">
          <div className="px-3.5 py-1 bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-base font-black rounded-xl mr-5 shrink-0 shadow-md flex items-center gap-2">
            <span>📢</span>
            <span className="text-xs uppercase tracking-widest font-black hidden sm:inline">ANNOUNCEMENTS</span>
          </div>
          <div className="overflow-hidden relative w-full">
            <div className="animate-ticker text-slate-200 font-semibold text-base tracking-wide">
              {announcementsStr}
            </div>
          </div>
        </footer>

        {/* Secret TV Remote Admin Modal Overlay (Triggered by '0' Key) */}
        {showAdminMenu && (
          <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-6">
            <div className="glass-panel p-8 rounded-3xl max-w-lg w-full border border-amber-500/40 text-center shadow-2xl">
              <h3 className="text-2xl font-black text-amber-400 uppercase mb-1">BIN FAIZAL&apos;S SMART TV</h3>
              <p className="text-xs text-slate-300 mb-6">Press &apos;0&apos; on TV Remote or Back to close menu</p>
              <div className="flex flex-col gap-3">
                <Link
                  href="/admin"
                  className="py-3 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-sm transition-colors shadow-lg shadow-emerald-600/30"
                >
                  Open Mosque Admin Portal
                </Link>
                <button
                  onClick={() => window.location.reload()}
                  className="py-3 px-4 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 font-bold rounded-xl text-sm transition-colors"
                >
                  Force Reload TV Kiosk
                </button>
                <button
                  onClick={() => setShowAdminMenu(false)}
                  className="py-2 text-xs text-slate-400 hover:text-white"
                >
                  Close Menu
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};
