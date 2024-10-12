import { Pipe, PipeTransform } from '@angular/core';
import { SafeHtml, DomSanitizer } from '@angular/platform-browser';

@Pipe({
  name: 'trustHtml',
  standalone: true,
})
export class TrustHtmlPipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) {}

  transform(value: string): SafeHtml {
    if (!value || value === '' || !value.includes('<')) {
      return value;
    }
    return this.sanitizer.bypassSecurityTrustHtml(value);
  }
}
