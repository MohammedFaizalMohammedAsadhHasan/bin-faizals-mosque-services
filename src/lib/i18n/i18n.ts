'use client';

export type LanguageCode = 'en' | 'ar' | 'ta' | 'si' | 'EN' | 'AR' | 'TA' | 'SI';
export type CanonicalLanguageCode = 'en' | 'ar' | 'ta' | 'si';

export interface LanguageOption {
  code: LanguageCode;
  label: string;
  flag: string;
}

export const LANGUAGES: LanguageOption[] = [
  { code: 'EN', label: 'English', flag: 'En' },
  { code: 'AR', label: 'العربية', flag: 'Ar' },
  { code: 'TA', label: 'தமிழ்', flag: 'Ta' },
  { code: 'SI', label: 'සිංහල', flag: 'Si' },
];

export const DAYS_OF_WEEK: Record<CanonicalLanguageCode, string[]> = {
  en: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
  ar: ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'],
  ta: ['ஞாயிறு', 'திங்கள்', 'செவ்வாய்', 'புதன்', 'வியாழன்', 'வெள்ளி', 'சனி'],
  si: ['ඉරිදා', 'සඳුදා', 'අඟහරුවාදා', 'බදාදා', 'බ්‍රහස්පතින්දා', 'සිකුරාදා', 'සෙනසුරාදා'],
};

export const GREGORIAN_MONTHS: Record<CanonicalLanguageCode, string[]> = {
  en: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
  ar: ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'],
  ta: ['ஜனவரி', 'பிப்ரவரி', 'மார்ச்', 'ஏப்ரல்', 'மே', 'ஜூன்', 'ஜூலை', 'ஆகஸ்டு', 'செப்டம்பர்', 'அக்டோபர்', 'நவம்பர்', 'டிசம்பர்'],
  si: ['ජනවාරි', 'පෙබරවාරි', 'මාර්තු', 'අප්‍රේල්', 'මැයි', 'ජූනි', 'ජූලි', 'අගෝස්තු', 'සැප්තැම්බර්', 'ඔක්තෝබර්', 'නොවැම්බර්', 'දෙසැම්බර්'],
};

export const HIJRI_MONTHS: Record<CanonicalLanguageCode, string[]> = {
  en: ['Muharram', 'Safar', "Rabi' al-Awwal", "Rabi' al-Thani", 'Jumada al-Awwal', 'Jumada al-Thani', 'Rajab', "Sha'ban", 'Ramadan', 'Shawwal', "Dhu al-Qi'dah", 'Dhu al-Hijjah'],
  ar: ['مُحَرَّم', 'صَفَر', 'رَبِيع الأَوَّل', 'رَبِيع الآخِر', 'جُمَادَى الأُولَى', 'جُمَادَى الآخِرَة', 'رَجَب', 'شَعْبَان', 'رَمَضَان', 'شَوَّال', 'ذُو القَعْدَة', 'ذُو الحِجَّة'],
  ta: ['முஹர்ரம்', 'சஃபர்', 'ரபி உல் அவ்வல்', 'ரபி உல் ஆகிர்', 'ஜமா அத்துல் அவ்வல்', 'ஜமா அத்துல் ஆகிர்', 'ரஜப்', 'ஷஃபான்', 'ரமழான்', 'ஷவ்வால்', 'துல் கஃதா', 'துல் ஹிஜ்ஜா'],
  si: ['මුහර්රම්', 'සෆර්', 'රබීඋල් අව්වල්', 'රබීඋල් ආඛිර්', 'ජමාදුල් අව්වල්', 'ජමාදුල් ආඛිර්', 'රජබ්', 'ශඅබාන්', 'රමළාන්', 'ශව්වාල්', 'දුල් කඃදා', 'දුල් හිජ්ජා'],
};

