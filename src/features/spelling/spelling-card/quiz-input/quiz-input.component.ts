import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ZorroModule } from '../../../../zorro/zorro.module';
import { WordType } from '../../../../types';

@Component({
  selector: 'app-quiz-input',
  standalone: true,
  imports: [ZorroModule, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <input
      nz-input
      placeholder="input word"
      nzAutofocus="true"
      nzSize="large"
      nzAutofocusSize="large"
      nzBorderless="true"
      (keydown.enter)="onEnter()"
      #inputEle
    />
  `,
  styleUrl: './quiz-input.component.less',
})
export class QuizInputComponent {
  @Input() word!: string;
  @Input() wordType: WordType;
  @Output() answerCorrect = new EventEmitter<boolean>();
  @ViewChild('inputEle') inputRef!: ElementRef;

  onEnter(): void {
    const value = this.inputRef.nativeElement.value;
    const isCorrect = value.toLowerCase() === this.word.toLowerCase();
    if (isCorrect) {
      this.inputRef.nativeElement.value = '';
    }
    this.answerCorrect.emit(isCorrect);
  }
}
