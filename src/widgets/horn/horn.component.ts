import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostListener,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { AUDIO_SRC } from '../../core/constant';
import { ZorroModule } from '../../zorro/zorro.module';

@Component({
  selector: 'app-horn',
  standalone: true,
  imports: [ZorroModule],
  template: `
    <!-- <button
      mat-icon-button
      class="horn_button"
      [class.spinner]="audioSrc && loading"
      disableRipple="true"
      (click)="playAudioManual()"
      aria-label="Example icon button with a vertical three dot icon"
    >
      @if (!loading) {
      <svg
        viewBox="0 0 1024 1024"
        xmlns="http://www.w3.org/2000/svg"
        fill="currentColor"
      >
        <path
          d="M417.28 164.198c-12.646 0-25.293 5.325-37.683 15.821L169.779 358.35H76.8c-42.342 0-76.8 34.457-76.8 76.8v204.8c0 42.342 34.458 76.8 76.8 76.8h92.98l209.817 178.33c12.339 10.495 25.037 15.82 37.683 15.82a40.755 40.755 0 0034.304-18.534c6.093-9.165 9.216-20.89 9.216-34.816v-640c0-36.864-21.862-53.402-43.52-53.402zM51.2 640V435.2a25.6 25.6 0 0125.6-25.6h76.8v256H76.8A25.6 25.6 0 0151.2 640zm358.4 213.453l-204.8-174.08V395.827l204.8-174.08v631.706z"
        ></path>
      </svg>
      }
    </button> -->
    <button
      nz-button
      (click)="playAudioManual()"
      nzLoading="{{ loading }}"
      nzType="default"
      nzShape="circle"
    >
      <span nz-icon nzType="sound" nzTheme="outline"></span>
    </button>

    @if (word) {
    <audio
      #audioPlayer
      (loadedmetadata)="mediaLoaded()"
      [src]="audioSrc"
      [hidden]="true"
    ></audio>
    }
  `,
  styleUrl: './horn.component.less',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HornComponent implements OnChanges, OnInit {
  @Input({ required: true }) word: string = '';
  @Input() autoPlay = false;
  @Input() preloadSrc = false;
  @Input() spaceKeyDownPlay = false;
  loading: boolean = false;
  audioSrc: string = '';
  @ViewChild('audioPlayer') audioPlayer: ElementRef<HTMLAudioElement>;

  constructor() {}

  ngOnInit(): void {}

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
    if (this.spaceKeyDownPlay && code === 'Backspace') {
      this.playAudioManual();
    }
  }
}
