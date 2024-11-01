import { Component, Input } from '@angular/core';
import { ZorroModule } from '../../../../zorro/zorro.module';

@Component({
  selector: 'app-quiz-input',
  standalone: true,
  imports: [ZorroModule],
  template: ` <input nz-input placeholder="input word" nzSize="large" nzBorderless="true" /> `,
  styleUrl: './quiz-input.component.less',
})
export class QuizInputComponent {
  @Input() word!: string;
}
