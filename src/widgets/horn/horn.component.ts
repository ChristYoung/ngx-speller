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
      (click)="playAudioManual()"
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

  @HostListener('window:keydown', ['$event'])
  handleKeyDown(event: KeyboardEvent) {
    const { code } = event;
    if (this.backSpaceKeyDownPlay && code === 'Backspace') {
      this.playAudioManual();
    }
  }
}
