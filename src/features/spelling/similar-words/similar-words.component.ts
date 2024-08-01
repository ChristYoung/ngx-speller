import { CommonModule } from '@angular/common';
import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { ZorroModule } from '../../../zorro/zorro.module';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-similar-words',
  standalone: true,
  imports: [CommonModule, ZorroModule, FormsModule],
  template: `
    <nz-tag
      *ngFor="let tag of tags; let i = index"
      [nzMode]="freezed ? 'default' : 'closeable'"
      [nzColor]="colorMaps[i % colorMaps.length]"
      (nzOnClose)="handleClose(tag)"
    >
      <a
        href="https://dict.youdao.com/jsonapi?jsonversion=2&client=mobile&q={{
          tag
        }}"
        target="_blank"
        >{{ tag }}</a
      >
    </nz-tag>
    @if (!freezed) {
    <nz-tag
      *ngIf="!inputVisible"
      class="editable-tag"
      nzNoAnimation
      (click)="showInput()"
    >
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
  `,
  styles: [
    `
      .editable-tag {
        background: rgb(255, 255, 255);
        border-style: dashed;
      }
    `,
  ],
})
export class SimilarWordsComponent {
  @Input({ required: true }) tags = [];
  @Input() freezed = false;
  @Output() onTagsChange = new EventEmitter();
  @ViewChild('inputElement', { static: false }) inputElement?: ElementRef;
  inputVisible = false;
  inputValue = '';
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

  handleClose(removedTag: {}): void {
    this.tags = this.tags.filter((tag) => tag !== removedTag);
    this.onTagsChange.emit(this.tags);
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
      this.onTagsChange.emit(this.tags);
    }
    this.inputValue = '';
    this.inputVisible = false;
  }
}
