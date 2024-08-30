import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { TrustHtmlPipe } from '../../pipes/trust-html.pipe';

@Component({
  selector: 'app-content-editable',
  standalone: true,
  imports: [TrustHtmlPipe],
  template: `
    <div class="__editableContent"
    [tabIndex]="0"
    [contentEditable]="true"
    [innerHTML]="htmlContent | trustHtml"
    (blur)="onBlur()"
    #tplInput
   ></div>
  `,
  styleUrl: './content-editable.component.less'
})
export class ContentEditableComponent implements OnInit {

  @Input({required: true}) htmlContent: string = '';
  @Output() contentChange = new EventEmitter<string>();

  @ViewChild('tplInput', { static: true }) private tplInputRef: ElementRef;

  ngOnInit(): void {
  }

  onBlur(): void {
    const newContent = this.tplInputRef.nativeElement.innerHTML;
    if (newContent !== this.htmlContent) {
      this.contentChange.emit(this.tplInputRef.nativeElement.innerHTML);
    }
  }

}
