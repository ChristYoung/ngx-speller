import { CommonModule } from '@angular/common';
import { Component, inject, Input, OnInit } from '@angular/core';
import { NgxJsonViewerModule } from 'ngx-json-viewer';
import { WordsItem } from '../../types';
import { ZorroModule } from '../../zorro/zorro.module';
import { FileService } from '../../services/file.service';

@Component({
  selector: 'app-side-panel-json-viewer',
  standalone: true,
  imports: [CommonModule, NgxJsonViewerModule, ZorroModule],
  template: `
    <div style="margin-bottom: 20px;">
      <button nz-button (click)="onDownloadBtnClick()">Download</button>
    </div>
    <div>
      <ngx-json-viewer [json]="dataSource"></ngx-json-viewer>
    </div>
  `,
  styleUrl: './side-panel-json-viewer.component.less',
})
export class SidePanelJsonViewerComponent implements OnInit {
  @Input() dataSource: WordsItem[] = [];
  fileService = inject(FileService);

  ngOnInit(): void {}

  onDownloadBtnClick() {
    this.fileService.exportJSONFile(this.dataSource, 'speller_data');
  }
}
