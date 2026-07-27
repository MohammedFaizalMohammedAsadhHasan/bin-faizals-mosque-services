/**
 * Core Unified Prayer Calculation & State Resolver Engine
 * 3-Tier Resolution System: IndexedDB -> Static CSV -> Astronomical Calculation Fallback
 * BIN FAIZAL'S Mosque Services
 */

import { getScheduleForDate } from './annualScheduleData';
import { calculateAstronomicalPrayerTimes } from './astronomicalEngine';
import { getTimetableForDate } from '@/lib/offline/db';

export interface PrayerTimes {
  fajr: string;
  sunrise: string;
  dhuhr: string;
  asr: string;
  maghrib: string;
  isha: string;
}

export interface PrayerState {
  currentPrayer: keyof PrayerTimes;
  nextPrayer: keyof PrayerTimes;
  timeRemainingSeconds: number;
  isAzanActive: boolean;
  isIqamahActive: boolean;
}

/**
 * Converts 24-hour time string (HH:mm) to 12-hour format (hh:mm AM/PM)
 */
export function formatTo12Hour(timeStr: string, includeAmPm: boolean = true): string {
  if (!timeStr || timeStr === '-') return timeStr;
  const parts = timeStr.split(':');
  if (parts.length < 2) return timeStr;

  let h = parseInt(parts[0], 10);
  const m = parts[1];
  if (isNaN(h)) return timeStr;

  const ampm = h >= 12 ? 'PM' : 'AM';
  h = h % 12;
  if (h === 0) h = 12;

  const formattedH = h.toString().padStart(2, '0');
  return includeAmPm ? `${formattedH}:${m} ${ampm}` : `${formattedH}:${m}`;
}

/**
 * Calculates time remaining in seconds until target time HH:mm
 */
export function getSecondsUntil(targetTimeStr: string, now: Date = new Date()): number {
  const [hours, minutes] = targetTimeStr.split(':').map(Number);
  const target = new Date(now);
  target.setHours(hours, minutes, 0, 0);

  let diffMs = target.getTime() - now.getTime();
  if (diffMs < 0) {
    // If target time has passed today, calculate for tomorrow
    target.setDate(target.getDate() + 1);
    diffMs = target.getTime() - now.getTime();
  }

  return Math.floor(diffMs / 1000);
}

/**
 * Sync synchronous prayer time lookup (Static Schedule)
 */
export function getTodayPrayerTimes(now: Date = new Date()): PrayerTimes {
  return getScheduleForDate(now);
}

/**
 * Async 3-Tier Prayer Schedule Resolution Engine:
 * 1. IndexedDB uploaded CSV timetable
 * 2. Static annual timetable dataset
 * 3. Astronomical math calculation engine
 */
export async function resolvePrayerTimesAsync(now: Date = new Date()): Promise<PrayerTimes> {
  const year = now.getFullYear();
  const month = (now.getMonth() + 1).toString().padStart(2, '0');
  const day = now.getDate().toString().padStart(2, '0');
  const dateKey = `${year}-${month}-${day}`;

  try {
    // Tier 1: Check IndexedDB Offline Cache
    const cached = await getTimetableForDate(dateKey);
    if (cached && cached.fajr && cached.dhuhr) {
      return {
        fajr: cached.fajr,
        sunrise: cached.sunrise,
        dhuhr: cached.dhuhr,
        asr: cached.asr,
        maghrib: cached.maghrib,
        isha: cached.isha,
      };
    }
  } catch {
    // IndexedDB unavailable, proceed to Tier 2
  }

  // Tier 2: Static Timetable
  const staticTimes = getScheduleForDate(now);
  if (staticTimes && staticTimes.fajr) {
    return staticTimes;
  }

  // Tier 3: Astronomical Calculation Fallback
  return calculateAstronomicalPrayerTimes(now);
}

/**
 * Resolves current and next prayer from daily prayer times schedule
 */
export function resolvePrayerState(times?: PrayerTimes, now: Date = new Date()): PrayerState {
  const activeTimes = times || getTodayPrayerTimes(now);

  const timeToMinutes = (timeStr: string) => {
    const [h, m] = timeStr.split(':').map(Number);
    return h * 60 + m;
  };

  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  const schedule: { name: keyof PrayerTimes; minutes: number; timeStr: string }[] = [
    { name: 'fajr', minutes: timeToMinutes(activeTimes.fajr), timeStr: activeTimes.fajr },
    { name: 'sunrise', minutes: timeToMinutes(activeTimes.sunrise), timeStr: activeTimes.sunrise },
    { name: 'dhuhr', minutes: timeToMinutes(activeTimes.dhuhr), timeStr: activeTimes.dhuhr },
    { name: 'asr', minutes: timeToMinutes(activeTimes.asr), timeStr: activeTimes.asr },
    { name: 'maghrib', minutes: timeToMinutes(activeTimes.maghrib), timeStr: activeTimes.maghrib },
    { name: 'isha', minutes: timeToMinutes(activeTimes.isha), timeStr: activeTimes.isha },
  ];

  let currentPrayer: keyof PrayerTimes = 'isha';
  let nextPrayer: keyof PrayerTimes = 'fajr';
  let nextPrayerTimeStr = activeTimes.fajr;

  for (let i = 0; i < schedule.length; i++) {
    if (currentMinutes < schedule[i].minutes) {
      nextPrayer = schedule[i].name;
      nextPrayerTimeStr = schedule[i].timeStr;
      currentPrayer = i === 0 ? 'isha' : schedule[i - 1].name;
      break;
    }
  }

  const secondsRemaining = getSecondsUntil(nextPrayerTimeStr, now);

  return {
    currentPrayer,
    nextPrayer,
    timeRemainingSeconds: secondsRemaining,
    isAzanActive: secondsRemaining >= 0 && secondsRemaining <= 180, // 3-minute Azan window
    isIqamahActive: false,
  };
}