export const TRANSLATIONS: Record<CanonicalLanguageCode, Record<string, string>> = {
  en: {
    fajr: "Subah / Fajr",
    sunrise: "Sunrise",
    dhuhr: "Luhar / Dhuhr",
    asr: "Asr",
    maghrib: "Magrib / Maghrib",
    isha: "Isha",
    next: "Next",
    now: "Now",
    azan: "Azan",
    iqamah: "Iqamath",
    countdownTo: "Countdown to",
    passedIqamah: "Prayer in Progress",
    contact: "Contact Us",
    announcements: "Mosque Announcements",
    khutbah: "Khutbah / Start",
    taraweeh: "Tarawih Prayer",
    jummah: "Jumu'ah Prayer",
    eidFitr: "Eid-ul-Fitr Prayer",
    eidAdha: "Eid-ul-Adha Prayer",
    iqamahNotice: "Congregational Solat Iqamah follows Azan call.",
    mosqueServices: "Mosque Services",
    smartTV: "BIN FAIZAL'S SMART TV",
    language: "Language",
    silentPhoneAlert: "PLEASE SILENCE OR SWITCH OFF MOBILE PHONES",
    silentPhoneSub: "Maintain quietness and khushu inside the prayer hall.",
    todaySchedule: "Today's Official Timetable",
    qiblaCompass: "Qibla Direction Compass",
    adminPortal: "Mosque Admin Portal",
    launchTV: "Launch Smart TV Display",
    numeralFormat: "Numbers Format",
    arabicNumbers: "Arabic Numerals (٠١٢٣٤)",
    defaultNumbers: "Default Numerals (01234)",
  },
  ar: {
    fajr: "صَلَاةُ الفَجْر",
    sunrise: "شُرُوق الشَّمْس",
    dhuhr: "صَلَاةُ الظُّهْر",
    asr: "صَلَاةُ العَصْر",
    maghrib: "صَلَاةُ المَغْرِب",
    isha: "صَلَاةُ العِشَاء",
    next: "التالي",
    now: "الآن",
    azan: "الأذان",
    iqamah: "الإقامة",
    countdownTo: "العد التنازلي لـ",
    passedIqamah: "تقام الصلاة الآن",
    contact: "اتصل بنا",
    announcements: "إعلانات المسجد",
    khutbah: "الخطبة / البداية",
    taraweeh: "صلاة التراويح",
    jummah: "صلاة الجمعة",
    eidFitr: "صَلَاةُ عِيدِ الفِطْر",
    eidAdha: "صَلَاةُ عِيدِ الأَضْحَى",
    iqamahNotice: "تقام الصلاة بعد الأذان بحسب وقت الإقامة.",
    mosqueServices: "خدمات المسجد",
    smartTV: "تلفزيون بن فيصل الذكي",
    language: "اللغة",
    silentPhoneAlert: "يرجى إغلاق الهواتف النقالة أو جعلها صامتة",
    silentPhoneSub: "احرصوا على السكينة والخشوع داخل بيت الله.",
    todaySchedule: "جدول مواقيت الصلاة لليوم",
    qiblaCompass: "بوصلة اتجاه القبلة",
    adminPortal: "لوحة تحكم المسجد",
    launchTV: "تشغيل شاشة التلفاز",
    numeralFormat: "صيغة الأرقام",
    arabicNumbers: "الأرقام الشرقية (٠١٢٣٤)",
    defaultNumbers: "الأرقام الافتراضية (01234)",
  },
  ta: {
    fajr: "சுபஹ் / ஃபஜ்ர்",
    sunrise: "சூரிய உதயம்",
    dhuhr: "ளுஹர்",
    asr: "அஸர்",
    maghrib: "மஃரிப்",
    isha: "இஷா",
    next: "அடுத்து",
    now: "இப்போது",
    azan: "பாங்கு / அதான்",
    iqamah: "இகாமத்",
    countdownTo: "அடுத்த தொழுகைக்கு",
    passedIqamah: "தொழுகை நடைபெறுகிறது",
    contact: "தொடர்புக்கு",
    announcements: "பள்ளிவாசல் அறிவிப்புகள்",
    khutbah: "குத்பா / ஆரம்பம்",
    taraweeh: "தராவீஹ் தொழுகை",
    jummah: "ஜும்ஆ தொழுகை",
    eidFitr: "ஈதுல் ஃபித்ர் தொழுகை",
    eidAdha: "ஈதுல் அத்ஹா தொழுகை",
    iqamahNotice: "பாங்கு சொல்லப்பட்ட பின் இகாமத் தொழுகை ஆரம்பமாகும்.",
    mosqueServices: "பள்ளிவாசல் சேவைகள்",
    smartTV: "பின் பைசல் ஸ்மார்ட் டிவி",
    language: "மொழி",
    silentPhoneAlert: "தயவுசெய்து கைத்தொலைபேசிகளை அணைக்கவும் / சைலன்ட் செய்யவும்",
    silentPhoneSub: "தொழுகை மண்டபத்திற்குள் நிம்மதியையும் அமைதியையும் பேணுங்கள்.",
    todaySchedule: "இன்றைய தொழுகை நேர அட்டவணை",
    qiblaCompass: "கிப்லா திசை காட்டி",
    adminPortal: "நிர்வாகக் குழு கட்டுப்பாட்டு அறை",
    launchTV: "டிவி திரையைத் தொடங்கு",
    numeralFormat: "எண்கள் வடிவம்",
    arabicNumbers: "அரபு எண்கள் (٠١٢٣)",
    defaultNumbers: "இயல்பு எண்கள் (0123)",
  },
  si: {
    fajr: "සුබහ් / ෆජ්ර්",
    sunrise: "හිරු උදාව",
    dhuhr: "ලුහර් / ධුහර්",
    asr: "අසර්",
    maghrib: "මග්රිබ්",
    isha: "ඉෂා",
    next: "ඊළඟ",
    now: "දැන්",
    azan: "අදාන්",
    iqamah: "ඉකාමත්",
    countdownTo: "ඊළඟ සලාතයට ඉතිරි කාලය",
    passedIqamah: "නමාසය පැවැත්වේ",
    contact: "සම්බන්ධ කරගන්න",
    announcements: "පල්ලියේ නිවේදන",
    khutbah: "දේශනය / ආරම්භය",
    taraweeh: "තරාවීහ් නමාසය",
    jummah: "ජුමුආ නමාසය",
    eidFitr: "ඊදුල් ෆිත්ර් නමාසය",
    eidAdha: "ඊදුල් අදහ් නමාසය",
    iqamahNotice: "අසාන් ඇමතුමෙන් පසුව ජමාඅත් ඉකාමත් ආරම්භ වේ.",
    mosqueServices: "පල්ලියේ සේවාවන්",
    smartTV: "බින් ෆයිසාල් ස්මාර්ට් ටීවී",
    language: "භාෂාව",
    silentPhoneAlert: "කරුණාකර ඔබගේ ජංගම දුරකථන ක්‍රියා විරහිත කරන්න / සයිලන්ට් කරන්න",
    silentPhoneSub: "නමාස් ශාලාව තුළ සාමය සහ සංයමය පවත්වා ගන්න.",
    todaySchedule: "අද නිල සලාත් කාලසටහන",
    qiblaCompass: "කිබ්ලා දිශාව",
    adminPortal: "පරිපාලක පුවරුව",
    launchTV: "රූපවාහිනී සංදර්ශකය අරඹන්න",
    numeralFormat: "අංක ආකෘතිය",
    arabicNumbers: "අරාබි අංක (٠١٢٣)",
    defaultNumbers: "සාමාන්‍ය අංක (0123)",
  },
};

