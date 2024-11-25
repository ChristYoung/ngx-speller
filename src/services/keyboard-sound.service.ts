import { Injectable } from '@angular/core';
import { SoundSourceMapping, SoundsType } from '../utils';

@Injectable({
  providedIn: 'root',
})
export class KeyboardSoundService {
  private audio: HTMLAudioElement;

  constructor() {
    this.audio = new Audio(SoundSourceMapping['Correct']);
    this.audio.load();
  }

  play(soundsType: SoundsType): void {
    const soundUrl = SoundSourceMapping[soundsType];
    this.audio.currentTime = 0;
    this.audio.src = soundUrl;
    this.audio.play().catch((err) => console.error('Audio play error:', err));
  }
}
