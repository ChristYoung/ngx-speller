import { PreventButtonDefaultDirective } from '../../../directives/prevent-button-default.directive';
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
import { WordsItem } from '@shared/types';
import { NzDrawerService } from 'ng-zorro-antd/drawer';
import { EmitParams, ModeType } from '../../../types';

import { SidePanelDetailsComponent } from '../../../widgets/side-panel-details/side-panel-details.component';
import { ZorroModule } from '../../../zorro/zorro.module';

@Component({
  selector: 'app-spelling-operator',
  standalone: true,
  imports: [ZorroModule, CommonModule, PreventButtonDefaultDirective],
  template: `
    <div class="mat-elevation-z2">
      <button
        nz-button
        nzType="link"
        (click)="changeCursorHandler('prev')"
        [disabled]="prevDisabled"
        appPreventButtonDefault
      >
        <span nz-icon nzType="left" nzTheme="outline"></span>
      </button>
      <button nz-button nzType="link" (click)="clickViewDetail()" appPreventButtonDefault>
        <span nz-icon nzType="edit" nzTheme="outline"></span>
      </button>
      <button
        nzType="link"
        nz-button
        (click)="mispronounce = !mispronounce; updateMisPronounce.emit(mispronounce)"
        appPreventButtonDefault
      >
        <span
          class="operator_item"
          nzType="link"
          nz-icon
          [nzType]="'sp:shutup'"
          [class.mispronounce]="mispronounce"
        ></span>
      </button>
      <button
        type="button"
        nz-button
        nzType="link"
        [disabled]="nextDisabled"
        (click)="changeCursorHandler('next')"
        appPreventButtonDefault
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
  @Input('wordItem') wordDetails: WordsItem;
  @Input() enableSwitch: boolean;
  @Input() mode: ModeType = 'SPELLING';
  @Output() incorrectSpellingHandler = new EventEmitter<EmitParams>();
  @Output() moveCursor = new EventEmitter<'next' | 'prev'>();
  @Output() updateMisPronounce = new EventEmitter<boolean>();
  @Output() clickToEdit = new EventEmitter<boolean>(false);

  mispronounce: boolean;

  constructor(private drawer: NzDrawerService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['wordDetails']) {
      this.mispronounce = !!this.wordDetails?.mispronounce;
    }
  }

  changeCursorHandler(direction: 'next' | 'prev'): void {
    this.moveCursor.emit(direction);
    // When in the STRICT mode or QUIZ mode,
    // once the user change cursor manually, emit the incorrect event.
    // if ((this.mode === 'STRICT' || this.mode === 'QUIZ') && direction === 'next') {
    //   this.incorrectSpellingHandler.emit({
    //     word: this.wordDetails,
    //     lastWord: this.nextDisabled,
    //   });
    // }
  }

  @HostListener('window:keydown', ['$event'])
  handleKeyDown(event: KeyboardEvent) {
    const { code } = event;
    const allowedCodes = ['ArrowRight', 'ArrowLeft'];
    if (allowedCodes.includes(code) && this.enableSwitch) {
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

  clickViewDetail(): void {
    this.clickToEdit.emit(true);
    const _drawerRef = this.drawer.create<SidePanelDetailsComponent, { wordItem: WordsItem }>({
      nzContent: SidePanelDetailsComponent,
      nzContentParams: { wordItem: this.wordDetails },
      nzWidth: '800px',
    });
    _drawerRef.afterClose.subscribe(() => {
      this.clickToEdit.emit(false);
    });
  }
}
