import { LanguageCode } from '@/lib/i18n/i18n';

export interface ContactInfo {
  phone: string;
  whatsapp: string;
  email: string;
  website: string;
  callText: string;
}

export interface IqamahOffsets {
  fajr: number;
  dhuhr: number;
  asr: number;
  maghrib: number;
  isha: number;
}

export interface CustomPrayerTimes {
  fajr?: string;
  sunrise?: string;
  dhuhr?: string;
  asr?: string;
  maghrib?: string;
  isha?: string;
}

export interface CustomIqamahTimes {
  fajr?: string;
  dhuhr?: string;
  asr?: string;
  maghrib?: string;
  isha?: string;
}

export interface AzanAudioSettings {
  enabled: boolean;
  volume: number;
  fajrAudio: string;
  dhuhrAudio: string;
  asrAudio: string;
  maghribAudio: string;
  ishaAudio: string;
  iqamahAudio?: string;
  azanAlertEnabled?: boolean;
  iqamahAlertEnabled?: boolean;
}

export interface WeatherSettings {
  city: string;
  autoDetect: boolean;
  latitude: number;
  longitude: number;
}

export interface BackgroundSettings {
  type: 'slideshow' | 'video' | 'single';
  slides: string[];
  videoUrl: string;
  slideIntervalSeconds: number;
  blurPx: number;
  overlayOpacity: number;
}

export interface SpecialPrayerItem {
  enabled: boolean;
  title: string;
  khutbahTime: string;
  prayerTime: string;
  iqamahTime: string;
  notes: string;
}

export interface SpecialPrayerSchedule {
  jummah: SpecialPrayerItem;
  taraweeh: SpecialPrayerItem;
  eidFitr: SpecialPrayerItem;
  eidAdha: SpecialPrayerItem;
}

export interface IslamicSlide {
  id: string;
  type: string;
  icon: string;
  content: string;
  reference: string;
}

export interface SriLankaZone {
  id: string;
  name: string;
  label: string;
  districts: string;
  adjustmentMinutes: {
    fajr: number;
    sunrise: number;
    dhuhr: number;
    asr: number;
    maghrib: number;
    isha: number;
  };
}

export const SRI_LANKA_ZONES: SriLankaZone[] = [
  { id: 'ZONE1', name: 'Zone 01', label: 'Zone 01: Colombo, Gampaha & Kalutara District', districts: 'Colombo, Gampaha, Kalutara', adjustmentMinutes: { fajr: 0, sunrise: 0, dhuhr: 0, asr: 0, maghrib: 0, isha: 0 } },
  { id: 'ZONE2', name: 'Zone 02', label: 'Zone 02: Jaffna & Nallur', districts: 'Jaffna, Nallur', adjustmentMinutes: { fajr: 2, sunrise: 1, dhuhr: 0, asr: 1, maghrib: 0, isha: 0 } },
  { id: 'ZONE3', name: 'Zone 03', label: 'Zone 03: Mullaitivu, Kilinochchi & Vavuniya District', districts: 'Mullaitivu, Kilinochchi, Vavuniya', adjustmentMinutes: { fajr: 1, sunrise: 0, dhuhr: -1, asr: 0, maghrib: -1, isha: -1 } },
  { id: 'ZONE4', name: 'Zone 04', label: 'Zone 04: Mannar & Puttalam District', districts: 'Mannar, Puttalam', adjustmentMinutes: { fajr: 1, sunrise: 1, dhuhr: 1, asr: 1, maghrib: 1, isha: 1 } },
  { id: 'ZONE5', name: 'Zone 05', label: 'Zone 05: Anuradhapura & Polonnaruwa District', districts: 'Anuradhapura, Polonnaruwa', adjustmentMinutes: { fajr: 0, sunrise: -1, dhuhr: -1, asr: -1, maghrib: -2, isha: -2 } },
  { id: 'ZONE6', name: 'Zone 06', label: 'Zone 06: Kurunegala District', districts: 'Kurunegala', adjustmentMinutes: { fajr: 0, sunrise: 0, dhuhr: 0, asr: 0, maghrib: 0, isha: 0 } },
  { id: 'ZONE7', name: 'Zone 07', label: 'Zone 07: Kandy, Matale & Nuwara Eliya District', districts: 'Kandy, Matale, Nuwara Eliya', adjustmentMinutes: { fajr: -1, sunrise: -2, dhuhr: -2, asr: -2, maghrib: -2, isha: -2 } },
  { id: 'ZONE8', name: 'Zone 08', label: 'Zone 08: Batticaloa & Ampara District', districts: 'Batticaloa, Ampara', adjustmentMinutes: { fajr: -6, sunrise: -6, dhuhr: -6, asr: -6, maghrib: -6, isha: -6 } },
  { id: 'ZONE9', name: 'Zone 09', label: 'Zone 09: Trincomalee District', districts: 'Trincomalee', adjustmentMinutes: { fajr: -4, sunrise: -4, dhuhr: -5, asr: -5, maghrib: -5, isha: -5 } },
  { id: 'ZONE10', name: 'Zone 10', label: 'Zone 10: Badulla, Monaragala, Dehiattakandiya, Embilipitiya', districts: 'Badulla, Monaragala, Embilipitiya', adjustmentMinutes: { fajr: -3, sunrise: -3, dhuhr: -3, asr: -3, maghrib: -3, isha: -3 } },
  { id: 'ZONE11', name: 'Zone 11', label: 'Zone 11: Ratnapura & Kegalle District', districts: 'Ratnapura, Kegalle', adjustmentMinutes: { fajr: 0, sunrise: 0, dhuhr: 0, asr: 0, maghrib: 0, isha: 0 } },
  { id: 'ZONE12', name: 'Zone 12', label: 'Zone 12: Galle & Matara District', districts: 'Galle, Matara', adjustmentMinutes: { fajr: 1, sunrise: 0, dhuhr: 0, asr: 0, maghrib: 0, isha: 0 } },
  { id: 'ZONE13', name: 'Zone 13', label: 'Zone 13: Hambantota District', districts: 'Hambantota', adjustmentMinutes: { fajr: -2, sunrise: -2, dhuhr: -2, asr: -2, maghrib: -2, isha: -2 } },
];

