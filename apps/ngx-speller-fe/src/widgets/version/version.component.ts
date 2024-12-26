import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-version',
  standalone: true,
  imports: [],
  template: ` <footer>v1.4.7 &#64;copyright 2023</footer> `,
  styles: [
    `
      footer {
        width: 100%;
        text-align: center;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VersionComponent {}
