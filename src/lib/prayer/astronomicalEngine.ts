/**
 * Mathematical Astronomical Prayer Time Calculation Engine
 * Muslim World League (MWL) & Standard Solar Calculation Method
 * BIN FAIZAL'S Mosque Services
 */

import { PrayerTimes } from './prayerEngine';

export interface LocationCoords {
  latitude: number;
  longitude: number;
  timeZoneOffsetHours?: number;
}

// Helper degree-trigonometric functions
const d2r = (d: number) => (d * Math.PI) / 180.0;
const r2d = (r: number) => (r * 180.0) / Math.PI;
const dSin = (d: number) => Math.sin(d2r(d));
const dCos = (d: number) => Math.cos(d2r(d));
const dTan = (d: number) => Math.tan(d2r(d));
const dArcSin = (x: number) => r2d(Math.asin(x));
const dArcCos = (x: number) => r2d(Math.acos(x));
const dArcCot = (x: number) => r2d(Math.atan(1.0 / x));

/**
 * Calculates Julian Date from Gregorian Date
 */
function getJulianDate(date: Date): number {
  let year = date.getFullYear();
  let month = date.getMonth() + 1;
  const day = date.getDate();

  if (month <= 2) {
    year -= 1;
    month += 12;
  }

  const A = Math.floor(year / 100);
  const B = 2 - A + Math.floor(A / 4);

  return (
    Math.floor(365.25 * (year + 4716)) +
    Math.floor(30.6001 * (month + 1)) +
    day +
    B -
    1524.5
  );
}

/**
 * Computes Solar Declination & Equation of Time
 */
function getSunPosition(jd: number) {
  const D = jd - 2451545.0;
  const g = 357.529 + 0.98560028 * D; // Mean anomaly
  const q = 280.459 + 0.98564736 * D; // Mean longitude
  const L = q + 1.915 * dSin(g) + 0.02 * dSin(2 * g); // Ecliptic longitude

  const e = 23.439 - 0.00000036 * D; // Obliquity of ecliptic
  const RA = r2d(Math.atan2(dCos(e) * dSin(L), dCos(L))) / 15.0;

  const declination = dArcSin(dSin(e) * dSin(L));
  const equationOfTime = q / 15.0 - (RA < 0 ? RA + 24 : RA);

  return { declination, equationOfTime };
}

/**
 * Format decimal hours to HH:mm (24-hour string)
 */
function formatDecimalHours(hours: number): string {
  if (isNaN(hours)) return '00:00';
  let h = Math.floor(hours);
  let m = Math.floor((hours - h) * 60);

  if (m >= 60) {
    h += 1;
    m -= 60;
  }
  h = (h + 24) % 24;

  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
}

/**
 * Computes exact daily prayer times mathematically using latitude and longitude
 */
export function calculateAstronomicalPrayerTimes(
  date: Date = new Date(),
  coords: LocationCoords = { latitude: 6.9271, longitude: 79.8612 } // Default Mosque Coords
): PrayerTimes {
  const { latitude, longitude } = coords;
  const timeZoneOffset = -(date.getTimezoneOffset() / 60);

  const jd = getJulianDate(date);
  const { declination, equationOfTime } = getSunPosition(jd);

  // Solar Noon (Dhuhr)
  const dhuhrTime = 12 + timeZoneOffset - longitude / 15.0 - equationOfTime;

  // Helper for Sun Angle Time Difference
  const computeAngleTime = (angle: number, direction: 'am' | 'pm') => {
    const cosH =
      (-dSin(angle) - dSin(latitude) * dSin(declination)) /
      (dCos(latitude) * dCos(declination));

    if (cosH > 1 || cosH < -1) return dhuhrTime; // Polar regions edge case

    const timeDiff = dArcCos(cosH) / 15.0;
    return direction === 'am' ? dhuhrTime - timeDiff : dhuhrTime + timeDiff;
  };

  // Asr Time Calculation (Standard Shafi'i/Hanbali/Maliki: shadow ratio = 1)
  const asrAngle = dArcCot(1 + dTan(Math.abs(latitude - declination)));
  const asrTime = dhuhrTime + dArcCos((dSin(asrAngle) - dSin(latitude) * dSin(declination)) / (dCos(latitude) * dCos(declination))) / 15.0;

  // MWL Angles: Fajr 18°, Isha 18°
  const fajrTime = computeAngleTime(18, 'am');
  const sunriseTime = computeAngleTime(0.833, 'am');
  const maghribTime = computeAngleTime(0.833, 'pm');
  const ishaTime = computeAngleTime(18, 'pm');

  return {
    fajr: formatDecimalHours(fajrTime),
    sunrise: formatDecimalHours(sunriseTime),
    dhuhr: formatDecimalHours(dhuhrTime + 0.033), // Add 2 min safety margin for Dhuhr
    asr: formatDecimalHours(asrTime),
    maghrib: formatDecimalHours(maghribTime + 0.033), // Add 2 min safety margin for Maghrib
    isha: formatDecimalHours(ishaTime),
  };
}