export interface TimeAdjustmentMinutes {
  fajr: number;
  sunrise: number;
  dhuhr: number;
  asr: number;
  maghrib: number;
  isha: number;
}

export interface TVSettings {
  language: LanguageCode;
  autoCycleLanguages: boolean;
  selectedZoneId: string;
  timeAdjustmentMinutes: TimeAdjustmentMinutes;
  time24Format: boolean;
  showSunrise: boolean;
  tarawihEnabled: boolean;
  phoneSilentAlertEnabled: boolean;
  mosqueName: string;
  brandTitle: string;
  subtitle: string;
  displayName: string;
  contact: ContactInfo;
  iqamahOffsets: IqamahOffsets;
  customPrayerTimes: CustomPrayerTimes;
  customIqamahTimes: CustomIqamahTimes;
  azanAudio: AzanAudioSettings;
  weather: WeatherSettings;
  background: BackgroundSettings;
  announcements: string[];
  specialPrayers: SpecialPrayerSchedule;
  islamicContent: IslamicSlide[];
  fontColorCycleSeconds?: number;
  fontColorTheme?: string;
  arabicNumerals?: boolean;
}

export const DEFAULT_SETTINGS: TVSettings = {
  language: 'en',
  autoCycleLanguages: false,
  selectedZoneId: 'ZONE4', // Default: Zone 04: Mannar & Puttalam District
  timeAdjustmentMinutes: {
    fajr: 0,
    sunrise: 0,
    dhuhr: 0,
    asr: 0,
    maghrib: 0,
    isha: 0,
  },
  time24Format: false,
  showSunrise: true,
  tarawihEnabled: false,
  phoneSilentAlertEnabled: true,
  arabicNumerals: false,
  mosqueName: "MOHIDHEEN THAIKKA MOSQUE",
  brandTitle: "BIN FAIZAL'S",
  subtitle: "Mosque Services",
  displayName: "BIN FAIZAL'S SMART TV",
  contact: {
    phone: "",
    whatsapp: "",
    email: "",
    website: "",
    callText: "",
  },
  iqamahOffsets: {
    fajr: 20,
    dhuhr: 15,
    asr: 15,
    maghrib: 10,
    isha: 15,
  },
  customPrayerTimes: {},
  customIqamahTimes: {},
  azanAudio: {
    enabled: true,
    volume: 1.0,
    fajrAudio: "/audio/azan-madina.mp3",
    dhuhrAudio: "/audio/azan-madina.mp3",
    asrAudio: "/audio/azan-madina.mp3",
    maghribAudio: "/audio/azan-madina.mp3",
    ishaAudio: "/audio/azan-madina.mp3",
    iqamahAudio: "/audio/iqamah-alert.mp3",
    azanAlertEnabled: true,
    iqamahAlertEnabled: true,
  },
  weather: {
    city: "Puttalam",
    autoDetect: true,
    latitude: 8.0333,
    longitude: 80.0167,
  },
  background: {
    type: 'slideshow',
    slides: [
      "/images/royal-mosque-1.jpg",
      "/images/royal-mosque-2.jpg",
      "/images/royal-mosque-3.jpg"
    ],
    videoUrl: "",
    slideIntervalSeconds: 12,
    blurPx: 0,
    overlayOpacity: 40,
  },
  fontColorCycleSeconds: 8,
  fontColorTheme: 'royal-cycle',
  announcements: [
    "📢 Welcome to BIN FAIZAL'S Mosque Smart TV",
    "📵Please turn off or silence your mobile phones inside the Mosque.",
    "🤲 May Allah accept all our prayers and ibadah"
  ],
  specialPrayers: {
    jummah: {
      enabled: true,
      title: "Jumu'ah Prayer",
      khutbahTime: "12:30 PM",
      prayerTime: "01:00 PM",
      iqamahTime: "01:15 PM (+45 mins)",
      notes: "Please silence mobile phones & perform Sunnah prayers early."
    },
    taraweeh: {
      enabled: false,
      title: "Taraweeh Prayer",
      khutbahTime: "08:15 PM",
      prayerTime: "08:30 PM",
      iqamahTime: "08:45 PM",
      notes: "20 Raka'at congregational prayer following Isha."
    },
    eidFitr: {
      enabled: false,
      title: "Eid-ul-Fitr Prayer",
      khutbahTime: "06:45 AM",
      prayerTime: "07:15 AM",
      iqamahTime: "07:20 AM",
      notes: "Takbeerat begins at 06:30 AM. Bring your own prayer mat if possible."
    },
    eidAdha: {
      enabled: false,
      title: "Eid-ul-Adha Prayer",
      khutbahTime: "06:45 AM",
      prayerTime: "07:15 AM",
      iqamahTime: "07:20 AM",
      notes: "Takbeerat & Qurbani arrangements following Jama'at."
    }
  },
  islamicContent: [
    {
      id: '1',
      type: 'HADITH OF THE DAY',
      icon: '📖',
      content: '“The best among you are those who learn the Qur\'an and teach it to others.”',
      reference: '— Sahih Al-Bukhari (5027)'
    },
    {
      id: '2',
      type: 'QURAN VERSE OF THE DAY',
      icon: '🌟',
      content: '“Verily, in the remembrance of Allah do hearts find rest.”',
      reference: '— Surah Ar-Ra\'d (13:28)'
    },
    {
      id: '3',
      type: 'DUA OF THE DAY',
      icon: '🤲',
      content: '“O Allah, help me remember You, thank You, and worship You in the best manner.”',
      reference: '— Sunan Abi Dawud (1522)'
    },
    {
      id: '4',
      type: 'MOSQUE ANNOUNCEMENT',
      icon: '🕌',
      content: 'Support mosque maintenance and expansion. JazakAllahu Khairan for your continuous generous contributions.',
      reference: '— BIN FAIZAL\'S Mosque Services'
    }
  ]
};

