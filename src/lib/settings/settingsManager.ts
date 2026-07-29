'use client';

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

export interface TVSettings {
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
}

export const DEFAULT_SETTINGS: TVSettings = {
  mosqueName: "MOHIDHEEN THAIKKA MOSQUE",
  brandTitle: "BIN FAIZAL'S",
  subtitle: "Mosque Services",
  displayName: "BIN FAIZAL'S SMART TV",
  contact: {
    phone: "+94 76 938 3982",
    whatsapp: "+94 76 938 3982",
    email: "contact@binfaizal.org",
    website: "www.binfaizal.org",
    callText: "Call",
  },
  iqamahOffsets: {
    fajr: 30,
    dhuhr: 15,
    asr: 15,
    maghrib: 15,
    isha: 15,
  },
  customPrayerTimes: {},
  customIqamahTimes: {},
  azanAudio: {
    enabled: true,
    volume: 1.0,
    fajrAudio: "https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3",
    dhuhrAudio: "https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3",
    asrAudio: "https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3",
    maghribAudio: "https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3",
    ishaAudio: "https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3",
  },
  weather: {
    city: "Colombo",
    autoDetect: true,
    latitude: 6.9271,
    longitude: 79.8612,
  },
  background: {
    type: 'slideshow',
    slides: [
      "https://images.unsplash.com/photo-1542816417-0983cbe82752?q=80&w=1920&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1564769625905-50e93615e769?q=80&w=1920&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1591604466107-ec97de577aff?q=80&w=1920&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1519817650390-64a93db51149?q=80&w=1920&auto=format&fit=crop"
    ],
    videoUrl: "",
    slideIntervalSeconds: 12,
    blurPx: 0,
    overlayOpacity: 55,
  },
  announcements: [
    "📢 Welcome to BIN FAIZAL'S Mosque Smart TV",
    "Please turn off or silence your mobile phones inside the prayer hall.",
    "🤲 May Allah accept all our prayers and ibadah",
    "Contact Us +94 769383982"
  ],
  specialPrayers: {
    jummah: {
      enabled: true,
      title: "Jumu'ah Prayer",
      khutbahTime: "12:30 PM",
      prayerTime: "01:00 PM",
      iqamahTime: "01:05 PM",
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
    return {
      ...DEFAULT_SETTINGS,
      ...parsed,
      contact: { ...DEFAULT_SETTINGS.contact, ...parsed.contact },
      iqamahOffsets: { ...DEFAULT_SETTINGS.iqamahOffsets, ...parsed.iqamahOffsets },
      customPrayerTimes: { ...DEFAULT_SETTINGS.customPrayerTimes, ...parsed.customPrayerTimes },
      customIqamahTimes: { ...DEFAULT_SETTINGS.customIqamahTimes, ...parsed.customIqamahTimes },
      azanAudio: { ...DEFAULT_SETTINGS.azanAudio, ...parsed.azanAudio },
      weather: { ...DEFAULT_SETTINGS.weather, ...parsed.weather },
      background: { ...DEFAULT_SETTINGS.background, ...parsed.background },
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
