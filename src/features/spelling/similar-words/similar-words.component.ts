import { CommonModule } from '@angular/common';
import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { ZorroModule } from '../../../zorro/zorro.module';
import { FormsModule } from '@angular/forms';
import { YOU_DAO_API } from '../../../core/constant';

@Component({
  selector: 'app-similar-words',
  standalone: true,
  imports: [CommonModule, ZorroModule, FormsModule],
  template: `
    <div class="similar_words_container" [style.justify-content]="alignWay">
      <nz-tag
        class="tag_item"
        *ngFor="let tag of tags; let i = index"
        [nzMode]="freezed ? 'default' : 'closeable'"
        [nzColor]="colorMaps[i % colorMaps.length]"
        (nzOnClose)="handleClose(tag)"
      >
        <a href="{{ _youDaoApi }}{{ tag }}" target="_blank">{{ tag }}</a>
      </nz-tag>
      @if (!freezed) {
        <nz-tag *ngIf="!inputVisible" class="editable-tag" nzNoAnimation (click)="showInput()">
          <span nz-icon nzType="plus"></span>
          add new
        </nz-tag>
      }
      <input
        #inputElement
        nz-input
        nzSize="small"
        *ngIf="inputVisible"
        type="text"
        [(ngModel)]="inputValue"
        style="width: 78px;"
        (blur)="handleInputConfirm()"
        (keydown.enter)="handleInputConfirm()"
      />
    </div>
  `,
  styles: [
    `
      .editable-tag {
        background: rgb(255, 255, 255);
        border-style: dashed;
      }

      .similar_words_container {
        display: flex;
        margin: 10px 0;
        align-items: center;
        flex-wrap: wrap;
      }

      .tag_item {
        margin-top: 3px;
        margin-bottom: 3px;
      }
    `,
  ],
})
export class SimilarWordsComponent {
  @Input({ required: true }) tags: string[] = [];
  @Input() freezed = false;
  @Input() alignWay: 'flex-start' | 'center' = 'center';
  @Output() tagsChange = new EventEmitter();
  @ViewChild('inputElement', { static: false }) inputElement?: ElementRef;
  inputVisible = false;
  inputValue = '';
  _youDaoApi = YOU_DAO_API;
  colorMaps = [
    'magenta',
    'red',
    'volcano',
    'orange',
    'gold',
    'lime',
    'green',
    'cyan',
    'blue',
    'geekblue',
    'purple',
  ];

  handleClose(removedTag: string): void {
    this.tags = this.tags.filter((tag) => tag !== removedTag);
    this.tagsChange.emit(this.tags);
  }

  showInput(): void {
    this.inputVisible = true;
    setTimeout(() => {
      this.inputElement?.nativeElement.focus();
    }, 10);
  }

  handleInputConfirm(): void {
    if (this.inputValue && this.tags.indexOf(this.inputValue) === -1) {
      this.tags = [...this.tags, this.inputValue];
      this.tagsChange.emit(this.tags);
    }
    this.inputValue = '';
    this.inputVisible = false;
  }
}
