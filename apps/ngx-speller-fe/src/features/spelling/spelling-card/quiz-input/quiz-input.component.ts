import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ZorroModule } from '../../../../zorro/zorro.module';
import { WordType } from '@shared/types';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-quiz-input',
  standalone: true,
  imports: [ZorroModule, FormsModule, CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <input
      nz-input
      nzAutofocus="true"
      nzSize="large"
      nzAutofocusSize="large"
      nzBorderless="true"
      (keydown.enter)="onEnter()"
      [ngStyle]="{ 'width.px': 25 * word.length }"
      #inputEle
    />
  `,
  styles: [
    `
      input {
        display: block;
        font-size: 30px;
        font-style: italic;
        text-align: center;
      }
    `,
  ],
})
export class QuizInputComponent implements OnChanges {
  @Input() word!: string;
  @Input() wordType: WordType;
  @Output() answerCorrect = new EventEmitter<boolean>();
  @ViewChild('inputEle') inputRef!: ElementRef;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['word']) {
      this.inputRef.nativeElement.value = '';
    }
  }

  onEnter(): void {
    const value = this.inputRef.nativeElement.value;
    const isCorrect = value.toLowerCase() === this.word.toLowerCase();
    this.answerCorrect.emit(isCorrect);
  }
}
