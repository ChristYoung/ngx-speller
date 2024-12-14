import { CommonModule } from '@angular/common';
import { Component, EventEmitter, HostListener, inject, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TrustHtmlPipe } from '../../../pipes/trust-html.pipe';
import { EmitParams, ModeType } from '../../../types';
import { WordsItem } from '@shared/types';
import { BANNED_KEYS, isChineseSymbol } from '../../../utils';
import { HighlightComponent } from '../../../widgets/highlight/highlight.component';
import { HornComponent } from '../../../widgets/horn/horn.component';
import { ZorroModule } from '../../../zorro/zorro.module';
import { SimilarWordsComponent } from '../similar-words/similar-words.component';
import { QuizInputComponent } from './quiz-input/quiz-input.component';
import { KeyboardSoundService } from '../../../services/keyboard-sound.service';

@Component({
  selector: 'app-spelling-card',
  standalone: true,
  template: `
    <div class="__spelling_card_container">
      @if (showPhonetic && wordItem.phonetic) {
        <div class="phonetic">/{{ wordItem.phonetic }}/</div>
      }
      <div class="similar_words">
        <app-similar-words [freezed]="true" [tags]="wordItem.similar_words"></app-similar-words>
      </div>
      <div class="word_bar">
        <div class="word_info">
          <p>{{ wordItem.right_count }}/{{ wordItem.total_count }}</p>
          <div class="divide_line"></div>
          <p>{{ wordItem.right_rate }}%</p>
        </div>
        @if (mode === 'VIEW') {
          @for (item of wordItem.word.split(''); track $index) {
            <span
              class="single_letter default small_font_size"
              [ngClass]="{
                transparent: item === ' ',
                correct: displayLetters[$index] === item.toLowerCase(),
                small_font_size: wordItem.type === 'PHRASE',
              }"
              >{{ item !== ' ' ? item : '_' }}</span
            >
          }
        } @else if (mode === 'QUIZ') {
          <app-quiz-input
            [word]="wordItem?.word"
            [wordType]="wordItem?.type"
            (answerCorrect)="onQuizAnswerChange($event)"
          ></app-quiz-input>
        } @else {
          <!-- Spelling & Strict mode -->
          @for (item of wordItem.word.split(''); track $index) {
            <span
              class="single_letter"
              [ngClass]="{
                transparent: item === ' ',
                correct: displayLetters[$index] === item.toLowerCase(),
                small_font_size: wordItem.type === 'PHRASE',
              }"
              >{{
                displayLetters[$index] && displayLetters[$index] !== ' '
                  ? displayLetters[$index]
                  : '_'
              }}</span
            >
          }
        }
        @if (showHorn) {
          <app-horn
            class="horn"
            [word]="wordItem?.word"
            [preloadSrc]="true"
            [backSpaceKeyDownPlay]="backSpaceKeyDownPlay"
            [autoPlay]="autoPlay"
          ></app-horn>
        }
      </div>
      @if (showExplanations) {
        <div class="explanations">{{ wordItem.explanation || wordItem['explanations'] }}</div>
        @if (wordItem.eng_explanation && mode !== 'STRICT' && mode !== 'QUIZ') {
          <div class="explanations" [innerHTML]="wordItem.eng_explanation | trustHtml"></div>
        }
      }
      @if (showExamples) {
        <div class="examples_container">
          @for (item of wordItem.examples; track $index) {
            <app-highlight [highlightWord]="wordItem.word" [example]="item.en"></app-highlight>
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
    ZorroModule,
    SimilarWordsComponent,
    FormsModule,
    TrustHtmlPipe,
    QuizInputComponent,
  ],
})
export class SpellingCardComponent {
  @Input({ required: true }) wordItem: WordsItem;
  @Input() mode: ModeType = 'SPELLING';
  @Input() showHorn = true;
  @Input() lastWord: boolean; // if current word is the last word in the list
  @Input() showPhonetic = true;
  @Input() showExamples = true;
  @Input() showExplanations = true;
  @Input() enableSpelling = true;
  @Input() muteKeyBoard = false;
  @Input() autoPlay = false;
  @Input() backSpaceKeyDownPlay = true;
  @Output() correctSpellingHandler = new EventEmitter<EmitParams>();
  @Output() incorrectSpellingHandler = new EventEmitter<EmitParams>();

  soundService = inject(KeyboardSoundService);
  displayLetters: string[] = [];

  onQuizAnswerChange(isTypingCorrect: boolean): void {
    if (isTypingCorrect) {
      this.soundService.play('Correct');
      this.correctSpellingHandler.emit({
        word: this.wordItem,
        lastWord: this.lastWord,
      });
    } else {
      this.soundService.play('Incorrect');
      this.incorrectSpellingHandler.emit({
        word: this.wordItem,
        lastWord: this.lastWord,
      });
    }
  }

  @HostListener('window:keydown', ['$event'])
  handleKeyDown(event: KeyboardEvent): void {
    if (this.mode === 'QUIZ' || !this.enableSpelling) return;
    const { code, key } = event;
    if (isChineseSymbol(key)) return;
    if ([...BANNED_KEYS, 'ArrowRight', 'ArrowLeft'].includes(code)) return;
    const displayWordLen = this.displayLetters.length;
    if (!this.wordItem.word[displayWordLen]) return;
    const isTypingCorrect = key === this.wordItem.word[displayWordLen].toLowerCase();
    const isLastLetter = displayWordLen === this.wordItem.word.length - 1;
    if (isTypingCorrect) {
      this.soundService.play('Typing');
      this.displayLetters.push(key);
      if (isLastLetter) {
        this.soundService.play('Correct');
        this.correctSpellingHandler.emit({
          word: this.wordItem,
          lastWord: this.lastWord,
        });
        this.displayLetters = [];
      }
    } else {
      this.soundService.play('Incorrect');
      this.incorrectSpellingHandler.emit({
        word: this.wordItem,
        lastWord: this.lastWord,
      });
      this.displayLetters = [];
    }
  }
}
