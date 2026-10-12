'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { QiblaCompass } from '@/components/pwa/QiblaCompass';
import { SplashScreen } from '@/components/ui/SplashScreen';
import { AmbientBubbles } from '@/components/ui/AmbientBubbles';
import { resolvePrayerTimesAsync, resolvePrayerState, formatTo12Hour, PrayerTimes, PrayerState } from '@/lib/prayer/prayerEngine';
import { getFormattedHijriDate } from '@/lib/prayer/hijriEngine';
import { getTVSettings, saveTVSettings, SRI_LANKA_ZONES } from '@/lib/settings/settingsManager';
import { LanguageCode, getTranslation, formatLocalizedDate, LANGUAGES } from '@/lib/i18n/i18n';

export default function PublicHomePage() {
  const [showSplash, setShowSplash] = useState(true);
  const [times, setTimes] = useState<PrayerTimes | null>(null);
  const [prayerState, setPrayerState] = useState<PrayerState | null>(null);
  const [hijriDateStr, setHijriDateStr] = useState('');
  const [mounted, setMounted] = useState(false);
  const [currentLang, setCurrentLang] = useState<LanguageCode>('en');
  const [time24Format, setTime24Format] = useState(false);
  const [zoneLabel, setZoneLabel] = useState('Zone 01');

  useEffect(() => {
    setMounted(true);
    const settings = getTVSettings();
    if (settings.language) {
      setCurrentLang(settings.language);
    }
    setTime24Format(settings.time24Format ?? false);
    const z = SRI_LANKA_ZONES.find((item) => item.id === settings.selectedZoneId);
    if (z) setZoneLabel(z.name);
  }, []);

  useEffect(() => {
    const initSchedule = async () => {
      const now = new Date();
      const todayTimes = await resolvePrayerTimesAsync(now);
      setTimes(todayTimes);
      setPrayerState(resolvePrayerState(todayTimes, now));
      setHijriDateStr(getFormattedHijriDate(now, 0, currentLang));
    };

    initSchedule();

    const timer = setInterval(async () => {
      const current = new Date();
      const activeTimes = await resolvePrayerTimesAsync(current);
      setTimes(activeTimes);
      setPrayerState(resolvePrayerState(activeTimes, current));
      setHijriDateStr(getFormattedHijriDate(current, 0, currentLang));
    }, 1000);

    return () => clearInterval(timer);
  }, [currentLang]);

  const handleLanguageSelect = (lang: LanguageCode) => {
    setCurrentLang(lang);
    const s = getTVSettings();
    s.language = lang;
    saveTVSettings(s);
  };

  const formatSeconds = (sec: number) => {
    const hrs = Math.floor(sec / 3600);
    const mins = Math.floor((sec % 3600) / 60);
    const secs = sec % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const formatPrayerTime = (timeStr?: string) => {
    if (!timeStr) return '-';
    if (time24Format) return timeStr;
    return formatTo12Hour(timeStr);
  };

  const getPrayerName = (prayerKey: string) => {
    return getTranslation(currentLang, prayerKey);
  };

  return (
    <>
      {showSplash && <SplashScreen onComplete={() => setShowSplash(false)} minDurationMs={1800} />}

      <div className="min-h-screen bg-[#020617] text-slate-100 relative overflow-x-hidden pb-24 md:pb-12">
        {/* Ambient Bubbles Particle Canvas */}
        <AmbientBubbles />

        <main className="relative z-10 p-4 sm:p-6 md:p-12 max-w-5xl mx-auto">
          {/* Header Bar */}
          <header className="glass-panel p-5 sm:p-6 rounded-3xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 border border-blue-500/30 shadow-2xl">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 via-sky-500 to-indigo-600 flex items-center justify-center font-bold text-white text-2xl shadow-lg shadow-blue-500/40 shrink-0">
                🕌
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-sky-200 via-sky-300 to-blue-200 tracking-wide uppercase drop-shadow">
                  BIN FAIZAL&apos;S
                </h1>
                <p className="text-xs text-sky-400 font-bold uppercase tracking-wider">
                  {getTranslation(currentLang, 'mosqueServices')} • {zoneLabel}
                </p>
              </div>
            </div>

            {/* Language Switcher & Quick Links */}
            <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-between md:justify-end">
              {/* 4-Language Switcher Pills */}
              <div className="flex items-center bg-slate-950/90 p-1 rounded-2xl border border-sky-400/30 shadow-inner">
                {LANGUAGES.map((item) => {
                  const isSelected = String(currentLang).toLowerCase() === String(item.code).toLowerCase();
                  return (
                    <button
                      key={item.code}
                      onClick={() => handleLanguageSelect(item.code)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-black tracking-wide transition-all ${
                        isSelected
                          ? 'bg-gradient-to-r from-blue-600 to-sky-500 text-white shadow-md shadow-blue-500/30 scale-105'
                          : 'text-slate-400 hover:text-sky-300'
                      }`}
                    >
                      {item.label}
                    </button>
                  );
                })}
              </div>

              <div className="hidden sm:flex gap-2">
                <Link
                  href="/tv"
                  className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-sky-600 hover:from-blue-500 hover:to-sky-500 text-white text-xs font-bold border border-sky-400/30 transition-all shadow-lg shadow-blue-600/30 flex items-center gap-2"
                >
                  <span>📺</span> {getTranslation(currentLang, 'launchTV')}
                </Link>
                <Link
                  href="/admin"
                  className="px-4 py-2.5 rounded-xl bg-blue-500/20 hover:bg-blue-500/30 text-sky-300 text-xs font-bold border border-blue-500/40 transition-all shadow-lg flex items-center gap-2"
                >
                  <span>🛠</span> {getTranslation(currentLang, 'adminPortal')}
                </Link>
              </div>
            </div>
          </header>

          {/* Hero Section */}
          {prayerState && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch mb-8">
              {/* Prayer Countdown Glass Card */}
              <div className="glass-card-hero p-8 rounded-3xl border border-sky-400/40 shadow-2xl flex flex-col justify-between">
                <div>
                  <span className="text-xs font-black text-sky-200 tracking-widest uppercase bg-blue-950/90 px-4 py-1.5 rounded-full border border-sky-400/40 inline-block mb-4">
                    {getTranslation(currentLang, 'next').toUpperCase()}: {getPrayerName(prayerState.nextPrayer).toUpperCase()}
                  </span>

                  <div className="text-5xl sm:text-6xl font-black text-sky-300 font-mono my-2 tracking-tight drop-shadow-2xl">
                    {formatSeconds(prayerState.timeRemainingSeconds)}
                  </div>
                  <p className="text-sky-100 text-sm font-medium">
                    {getTranslation(currentLang, 'iqamahNotice')}
                  </p>
                </div>

                <div className="mt-8 pt-6 border-t border-white/10 flex justify-between text-xs font-semibold">
                  <div>
                    <span className="text-sky-300/80 block uppercase">
                      {currentLang === 'ar' ? 'التاريخ الميلادي' : currentLang === 'ta' ? 'கிரிகோரியன் திகதி' : currentLang === 'si' ? 'ග්‍රෙගෝරියානු දින දර්ශනය' : 'Gregorian Date'}
                    </span>
                    <span className="font-bold text-white text-sm">
                      {mounted ? formatLocalizedDate(new Date(), currentLang) : '---'}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-sky-300/80 block uppercase">
                      {currentLang === 'ar' ? 'التاريخ الهجري' : currentLang === 'ta' ? 'ஹிஜ்ரி திகதி' : currentLang === 'si' ? 'හිජ්රි දින දර්ශනය' : 'Hijri Date'}
                    </span>
                    <span className="font-bold text-sky-300 font-arabic text-sm">{hijriDateStr || '---'}</span>
                  </div>
                </div>
              </div>

              {/* Qibla Compass Card */}
              <QiblaCompass />
            </div>
          )}

          {/* Today's Timetable List */}
          {times && prayerState && (
            <section className="glass-panel p-6 sm:p-8 rounded-3xl mb-8 border border-slate-800 shadow-2xl">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-6">
                <div>
                  <h3 className="text-lg sm:text-xl font-black text-slate-100 uppercase tracking-wide">
                    {getTranslation(currentLang, 'todaySchedule')}
                  </h3>
                  <p className="text-xs text-slate-400 font-semibold">
                    {time24Format ? '24-Hour Format' : '12-Hour Format'} • {zoneLabel}
                  </p>
                </div>
                <a
                  href="/sample-annual-timetable.csv"
                  download
                  className="px-3.5 py-1.5 rounded-lg bg-emerald-950 hover:bg-emerald-900 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase transition-colors"
                >
                  📥 CSV Timetable
                </a>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {[
                  { key: 'fajr', name: getTranslation(currentLang, 'fajr'), azan: times.fajr, iqamah: '+20 mins' },
                  { key: 'sunrise', name: getTranslation(currentLang, 'sunrise'), azan: times.sunrise, iqamah: '-' },
                  { key: 'dhuhr', name: getTranslation(currentLang, 'dhuhr'), azan: times.dhuhr, iqamah: '+15 mins' },
                  { key: 'asr', name: getTranslation(currentLang, 'asr'), azan: times.asr, iqamah: '+15 mins' },
                  { key: 'maghrib', name: getTranslation(currentLang, 'maghrib'), azan: times.maghrib, iqamah: '+10 mins' },
                  { key: 'isha', name: getTranslation(currentLang, 'isha'), azan: times.isha, iqamah: '+15 mins' },
                ].map((item) => {
                  const isActive = prayerState.nextPrayer.toLowerCase() === item.key.toLowerCase();
                  return (
                    <div
                      key={item.key}
                      className={`p-5 rounded-2xl border transition-all ${
                        isActive
                          ? 'glass-card-active pulse-royal'
                          : 'glass-card-inactive'
                      }`}
                    >
                      <div className={`text-xs font-black uppercase tracking-wider ${isActive ? 'text-sky-300' : 'text-slate-300'}`}>
                        {item.name}
                      </div>
                      <div className={`text-2xl sm:text-3xl font-black font-mono my-2 ${isActive ? 'text-sky-300 drop-shadow' : 'text-slate-100'}`}>
                        {formatPrayerTime(item.azan)}
                      </div>
                      <div className="text-xs text-slate-400 font-semibold border-t border-white/10 pt-2">
                        {getTranslation(currentLang, 'iqamah')}: {item.iqamah}
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {/* Announcements & Hadith */}
          <section className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-2xl">
            <h3 className="text-lg font-black text-sky-300 uppercase tracking-wide mb-4">
              📖 {getTranslation(currentLang, 'announcements')}
            </h3>
            <blockquote className="p-4 rounded-2xl bg-slate-900/80 border-l-4 border-sky-400 italic text-slate-200 text-sm leading-relaxed mb-4">
              {currentLang === 'ar' ? (
                <span>&ldquo;خَيْرُكُمْ مَنْ تَعَلَّمَ الْقُرْآنَ وَعَلَّمَهُ&rdquo;</span>
              ) : currentLang === 'ta' ? (
                <span>&ldquo;உங்களில் சிறந்தவர் யார் என்றால் குர்ஆனைக் கற்று அதனைப் பிறருக்குக் கற்பிப்பவரே ஆவார்.&rdquo;</span>
              ) : currentLang === 'si' ? (
                <span>&ldquo;ඔබ අතරින් වඩාත්ම උතුම් තැනැත්තා නම් කුර්ආනය ඉගෙන ගෙන එය අන් අයට උගන්වන්නාය.&rdquo;</span>
              ) : (
                <span>&ldquo;The best among you are those who learn the Qur&apos;an and teach it to others.&rdquo;</span>
              )}
              <footer className="text-xs text-sky-400 font-bold not-italic mt-2">
                — Sahih Al-Bukhari (5027)
              </footer>
            </blockquote>
          </section>
        </main>

        {/* Mobile Responsive Bottom Navigation Bar */}
        <nav className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#030712]/95 backdrop-blur-xl border-t border-slate-800 px-6 py-3 flex justify-between items-center text-xs font-bold shadow-2xl">
          <Link href="/" className="flex flex-col items-center gap-1 text-sky-400">
            <span className="text-lg">🕌</span>
            <span>{currentLang === 'ar' ? 'الرئيسية' : currentLang === 'ta' ? 'முகப்பு' : currentLang === 'si' ? 'මුල් පිටුව' : 'Home'}</span>
          </Link>
          <Link href="/tv" className="flex flex-col items-center gap-1 text-slate-400 hover:text-sky-400">
            <span className="text-lg">📺</span>
            <span>{currentLang === 'ar' ? 'الشاشة' : currentLang === 'ta' ? 'டிவி' : currentLang === 'si' ? 'රූපවාහිනිය' : 'TV View'}</span>
          </Link>
          <Link href="/admin" className="flex flex-col items-center gap-1 text-slate-400 hover:text-sky-400">
            <span className="text-lg">🛠</span>
            <span>{currentLang === 'ar' ? 'الإدارة' : currentLang === 'ta' ? 'நிர்வாகம்' : currentLang === 'si' ? 'පරිපාලක' : 'Admin'}</span>
          </Link>
        </nav>
      </div>
    </>
  );
}
