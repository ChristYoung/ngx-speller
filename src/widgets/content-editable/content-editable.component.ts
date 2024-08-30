import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-content-editable',
  standalone: true,
  imports: [],
  template: `
    <div class="__editableContent" [contentEditable]="true"></div>
  `,
  styleUrl: './content-editable.component.less'
})
export class ContentEditableComponent implements OnInit {

  @Input() htmlContent: string = '';

  ngOnInit(): void {
  }

}
