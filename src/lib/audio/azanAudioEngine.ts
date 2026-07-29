'use client';

let currentAudioInstance: HTMLAudioElement | null = null;

export function playAzanAudio(audioUrl: string, volume: number = 1.0, onEnded?: () => void): HTMLAudioElement | null {
  if (typeof window === 'undefined') return null;

  try {
    if (currentAudioInstance) {
      currentAudioInstance.pause();
      currentAudioInstance.currentTime = 0;
      currentAudioInstance = null;
    }

    if (!audioUrl) return null;

    const audio = new Audio(audioUrl);
    audio.volume = Math.max(0, Math.min(1, volume));

    audio.onended = () => {
      currentAudioInstance = null;
      if (onEnded) onEnded();
    };

    audio.onerror = (e) => {
      console.warn('Azan audio playback issue:', e);
      currentAudioInstance = null;
      if (onEnded) onEnded();
    };

    audio.play().catch((err) => {
      console.warn('Autoplay prevented or network error:', err);
    });

    currentAudioInstance = audio;
    return audio;
  } catch (err) {
    console.error('Failed to trigger Azan audio:', err);
    return null;
  }
}

export function stopAzanAudio(): void {
  if (currentAudioInstance) {
    currentAudioInstance.pause();
    currentAudioInstance.currentTime = 0;
    currentAudioInstance = null;
  }
}
