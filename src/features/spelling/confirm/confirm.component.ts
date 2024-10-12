import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, inject } from '@angular/core';
import { NZ_MODAL_DATA } from 'ng-zorro-antd/modal';
import { WordsItem } from '../../../types';
import { ZorroModule } from '../../../zorro/zorro.module';

@Component({
  selector: 'app-confirm',
  standalone: true,
  imports: [CommonModule, ZorroModule],
  template: `
    <div>
      <p>
        Oops, You got {{ wordsList.length }} words that spelled incorrectly, as the below shows:
        <span class="error_words"
          ><b>{{ wordString }}</b></span
        >. Try to spell them one more time?
      </p>
    </div>
  `,
  styles: [
    `
      .error_words {
        color: #000;
        font-weight: bold;
        font-style: italic;
      }
    `,
  ],
})
export class ConfirmComponent implements OnInit {
  @Input() wordsList: WordsItem[] = [];
  readonly nzModalData = inject(NZ_MODAL_DATA);
  constructor() {}

  wordString: string;

  ngOnInit() {
    this.wordsList = this.nzModalData.wordsList;
    this.wordString = this.wordsList.map((item) => item.word).join(', ');
  }
}
