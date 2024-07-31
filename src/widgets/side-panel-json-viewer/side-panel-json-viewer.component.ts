import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { WordsItem } from '../../types';
import { NgxJsonViewerModule } from 'ngx-json-viewer';

@Component({
  selector: 'app-side-panel-json-viewer',
  standalone: true,
  imports: [CommonModule, NgxJsonViewerModule],
  template: `
    <div>
      <ngx-json-viewer [json]="dataSource"></ngx-json-viewer>
    </div>
  `,
  styleUrl: './side-panel-json-viewer.component.less',
})
export class SidePanelJsonViewerComponent {
  @Input() dataSource: WordsItem[] = [];
}
