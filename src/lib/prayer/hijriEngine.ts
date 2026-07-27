/**
 * Dynamic Hijri Calendar Calculation & Converter Engine
 * BIN FAIZAL'S Mosque Services
 */

export interface HijriDate {
  day: number;
  month: number;
  year: number;
  monthNameEn: string;
  monthNameAr: string;
}

const HIJRI_MONTHS_EN = [
  'Muharram',
  'Safar',
  "Rabi' al-Awwal",
  "Rabi' al-Thani",
  'Jumada al-Awwal',
  'Jumada al-Thani',
  'Rajab',
  "Sha'ban",
  'Ramadan',
  'Shawwal',
  "Dhu al-Qi'dah",
  'Dhu al-Hijjah',
];

const HIJRI_MONTHS_AR = [
  'مُحَرَّم',
  'صَفَر',
  'رَبِيع الأَوَّل',
  'رَبِيع الآخِر',
  'جُمَادَى الأُولَى',
  'جُمَادَى الآخِرَة',
  'رَجَب',
  'شَعْبَان',
  'رَمَضَان',
  'شَوَّال',
  'ذُو القَعْدَة',
  'ذُو الحِجَّة',
];

// Arabic digits converter
const toArabicDigits = (str: number | string): string => {
  const arabicNumbers = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
  return str.toString().replace(/[0-9]/g, (w) => arabicNumbers[parseInt(w, 10)]);
};

/**
 * Calculates Hijri Date from Gregorian Date with custom day offset (+2 to -2 days)
 */
export function getHijriDate(date: Date = new Date(), dayOffset: number = 0): HijriDate {
  const adjustedDate = new Date(date);
  adjustedDate.setDate(adjustedDate.getDate() + dayOffset);

  let day = adjustedDate.getDate();
  let month = adjustedDate.getMonth() + 1;
  let year = adjustedDate.getFullYear();

  if (month < 3) {
    year -= 1;
    month += 12;
  }

  const a = Math.floor(year / 100);
  const b = 2 - a + Math.floor(a / 4);
  const jd = Math.floor(365.25 * (year + 4716)) + Math.floor(30.6001 * (month + 1)) + day + b - 1524.5;

  // Ku-Calculated Tabular Hijri Algorithm
  const l = jd - 1948440 + 10632;
  const n = Math.floor((l - 1) / 10631);
  const l1 = l - 10631 * n + 354;
  const j = Math.floor((10985 - l1) / 5316) * Math.floor((50 * l1) / 17719) + Math.floor(l1 / 5670) * Math.floor((43 * l1) / 15238);
  const l2 = l1 - Math.floor((30 - j) / 15) * Math.floor((17719 * j) / 50) - Math.floor(j / 16) * Math.floor((15238 * j) / 43) + 29;

  const hijriMonth = Math.floor((24 * l2) / 709);
  const hijriDay = l2 - Math.floor((709 * hijriMonth) / 24);
  const hijriYear = 30 * n + j - 30;

  const monthIdx = Math.max(0, Math.min(11, hijriMonth - 1));

  return {
    day: hijriDay,
    month: hijriMonth,
    year: hijriYear,
    monthNameEn: HIJRI_MONTHS_EN[monthIdx],
    monthNameAr: HIJRI_MONTHS_AR[monthIdx],
  };
}

/**
 * Returns formatted Hijri Date string in Arabic typography (e.g. ١٢ صَفَر ١٤٤٨ هـ)
 */
export function getFormattedHijriDate(date: Date = new Date(), dayOffset: number = 0): string {
  const hijri = getHijriDate(date, dayOffset);
  const arDay = toArabicDigits(hijri.day);
  const arYear = toArabicDigits(hijri.year);
  return `${arDay} ${hijri.monthNameAr} ${arYear} هـ`;
}
