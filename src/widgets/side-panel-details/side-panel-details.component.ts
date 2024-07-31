import { CommonModule } from '@angular/common';
import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
  inject,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DbService } from '../../services/DataBase/db.service';
import { ExampleItem, WordsItem } from '../../types';
import { ZorroModule } from '../../zorro/zorro.module';
import { HighlightComponent } from '../highlight/highlight.component';
import { HornComponent } from '../horn/horn.component';

@Component({
  selector: 'app-side-panel-details',
  standalone: true,
  template: `
    @if (wordItem) {
    <div class="details_container">
      <h3 class="word_title">{{ wordItem.word }}</h3>
      <div class="word_details">
        <span>/{{ wordItem.phonetic }}/</span>
        <app-horn [word]="wordItem.word" [preloadSrc]="true"></app-horn>
      </div>
      <div class="explains_container">
        {{ wordItem.explanations.join(';') }}
      </div>
      <div class="examples_container">
        @for (item of examples; track $index) {
        <div class="examples_item">
          <p class="en">
            <app-highlight
              [highlightWord]="wordItem.word"
              [example]="item.en"
            ></app-highlight>
          </p>
          <p class="zh">{{ item.zh }}</p>
          <span
            class="delete_example"
            nz-icon
            nz-tooltip
            [nzType]="'delete'"
            [nzTooltipTitle]="'Remove this example'"
            (click)="removeExample($index)"
          ></span>
        </div>
        }
      </div>
      <div class="add_new_examples">
        <div class="example-full-width">
          <textarea
            nz-input
            [nzAutosize]="{ minRows: 2, maxRows: 6 }"
            placeholder="input your English example"
            [(ngModel)]="inputEnglishExample"
            nzAutosize
          ></textarea>
        </div>
        <div class="example-full-width">
          <textarea
            nz-input
            [nzAutosize]="{ minRows: 2, maxRows: 6 }"
            placeholder="input your Chinese example"
            [(ngModel)]="inputChineseExample"
            nzAutosize
          ></textarea>
        </div>
        <button
          type="button"
          nz-button
          nzType="primary"
          (click)="clickAddExample()"
          [disabled]="!inputChineseExample || !inputEnglishExample"
        >
          Add an example
        </button>
      </div>
    </div>
    }
  `,
  styleUrl: './side-panel-details.component.less',
  imports: [
    CommonModule,
    HornComponent,
    HighlightComponent,
    FormsModule,
    ZorroModule,
  ],
})
export class SidePanelDetailsComponent implements OnInit {
  @Input({ required: true }) wordItem: WordsItem;
  db = inject(DbService);
  inputEnglishExample: string;
  inputChineseExample: string;
  examples: ExampleItem[] = [];

  ngOnInit(): void {
    this.examples = this.wordItem.examples || [];
  }

  clickAddExample(): void {
    const currentExamples: ExampleItem[] = [
      ...this.examples,
      { zh: this.inputChineseExample, en: this.inputEnglishExample },
    ];
    this.updateCurrentExamples(currentExamples);
  }

  removeExample(index: number): void {
    this.examples = this.examples.filter((_, _index) => _index !== index);
    this.updateCurrentExamples(this.examples, 'remove');
  }

  private updateCurrentExamples(
    currentExamples: ExampleItem[],
    type: 'add' | 'remove' = 'add'
  ): void {
    this.db
      .updateWordItemFromIndexDB(
        {
          ...this.wordItem,
          examples: [...currentExamples],
        },
        true
      )
      .subscribe(() => {
        if (type === 'add') {
          this.inputChineseExample = '';
          this.inputEnglishExample = '';
        }
        console.log('currentExamples', currentExamples);
        this.examples = [...currentExamples];
      });
  }
}
