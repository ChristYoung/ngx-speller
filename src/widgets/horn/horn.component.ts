import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostListener,
  Input,
  OnChanges,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { AUDIO_SRC } from '../../core/constant';
import { PreventButtonDefaultDirective } from '../../directives/prevent-button-default.directive';
import { ZorroModule } from '../../zorro/zorro.module';

@Component({
  selector: 'app-horn',
  standalone: true,
  imports: [ZorroModule, PreventButtonDefaultDirective],
  template: `
    <button
      nz-button
      (click)="playAudio()"
      nzLoading="{{ loading }}"
      nzType="default"
      nzShape="circle"
      appPreventButtonDefault
    >
      <span nz-icon nzType="sound" nzTheme="outline"></span>
    </button>

    @if (word) {
      <audio #audioPlayer (loadedmetadata)="mediaLoaded()" [src]="audioSrc" [hidden]="true"></audio>
    }
  `,
  styleUrl: './horn.component.less',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HornComponent implements OnChanges {
  @Input({ required: true }) word: string = '';
  @Input() autoPlay = false;
  @Input() preloadSrc = false;
  @Input() backSpaceKeyDownPlay = false;
  @Input() playMode: 'AUDIO_SRC' | 'SPEECH_API' = 'AUDIO_SRC';
  loading: boolean = false;
  audioSrc: string = '';
  @ViewChild('audioPlayer') audioPlayer: ElementRef<HTMLAudioElement>;

  constructor() {}

  ngOnChanges(_changes: SimpleChanges): void {
    if (_changes['word']) {
      this.audioSrc = '';
      if (this.preloadSrc) {
        this.setAudioSrc();
      }
    }
  }

  setAudioSrc(): void {
    this.audioSrc = `${AUDIO_SRC}${this.word}`;
  }

  mediaLoaded(): void {
    this.loading = false;
    if (this.autoPlay) {
      this.playAudioManual();
    }
  }

  playAudio(): void {
    if (this.playMode === 'AUDIO_SRC') {
      this.playAudioManual();
    } else {
      this.playAudioBySpeechApi();
    }
  }

  playAudioManual(): void {
    if (this.audioPlayer) {
      if (!this.preloadSrc && !this.audioSrc) {
        this.loading = true;
        this.setAudioSrc();
      }
      setTimeout(() => {
        this.audioPlayer.nativeElement.play();
      }, 0);
    }
  }

  playAudioBySpeechApi(): void {
    const utterance = new SpeechSynthesisUtterance(this.word);
    utterance.lang = 'en-US';
    utterance.pitch = 1;
    utterance.rate = 1;
    window.speechSynthesis.speak(utterance);
  }

  @HostListener('window:keydown', ['$event'])
  handleKeyDown(event: KeyboardEvent) {
    const { code } = event;
    if (this.backSpaceKeyDownPlay && code === 'Backspace') {
      this.playAudioManual();
    }
  }
}
