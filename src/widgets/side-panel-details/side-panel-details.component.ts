// TODO: Need to confirm whether we should introduce Rich text plugin like Quill or CKEditor here.
// Quill2: https://slab.com/blog/announcing-quill-2-0/
import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { YOU_DAO_API } from '../../core/constant';
import { SimilarWordsComponent } from '../../features/spelling/similar-words/similar-words.component';
import { DbService } from '../../services/DataBase/db.service';
import { ExampleItem, WordsItem } from '../../types';
import { ZorroModule } from '../../zorro/zorro.module';
import { ContentEditableComponent } from '../content-editable/content-editable.component';
import { HighlightComponent } from '../highlight/highlight.component';
import { HornComponent } from '../horn/horn.component';
import { SpeechComponent } from '../speech/speech.component';

@Component({
  selector: 'app-side-panel-details',
  standalone: true,
  template: `
    @if (wordItem) {
      <div class="details_container">
        <h3 nz-typography class="word_title" (click)="redirectToDetails(wordItem.word)">
          {{ wordItem.word }}
        </h3>
        <div class="word_details">
          <span>/{{ wordItem.phonetic }}/</span>
          <app-horn [word]="wordItem.word" [preloadSrc]="true"></app-horn>
        </div>
        <div class="detail_card similar_words">
          <h5 class="card_title">Similar</h5>
          <app-similar-words
            [tags]="similarWords"
            (tagsChange)="similarWordsChange($event)"
            [alignWay]="'flex-start'"
          ></app-similar-words>
        </div>
        <div class="detail_card">
          <h5 class="card_title">Definition</h5>
          <app-content-editable
            style="text-align: center; margin-bottom: 10px; display: block;"
            [htmlContent]="wordItem.explanation || wordItem['explanations']"
            (contentChange)="updateExplanations($event)"
          ></app-content-editable>
          <app-content-editable
            style="text-align: center; display: block;"
            [htmlContent]="wordItem.eng_explanation"
            (contentChange)="updateEnglishExplanations($event)"
          ></app-content-editable>
        </div>
        <div class="detail_card">
          <h5 class="card_title">Examples</h5>
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
                <!-- <app-speech [speechText]="item.en"></app-speech> -->
              </div>
            }
          </div>
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
    SimilarWordsComponent,
    ContentEditableComponent,
    SpeechComponent,
  ],
})
export class SidePanelDetailsComponent implements OnInit {
  @Input({ required: true }) wordItem: WordsItem;
  db = inject(DbService);
  inputEnglishExample: string;
  inputChineseExample: string;
  examples: ExampleItem[] = [];
  similarWords: string[] = [];
  contentEditable = false;
  englishContentEditable = false;

  ngOnInit(): void {
    this.examples = this.wordItem.examples || [];
    this.similarWords = this.wordItem.similar_words || [];
  }

  redirectToDetails(word: string): void {
    window.open(`${YOU_DAO_API}${word}`, '_blank');
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

  updateExplanations(newExplanations: string): void {
    this.db
      .updateWordItemFromIndexDB(
        {
          ...this.wordItem,
          explanation: newExplanations,
        },
        true,
      )
      .subscribe(() => {});
  }

  updateEnglishExplanations(newEnglishExplanations: string): void {
    this.db
      .updateWordItemFromIndexDB(
        {
          ...this.wordItem,
          eng_explanation: newEnglishExplanations,
        },
        true,
      )
      .subscribe(() => {});
  }

  similarWordsChange(tags: string[]): void {
    this.similarWords = [...tags];
    this.updateCurrentSimilarWords(this.similarWords);
  }

  private updateCurrentSimilarWords(currentTags: string[]): void {
    this.db
      .updateWordItemFromIndexDB(
        {
          ...this.wordItem,
          similar_words: [...currentTags],
        },
        true,
      )
      .subscribe(() => {
        this.similarWords = [...currentTags];
      });
  }

  private updateCurrentExamples(
    currentExamples: ExampleItem[],
    type: 'add' | 'remove' = 'add',
  ): void {
    this.examples = [...currentExamples];
    if (type === 'add') {
      this.inputChineseExample = '';
      this.inputEnglishExample = '';
    }
    this.db
      .updateWordItemFromIndexDB(
        {
          ...this.wordItem,
          examples: [...currentExamples],
        },
        true,
      )
      .subscribe(() => {});
  }
}
