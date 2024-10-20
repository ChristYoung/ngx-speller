import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { NzModalService } from 'ng-zorro-antd/modal';
import { Observable, map, take } from 'rxjs';
import { DbService } from '../../services/DataBase/db.service';
import {
  changeCurrentWordByStep,
  setWordsList,
  updateCurrentIndex,
} from '../../store/words/words.actions';
import { EmitParams, ModeType, Settings, WordsItem } from '../../types';
import { EmptyComponent } from '../../widgets/empty/empty.component';
import { ZorroModule } from '../../zorro/zorro.module';
import { ConfirmComponent } from './confirm/confirm.component';
import { CongratulationComponent } from './congratulation/congratulation.component';
import { SpellingCardComponent } from './spelling-card/spelling-card.component';
import { SpellingOperatorComponent } from './spelling-operator/spelling-operator.component';

@Component({
  selector: 'app-spelling',
  standalone: true,
  template: `
    @if ((wordList$ | async)?.length > 0) {
      <div class="container">
        <nz-progress
          [nzPercent]="((currentWordIndex$ | async) / (wordList$ | async).length) * 100"
        ></nz-progress>
        <p class="progress_text">
          {{ currentWordIndex$ | async }}/{{ (wordList$ | async).length }}
        </p>
        <div class="content_wrap">
          <div class="card_container">
            <app-spelling-card
              [wordItem]="currentWordItem$ | async"
              [mode]="(setting$ | async).commonSettings?.mode"
              [enableSpelling]="enableSpelling"
              [backSpaceKeyDownPlay]="backSpaceKeyDownPlay"
              [autoPlay]="(setting$ | async).commonSettings?.autoPlay"
              [showHorn]="(setting$ | async).commonSettings?.showHorn"
              [showExamples]="(setting$ | async).commonSettings?.showExamples"
              [showExplanations]="(setting$ | async).commonSettings?.showExplanation"
              [showPhonetic]="(setting$ | async).commonSettings?.showPhonetic"
              [lastWord]="(currentWordIndex$ | async) >= (wordList$ | async).length"
              (correctSpellingHandler)="correctHandler($event)"
              (incorrectSpellingHandler)="incorrectHandler($event)"
            ></app-spelling-card>
          </div>
          <div class="operator_container">
            <app-spelling-operator
              [prevDisabled]="
                (currentWordIndex$ | async) <= 1 ||
                (setting$ | async).commonSettings?.mode === 'QUIZ'
              "
              [nextDisabled]="(currentWordIndex$ | async) >= (wordList$ | async).length"
              [wordItem]="currentWordItem$ | async"
              [enableSwitch]="enableSwitch"
              (moveCursor)="onMoveCursorHandler($event)"
              (incorrectSpellingHandler)="incorrectHandler($event)"
              (updateMisPronounce)="updateMisPronounce($event)"
              (clickToEdit)="clickToEditHandler($event)"
            ></app-spelling-operator>
          </div>
        </div>
      </div>
    } @else {
      <app-empty emptyTips="Empty word list, please add words first!"></app-empty>
    }
  `,
  styleUrl: './spelling.component.less',
  imports: [
    ZorroModule,
    CommonModule,
    SpellingCardComponent,
    SpellingOperatorComponent,
    EmptyComponent,
  ],
})
export class SpellingComponent {
  private store = inject(Store);
  private db = inject(DbService);
  private dialog = inject(NzModalService);
  private spellingErrorWordsCollection: WordsItem[] = [];

  currentWordIndex$: Observable<number>;
  wordList$: Observable<WordsItem[]>;
  currentWordItem$: Observable<WordsItem>;
  setting$: Observable<Settings>;

  enableSpelling = true;
  enableSwitch = true;
  backSpaceKeyDownPlay = true;

  constructor() {
    this.currentWordIndex$ = this.store
      .select('words', 'currentWordIndex')
      .pipe(map((count) => count + 1));
    this.wordList$ = this.store.select('words', 'words');
    this.setting$ = this.store.select('settings');
    this.currentWordItem$ = this.store.select('words', 'currentWordItem');
  }

  updateMisPronounce(mispronounce: boolean): void {
    this.currentWordItem$.pipe(take(1)).subscribe((w) => {
      this.db.updateWordItemFromIndexDB({ ...w, mispronounce }, true).subscribe(() => {});
    });
  }

  onMoveCursorHandler(step: 'next' | 'prev'): void {
    this.store.dispatch(changeCurrentWordByStep({ step }));
  }

  correctHandler(e: EmitParams): void {
    this.singleWordSpellingEnd(true, e.lastWord, e.word);
  }

  incorrectHandler(e: EmitParams): void {
    this.singleWordSpellingEnd(false, e.lastWord, e.word);
  }

  clickToEditHandler($event: boolean): void {
    this.backSpaceKeyDownPlay = !$event;
    this.enableSpelling = !$event;
    this.enableSwitch = !$event;
  }

  private singleWordSpellingEnd(isCorrect: boolean, isLastWord: boolean, w?: WordsItem): void {
    this.setting$.pipe(take(1)).subscribe((setting) => {
      if (isCorrect) {
        if (isLastWord) {
          if (setting.commonSettings?.mode === 'QUIZ') {
            this.onQuizEnd();
          } else {
            this.onMoveCursorHandler('next');
          }
        } else {
          this.onMoveCursorHandler('next'); // when the word is spelled correctly, then move to the next word automatically.
        }
      } else {
        if (setting.commonSettings?.mode === 'QUIZ') {
          const isExist = this.spellingErrorWordsCollection.find((word) => word.word === w.word);
          !isExist && this.spellingErrorWordsCollection.push(w);
          isLastWord && this.onQuizEnd();
        }
      }
      this.updateWordSpellingCount(w.id, setting.commonSettings?.mode, isCorrect);
    });
  }

  private updateWordSpellingCount(wordId: number, mode: ModeType, correct: boolean): void {
    if (mode !== 'QUIZ') return;
    this.db.getWordItemFromIndexDBById(wordId).subscribe((w) => {
      const { right_count, total_count } = w;
      const currentRightCount = correct ? right_count + 1 : right_count;
      const currentTotalCount = total_count + 1;
      this.db.updateWordSpellingCountToIndexDB(w, {
        right_count: currentRightCount,
        total_count: currentTotalCount,
      });
    });
  }

  private onQuizEnd(): void {
    this.enableSpelling = false;
    if (this.spellingErrorWordsCollection.length > 0) {
      console.log('this.spellingErrorWordsCollection', this.spellingErrorWordsCollection);
      // Finish the quiz and alert the user if there are any spelling errors!
      this.dialog.confirm({
        nzTitle: 'Finish Quiz with errors',
        nzContent: ConfirmComponent,
        nzWidth: '350px',
        nzData: { wordsList: this.spellingErrorWordsCollection },
        nzOnOk: () => {
          this.store.dispatch(
            setWordsList({
              words: [...this.spellingErrorWordsCollection],
            }),
          );
          this.enableSpelling = true;
          this.spellingErrorWordsCollection = [];
        },
        nzOnCancel: () => {},
      });
    } else {
      // Finish the quiz and congratulations the user if there are no spelling errors!
      this.dialog.confirm({
        nzTitle: 'Congratulations!',
        nzContent: CongratulationComponent,
        nzWidth: '350px',
      });
      this.enableSpelling = true;
      this.spellingErrorWordsCollection = [];
      this.store.dispatch(updateCurrentIndex({ index: 0 }));
    }
  }
}
