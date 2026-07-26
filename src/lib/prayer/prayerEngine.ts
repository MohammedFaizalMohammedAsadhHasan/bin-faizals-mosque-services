/**
 * Core Prayer Calculation & State Resolver Engine
 * BIN FAIZAL'S Mosque Services
 */

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
 * Resolves current and next prayer from daily prayer times schedule
 */
export function resolvePrayerState(times: PrayerTimes, now: Date = new Date()): PrayerState {
  const timeToMinutes = (timeStr: string) => {
    const [h, m] = timeStr.split(':').map(Number);
    return h * 60 + m;
  };

  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  const schedule: { name: keyof PrayerTimes; minutes: number; timeStr: string }[] = [
    { name: 'fajr', minutes: timeToMinutes(times.fajr), timeStr: times.fajr },
    { name: 'sunrise', minutes: timeToMinutes(times.sunrise), timeStr: times.sunrise },
    { name: 'dhuhr', minutes: timeToMinutes(times.dhuhr), timeStr: times.dhuhr },
    { name: 'asr', minutes: timeToMinutes(times.asr), timeStr: times.asr },
    { name: 'maghrib', minutes: timeToMinutes(times.maghrib), timeStr: times.maghrib },
    { name: 'isha', minutes: timeToMinutes(times.isha), timeStr: times.isha },
  ];

  let currentPrayer: keyof PrayerTimes = 'isha';
  let nextPrayer: keyof PrayerTimes = 'fajr';
  let nextPrayerTimeStr = times.fajr;

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
