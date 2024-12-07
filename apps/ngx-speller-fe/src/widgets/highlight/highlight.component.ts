import { ChangeDetectionStrategy, Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CapitalizeFirstLetterPipe } from '../../pipes/capitalize-first-letter.pipe';
import { SpeechComponent } from '../speech/speech.component';

@Component({
  selector: 'app-highlight',
  standalone: true,
  imports: [CapitalizeFirstLetterPipe, SpeechComponent],
  template: `
    <p>
      @if (includeHighLight >= 0) {
        {{ before }}
        <span
          class="highlight"
          [style]="{ fontWeight: 'bold', color: '#f44336', fontStyle: 'italic' }"
          >{{ highlightWord | capitalizeFirstLetter: includeHighLight === 0 }}</span
        >
        {{ after }}
      } @else {
        {{ example }}
      }
    </p>
    <app-speech [speechText]="example"></app-speech>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HighlightComponent implements OnChanges {
  @Input() highlightWord: string;
  @Input() example: string;
  before: string;
  after: string;
  hight: string;
  includeHighLight: number;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['highlightWord'] && changes['example']) {
      this.includeHighLight = this.example
        ? this.example.toLowerCase().indexOf(this.highlightWord.toLowerCase())
        : -1;
      if (this.includeHighLight >= 0) {
        this.before = this.example.slice(0, this.includeHighLight);
        this.after = this.example.slice(this.includeHighLight + this.highlightWord.length);
      }
    }
  }
}
