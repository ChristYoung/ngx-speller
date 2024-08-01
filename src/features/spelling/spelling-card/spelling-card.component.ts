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
import { HornComponent } from '../../../widgets/horn/horn.component';
import { BANNED_KEYS, isChineseSymbol, playSound } from '../../../utils';
import { HighlightComponent } from '../../../widgets/highlight/highlight.component';
import { HoldKeypressDirective } from '../../../directives/hold-keypress.directive';
import { ZorroModule } from '../../../zorro/zorro.module';
import { SimilarWordsComponent } from '../similar-words/similar-words.component';

@Component({
  selector: 'app-spelling-card',
  standalone: true,
  template: `
    <!-- TODO: Need to discovery the long press to show the answer. -->
    <!-- [appHoldKeypress]="true"
      [targetKeycode]="'Tab'"
      (keyHold)="handleLongPress($event)"
      (keyRelease)="displayLetters = []" -->
    <div class="__spelling_card_container">
      @if (showPhonetic) {
      <div class="phonetic">/{{ wordItem.phonetic }}/</div>
      }
      <div class="similar_words">
        <app-similar-words
          [freezed]="true"
          [tags]="wordItem.similar_words"
        ></app-similar-words>
      </div>
      <div class="word_bar">
        @if (mode === 'VIEW') { @for (item of displayLetters; track $index) {
        <span
          class="single_letter"
          [class.correct]="displayLetters[$index] === item"
          >{{ item }}</span
        >
        } } @else { @for (item of wordItem.word.split(''); track $index) {
        <span
          class="single_letter"
          [class.correct]="displayLetters[$index] === item.toLowerCase()"
          >{{ displayLetters[$index] ? displayLetters[$index] : '_' }}</span
        >
        } } @if (showHorn) {
        <app-horn
          class="horn"
          [word]="wordItem?.word"
          [preloadSrc]="true"
          [spaceKeyDownPlay]="true"
          [autoPlay]="autoPlay"
        ></app-horn>
        }
      </div>
      @if (showExplanations) {
      <div class="explanations">{{ wordItem.explanations }}</div>
      } @if (showExamples) {
      <div class="examples_container">
        @for (item of wordItem.examples; track $index) {
        <app-highlight
          [highlightWord]="wordItem.word"
          [example]="item.en"
        ></app-highlight>
        <p>{{ item.zh }}</p>
        }
      </div>
      }
    </div>
  `,
  styleUrl: './spelling-card.component.less',
  imports: [
    CommonModule,
    HornComponent,
    HighlightComponent,
    HoldKeypressDirective,
    ZorroModule,
    SimilarWordsComponent,
  ],
})
export class SpellingCardComponent implements OnChanges {
  @Input({ required: true }) wordItem: WordsItem;
  @Input() mode: ModeType = 'SPELLING';
  @Input() showHorn = true;
  @Input() lastWord: boolean;
  @Input() showPhonetic = true;
  @Input() showExamples = true;
  @Input() showExplanations = true;
  @Input() enableSpelling = true;
  @Input() muteKeyBoard = false;
  @Input() autoPlay = false;
  @Output() onCorrectSpelling = new EventEmitter<EmitParams>();
  @Output() onIncorrectSpelling = new EventEmitter<EmitParams>();
  displayLetters: string[] = [];

  ngOnChanges(_changes: SimpleChanges): void {
    this.displayLetters =
      this.mode === 'VIEW' ? this.wordItem.word.split('') : [];
  }

  @HostListener('window:keydown', ['$event'])
  handleKeyDown(event: KeyboardEvent): void {
    if (this.mode === 'VIEW' || !this.enableSpelling) return;
    const { code, key } = event;
    if (isChineseSymbol(key)) return;
    if ([...BANNED_KEYS, 'ArrowRight', 'ArrowLeft', 'Space'].includes(code))
      return;
    const displayWordLen = this.displayLetters.length;
    if (!this.wordItem.word[displayWordLen]) return;
    const isTypingCorrect =
      key === this.wordItem.word[displayWordLen].toLowerCase();
    const isLastLetter = displayWordLen === this.wordItem.word.length - 1;
    if (isTypingCorrect) {
      playSound({ soundsType: 'Typing' });
      this.displayLetters.push(key);
      if (isLastLetter) {
        playSound({ soundsType: 'Correct' });
        this.onCorrectSpelling.emit({
          word: this.wordItem,
          lastWord: this.lastWord,
        });
        this.displayLetters = [];
      }
    } else {
      playSound({ soundsType: 'Incorrect' });
      this.onIncorrectSpelling.emit({
        word: this.wordItem,
        lastWord: this.lastWord,
      });
      this.displayLetters = [];
    }
  }
}
