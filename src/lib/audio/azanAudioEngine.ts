'use client';

let currentAudioInstance: HTMLAudioElement | null = null;
let audioContextInstance: AudioContext | null = null;
let isAudioGloballyUnlocked = false;

// Set to track events that have already triggered today (format: "prayerKey-eventType-YYYY-MM-DD")
const triggeredPrayerEvents = new Set<string>();

/**
 * Returns true if audio context has been successfully unlocked via user gesture
 */
export function isAudioUnlocked(): boolean {
  return isAudioGloballyUnlocked;
}

/**
 * Unlocks the Web Audio API context and warm-ups HTML5 audio so automated alerts can play seamlessly
 */
export async function unlockAudioContext(): Promise<boolean> {
  if (typeof window === 'undefined') return false;

  try {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioContextClass) {
      if (!audioContextInstance) {
        audioContextInstance = new AudioContextClass();
      }
      if (audioContextInstance.state === 'suspended') {
        await audioContextInstance.resume();
      }
    }
    isAudioGloballyUnlocked = true;
    return true;
  } catch (err) {
    console.warn('Audio unlock warning:', err);
    return false;
  }
}

// Auto-register window interaction listeners on client initialization
if (typeof window !== 'undefined') {
  const handleInteraction = () => {
    unlockAudioContext().then(() => {
      window.removeEventListener('click', handleInteraction);
      window.removeEventListener('keydown', handleInteraction);
      window.removeEventListener('touchstart', handleInteraction);
    });
  };
  window.addEventListener('click', handleInteraction, { once: true });
  window.addEventListener('keydown', handleInteraction, { once: true });
  window.addEventListener('touchstart', handleInteraction, { once: true });
}

/**
 * Checks if a specific prayer voice alert has already been played today
 */
export function hasPrayerAlertTriggered(eventId: string): boolean {
  return triggeredPrayerEvents.has(eventId);
}

/**
 * Marks a prayer voice alert as played for today
 */
export function markPrayerAlertTriggered(eventId: string): void {
  triggeredPrayerEvents.add(eventId);
}

/**
 * Clears old triggers (called at midnight)
 */
export function clearOldPrayerAlerts(currentDateStr: string): void {
  for (const key of Array.from(triggeredPrayerEvents)) {
    if (!key.endsWith(currentDateStr)) {
      triggeredPrayerEvents.delete(key);
    }
  }
}

/**
 * Generates an audible Islamic tone chime fallback using Web Audio API if MP3 playback fails
 */
export function playChimeFallback(volume: number = 1.0): void {
  if (typeof window === 'undefined') return;
  try {
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = audioContextInstance || new AudioCtx();
    const now = ctx.currentTime;
    const gainNode = ctx.createGain();
    gainNode.gain.setValueAtTime(Math.max(0.1, Math.min(1.0, volume)) * 0.4, now);
    gainNode.gain.exponentialRampToValueAtTime(0.001, now + 2.5);
    gainNode.connect(ctx.destination);

    // Harmonic chord for prayer notification
    [523.25, 659.25, 783.99].forEach((freq) => {
      const osc = ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);
      osc.connect(gainNode);
      osc.start(now);
      osc.stop(now + 2.5);
    });
  } catch (e) {
    console.warn('Fallback chime issue:', e);
  }
}

/**
 * Plays Azan voice alert audio
 */
export function playAzanAudio(audioUrl: string = '/audio/azan-madina.mp3', volume: number = 1.0, onEnded?: () => void): HTMLAudioElement | null {
  if (typeof window === 'undefined') return null;

  try {
    if (currentAudioInstance) {
      currentAudioInstance.pause();
      currentAudioInstance.currentTime = 0;
      currentAudioInstance = null;
    }

    const resolvedUrl = audioUrl && audioUrl.trim() !== '' ? audioUrl : '/audio/azan-madina.mp3';
    const audio = new Audio(resolvedUrl);
    audio.volume = Math.max(0, Math.min(1, volume));

    audio.onended = () => {
      currentAudioInstance = null;
      if (onEnded) onEnded();
    };

    audio.onerror = (e) => {
      console.warn('Azan audio playback issue, triggering tone chime:', e);
      playChimeFallback(volume);
      currentAudioInstance = null;
      if (onEnded) onEnded();
    };

    audio.play().then(() => {
      isAudioGloballyUnlocked = true;
    }).catch((err) => {
      console.warn('Autoplay prevented or network error on Azan audio:', err);
      playChimeFallback(volume);
    });

    currentAudioInstance = audio;
    return audio;
  } catch (err) {
    console.error('Failed to trigger Azan audio:', err);
    playChimeFallback(volume);
    return null;
  }
}

/**
 * Plays Iqamah voice alert audio
 */
export function playIqamahAudio(audioUrl: string = '/audio/iqamah-alert.mp3', volume: number = 1.0, onEnded?: () => void): HTMLAudioElement | null {
  if (typeof window === 'undefined') return null;

  try {
    if (currentAudioInstance) {
      currentAudioInstance.pause();
      currentAudioInstance.currentTime = 0;
      currentAudioInstance = null;
    }

    const resolvedUrl = audioUrl && audioUrl.trim() !== '' ? audioUrl : '/audio/iqamah-alert.mp3';
    const audio = new Audio(resolvedUrl);
    audio.volume = Math.max(0, Math.min(1, volume));

    audio.onended = () => {
      currentAudioInstance = null;
      if (onEnded) onEnded();
    };

    audio.onerror = (e) => {
      console.warn('Iqamah audio playback issue, triggering tone chime:', e);
      playChimeFallback(volume);
      currentAudioInstance = null;
      if (onEnded) onEnded();
    };

    audio.play().then(() => {
      isAudioGloballyUnlocked = true;
    }).catch((err) => {
      console.warn('Autoplay prevented on Iqamah audio:', err);
      playChimeFallback(volume);
    });

    currentAudioInstance = audio;
    return audio;
  } catch (err) {
    console.error('Failed to trigger Iqamah audio:', err);
    playChimeFallback(volume);
    return null;
  }
}

/**
 * Stops any currently playing Azan or Iqamath audio
 */
export function stopAzanAudio(): void {
  if (currentAudioInstance) {
    currentAudioInstance.pause();
    currentAudioInstance.currentTime = 0;
    currentAudioInstance = null;
  }
}
