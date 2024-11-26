import { Injectable } from '@angular/core';
import { SoundSourceMapping, SoundsType } from '../utils';

@Injectable({
  providedIn: 'root',
})
export class KeyboardSoundService {
  private audioMap: Map<SoundsType, HTMLAudioElement> = new Map();

  constructor() {}

  initKeyBoardSound(): void {
    for (const soundType in SoundSourceMapping) {
      if (SoundSourceMapping[soundType]) {
        const soundUrl = SoundSourceMapping[soundType];
        const audio = new Audio(soundUrl);
        audio.load();
        this.audioMap.set(soundType as SoundsType, audio);
      }
    }
  }

  play(soundType: SoundsType): void {
    const audio = this.audioMap.get(soundType);
    if (audio) {
      audio.currentTime = 0;
      audio.play().catch((err) => console.error('Audio play error:', err));
    }
  }
}
