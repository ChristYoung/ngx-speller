import { CommonModule } from '@angular/common';
import { Component, ElementRef, Input, OnInit, ViewChild, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SimilarWordsComponent } from '../../features/spelling/similar-words/similar-words.component';
import { DbService } from '../../services/DataBase/db.service';
import { ExampleItem, WordsItem } from '../../types';
import { ZorroModule } from '../../zorro/zorro.module';
import { HighlightComponent } from '../highlight/highlight.component';
import { HornComponent } from '../horn/horn.component';
import { YOU_DAO_API } from '../../core/constant';

@Component({
  selector: 'app-side-panel-details',
  standalone: true,
  template: `
    @if (wordItem) {
    <div class="details_container">
      <h3 class="word_title" (click)="redirectToDetails(wordItem.word)">
        {{ wordItem.word }}
      </h3>
      <div class="word_details">
        <span>/{{ wordItem.phonetic }}/</span>
        <app-horn [word]="wordItem.word" [preloadSrc]="true"></app-horn>
      </div>
      <div class="similar_words">
        <app-similar-words
          [tags]="similarWords"
          (onTagsChange)="similarWordsChange($event)"
        ></app-similar-words>
      </div>
      <div class="explains_container"
        #editableContent
        [class.editable_content]="contentEditable"
        [contentEditable]="contentEditable">
        {{ wordItem.explanation }}
        <span class="edit_explanations_icon" nz-icon nzType="{{contentEditable ? 'check' : 'edit'}}" nzTheme="outline" (click)="updateExplanations()"></span>
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
    SimilarWordsComponent,
  ],
})
export class SidePanelDetailsComponent implements OnInit {
  @Input({ required: true }) wordItem: WordsItem;
  @ViewChild('editableContent', { static: false}) editableContent: ElementRef;
  db = inject(DbService);
  inputEnglishExample: string;
  inputChineseExample: string;
  examples: ExampleItem[] = [];
  similarWords: string[] = [];
  contentEditable = false;

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

  updateExplanations(): void {
    this.contentEditable = !this.contentEditable;
    console.log('this.contentEditable',this.contentEditable)
    if (!this.contentEditable) {
      const newExplanations = (this.editableContent.nativeElement as HTMLDivElement).innerText;
      console.log('newExplanations',newExplanations);
      this.db.updateWordItemFromIndexDB(
        {
          ...this.wordItem,
          explanation: newExplanations,
        },
        true
      ).subscribe(() => {});
    }
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
        true
      )
      .subscribe(() => {
        this.similarWords = [...currentTags];
      });
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
