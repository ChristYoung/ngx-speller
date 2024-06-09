import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  HostListener,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import { EmitParams, ModeType, WordsItem } from '../../../types';
import { ZorroModule } from '../../../zorro/zorro.module';

@Component({
  selector: 'app-spelling-operator',
  standalone: true,
  imports: [ZorroModule, CommonModule],
  template: `
    <div class="mat-elevation-z2">
      <button
        nz-button
        nzType="link"
        (click)="changeCursorHandler('prev')"
        [disabled]="prevDisabled"
      >
        <span nz-icon nzType="left" nzTheme="outline"></span>
      </button>
      <button
        nzType="link"
        nz-button
        (click)="familiar = !familiar; updateFamiliarity.emit(familiar)"
      >
        <span
          class="operator_item"
          nzType="link"
          nz-icon
          [nzType]="'heart'"
          [nzTheme]="familiar ? 'twotone' : 'outline'"
          [nzTwotoneColor]="'#eb2f96'"
        ></span>
      </button>
      <button
        type="button"
        nz-button
        nzType="link"
        [disabled]="nextDisabled"
        (click)="changeCursorHandler('next')"
      >
        <span nz-icon nzType="right" nzTheme="outline"></span>
      </button>
    </div>
  `,
  styleUrl: './spelling-operator.component.less',
})
export class SpellingOperatorComponent implements OnChanges {
  @Input() prevDisabled: boolean;
  @Input() nextDisabled: boolean;
  @Input() wordItem: WordsItem;
  @Input() mode: ModeType = 'SPELLING';
  @Output() onIncorrectSpelling = new EventEmitter<EmitParams>();
  @Output() moveCursor = new EventEmitter<'next' | 'prev'>();
  @Output() updateFamiliarity = new EventEmitter<boolean>();

  familiar: boolean;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['wordItem']) {
      this.familiar = !!this.wordItem?.familiar;
    }
  }

  changeCursorHandler(direction: 'next' | 'prev'): void {
    this.moveCursor.emit(direction);
    // When in the QUIZ mode, once the user change cursor manually, emit the incorrect event
    if (this.mode === 'QUIZ' && direction === 'next') {
      this.onIncorrectSpelling.emit({
        word: this.wordItem,
        lastWord: this.nextDisabled,
      });
    }
  }

  @HostListener('window:keydown', ['$event'])
  handleKeyDown(event: KeyboardEvent) {
    const { code } = event;
    const allowedCodes = ['ArrowRight', 'ArrowLeft'];
    if (allowedCodes.includes(code)) {
      event.preventDefault();
      if (code === 'ArrowRight' && !this.nextDisabled) {
        this.changeCursorHandler('next');
      } else if (code === 'ArrowLeft' && !this.prevDisabled) {
        this.changeCursorHandler('prev');
      }
      return;
    }
    return;
  }
}
