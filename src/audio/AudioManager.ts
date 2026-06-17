// src/audio/AudioManager.ts

export class AudioManager {
  private static instance: AudioManager;
  private audioEnabled: boolean;
  private volume: number = 0.5;
  private audioMap: Record<string, HTMLAudioElement> = {};

  private constructor() {
    this.audioEnabled = this.loadPref();
  }

  public static getInstance(): AudioManager {
    if (!AudioManager.instance) {
      AudioManager.instance = new AudioManager();
    }
    return AudioManager.instance;
  }

  private loadPref(): boolean {
    try {
      return localStorage.getItem('roulette_audio_enabled') === 'true';
    } catch {
      return false;
    }
  }

  private savePref(val: boolean) {
    try {
      localStorage.setItem('roulette_audio_enabled', val ? 'true' : 'false');
    } catch {}
  }

  public isEnabled(): boolean {
    return this.audioEnabled;
  }

  public toggle() {
    this.audioEnabled = !this.audioEnabled;
    this.savePref(this.audioEnabled);
  }

  public setVolume(level: number) {
    this.volume = Math.max(0, Math.min(1, level));
    Object.values(this.audioMap).forEach((a) => (a.volume = this.volume));
  }

  private getAudio(name: string, src: string): HTMLAudioElement {
    if (!this.audioMap[name]) {
      const audio = new Audio(src);
      audio.volume = this.volume;
      this.audioMap[name] = audio;
    }
    return this.audioMap[name];
  }

  public play(name: string) {
    if (!this.audioEnabled) return;
    const src = `/assets/audio/${name}.mp3`;
    const audio = this.getAudio(name, src);
    audio.currentTime = 0;
    audio.play().catch(() => {
      console.warn('Audio playback failed for', name);
    });
  }

  public stop(name: string) {
    const audio = this.audioMap[name];
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
    }
  }

  public stopAll() {
    Object.values(this.audioMap).forEach((a) => {
      a.pause();
      a.currentTime = 0;
    });
  }
}
