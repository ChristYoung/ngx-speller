import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';

@Component({
  selector: 'app-highlight',
  standalone: true,
  imports: [],
  template: `
    @if (includeHighLight > 0) {
    {{ before }}
    <span
      class="highlight"
      [style]="{ fontWeight: 'bold', color: '#f44336', fontStyle: 'italic' }"
      >{{ highlightWord }}</span
    >
    {{ after }}
    } @else {
    {{ example }}
    }
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
      if (this.includeHighLight > 0) {
        this.before = this.example.slice(0, this.includeHighLight);
        this.after = this.example.slice(
          this.includeHighLight + this.highlightWord.length
        );
      }
    }
  }
}
