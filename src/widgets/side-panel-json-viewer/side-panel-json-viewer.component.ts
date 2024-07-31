import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { WordsItem } from '../../types';
import { NgxJsonViewerModule } from 'ngx-json-viewer';
import { ZorroModule } from '../../zorro/zorro.module';

@Component({
  selector: 'app-side-panel-json-viewer',
  standalone: true,
  imports: [CommonModule, NgxJsonViewerModule, ZorroModule],
  template: `
    <div>
      <button nz-button (click)="onDownloadBtnClick()">Download</button>
      <ngx-json-viewer [json]="dataSource"></ngx-json-viewer>
    </div>
  `,
  styleUrl: './side-panel-json-viewer.component.less',
})
export class SidePanelJsonViewerComponent {
  @Input() dataSource: WordsItem[] = [];

  onDownloadBtnClick() {
    console.log('Download button clicked');
  }
}