const STORAGE_KEY = 'bin_faizal_tv_settings_v2';
const CHANNEL_NAME = 'bin_faizal_tv_sync_channel';

export function getTVSettings(): TVSettings {
  if (typeof window === 'undefined') return DEFAULT_SETTINGS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_SETTINGS;
    const parsed = JSON.parse(raw);

    // Sanitize background slides to ensure ONLY pure masjid architecture images
    const rawSlides: string[] = Array.isArray(parsed.background?.slides) ? parsed.background.slides : [];
    const sanitizedSlides = rawSlides.some((s: string) => s.includes('unsplash') || s.includes('http')) || rawSlides.length === 0
      ? DEFAULT_SETTINGS.background.slides
      : rawSlides;

    // Migrate announcement to current requested text if old version was cached
    let announcements = Array.isArray(parsed.announcements) ? parsed.announcements : DEFAULT_SETTINGS.announcements;
    announcements = announcements.map((a: string) =>
      a.includes('inside the prayer hall') ? "📵Please turn off or silence your mobile phones inside the Mosque." : a
    );

    const rawAudio = parsed.azanAudio || {};
    const sanitizedAudio: AzanAudioSettings = {
      ...DEFAULT_SETTINGS.azanAudio,
      ...rawAudio,
      fajrAudio: (!rawAudio.fajrAudio || rawAudio.fajrAudio.includes('mixkit')) ? '/audio/azan-madina.mp3' : rawAudio.fajrAudio,
      dhuhrAudio: (!rawAudio.dhuhrAudio || rawAudio.dhuhrAudio.includes('mixkit')) ? '/audio/azan-madina.mp3' : rawAudio.dhuhrAudio,
      asrAudio: (!rawAudio.asrAudio || rawAudio.asrAudio.includes('mixkit')) ? '/audio/azan-madina.mp3' : rawAudio.asrAudio,
      maghribAudio: (!rawAudio.maghribAudio || rawAudio.maghribAudio.includes('mixkit')) ? '/audio/azan-madina.mp3' : rawAudio.maghribAudio,
      ishaAudio: (!rawAudio.ishaAudio || rawAudio.ishaAudio.includes('mixkit')) ? '/audio/azan-madina.mp3' : rawAudio.ishaAudio,
      iqamahAudio: (!rawAudio.iqamahAudio || rawAudio.iqamahAudio.includes('mixkit')) ? '/audio/iqamah-alert.mp3' : rawAudio.iqamahAudio,
      azanAlertEnabled: rawAudio.azanAlertEnabled !== false,
      iqamahAlertEnabled: rawAudio.iqamahAlertEnabled !== false,
    };

    return {
      ...DEFAULT_SETTINGS,
      ...parsed,
      announcements,
      background: {
        ...DEFAULT_SETTINGS.background,
        ...parsed.background,
        slides: sanitizedSlides,
      },
      contact: { ...DEFAULT_SETTINGS.contact, ...parsed.contact },
      iqamahOffsets: { ...DEFAULT_SETTINGS.iqamahOffsets, ...parsed.iqamahOffsets },
      customPrayerTimes: { ...DEFAULT_SETTINGS.customPrayerTimes, ...parsed.customPrayerTimes },
      customIqamahTimes: { ...DEFAULT_SETTINGS.customIqamahTimes, ...parsed.customIqamahTimes },
      azanAudio: sanitizedAudio,
      weather: { ...DEFAULT_SETTINGS.weather, ...parsed.weather },
      specialPrayers: { ...DEFAULT_SETTINGS.specialPrayers, ...parsed.specialPrayers },
    };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function saveTVSettings(settings: TVSettings): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    broadcastSettingsChange();
  } catch (err) {
    console.error('Failed to save settings:', err);
  }
}

export function broadcastSettingsChange(): void {
  if (typeof window === 'undefined') return;
  try {
    if ('BroadcastChannel' in window) {
      const channel = new BroadcastChannel(CHANNEL_NAME);
      channel.postMessage({ type: 'SETTINGS_UPDATED', timestamp: Date.now() });
      channel.close();
    }
  } catch {
    // fallback
  }
}

export function subscribeToSettingsChange(callback: () => void): () => void {
  if (typeof window === 'undefined') return () => {};
  let channel: BroadcastChannel | null = null;
  const storageHandler = (e: StorageEvent) => {
    if (e.key === STORAGE_KEY) {
      callback();
    }
  };

  window.addEventListener('storage', storageHandler);

  if ('BroadcastChannel' in window) {
    channel = new BroadcastChannel(CHANNEL_NAME);
    channel.onmessage = (msg) => {
      if (msg.data?.type === 'SETTINGS_UPDATED') {
        callback();
      }
    };
  }

  return () => {
    window.removeEventListener('storage', storageHandler);
    if (channel) {
      channel.close();
    }
  };
}