export function intToRoman(num: number): string {
  if (num <= 0) return '0';
  const lookup: [number, string][] = [
    [1000, 'M'], [900, 'CM'], [500, 'D'], [400, 'CD'],
    [100, 'C'], [90, 'XC'], [50, 'L'], [40, 'XL'],
    [10, 'X'], [9, 'IX'], [5, 'V'], [4, 'IV'], [1, 'I']
  ];
  let result = '';
  for (const [val, roman] of lookup) {
    while (num >= val) {
      result += roman;
      num -= val;
    }
  }
  return result;
}

export function toRomanNumerals(str: string | number): string {
  if (str === null || str === undefined) return '';
  const s = String(str);
  return s.replace(/\b(\d+)\b/g, (match) => {
    const val = parseInt(match, 10);
    if (isNaN(val)) return match;
    if (val === 0) return '0';
    return intToRoman(val);
  });
}

export function formatWithNumeralSystem(
  val: string | number,
  system?: 'western' | 'eastern_arabic' | 'roman',
  isArabicLang?: boolean,
  arabicNumeralsFlag?: boolean
): string {
  const str = String(val ?? '');
  if (system === 'roman') {
    return toRomanNumerals(str);
  }
  if (system === 'eastern_arabic' || (isArabicLang && Boolean(arabicNumeralsFlag))) {
    return toEasternArabicNumerals(str);
  }
  return str;
}

export function toEasternArabicNumerals(str: string | number): string {
  if (str === null || str === undefined) return '';
  const arabicDigits = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
  return String(str).replace(/[0-9]/g, (w) => arabicDigits[+w]);
}

export function getTranslation(lang: LanguageCode, key: string): string {
  const norm = (lang ? String(lang).toLowerCase() : 'en') as CanonicalLanguageCode;
  const dict = TRANSLATIONS[norm] || TRANSLATIONS.en;
  return dict[key] || TRANSLATIONS.en[key] || key;
}

/**
 * Returns localized Gregorian Date string (e.g., "Monday, 12 October 2026" in selected language)
 */
export function formatLocalizedDate(date: Date, lang: LanguageCode, numeralMode: 'western' | 'eastern_arabic' | 'roman' | boolean = false): string {
  const norm = (lang ? String(lang).toLowerCase() : 'en') as CanonicalLanguageCode;
  const dayName = DAYS_OF_WEEK[norm]?.[date.getDay()] ?? DAYS_OF_WEEK.en[date.getDay()];
  const monthName = GREGORIAN_MONTHS[norm]?.[date.getMonth()] ?? GREGORIAN_MONTHS.en[date.getMonth()];
  const dayNum = date.getDate();
  const yearNum = date.getFullYear();

  let formatted = '';
  if (norm === 'ar') {
    formatted = `${dayName}، ${dayNum} ${monthName} ${yearNum}`;
  } else if (norm === 'ta') {
    formatted = `${dayName}, ${dayNum} ${monthName} ${yearNum}`;
  } else if (norm === 'si') {
    formatted = `${dayName}, ${yearNum} ${monthName} ${dayNum}`;
  } else {
    formatted = `${dayName}, ${monthName} ${dayNum}, ${yearNum}`;
  }

  if (numeralMode === 'roman') {
    return toRomanNumerals(formatted);
  }
  if (numeralMode === 'eastern_arabic' || (norm === 'ar' && numeralMode === true)) {
    return toEasternArabicNumerals(formatted);
  }
  return formatted;
}

