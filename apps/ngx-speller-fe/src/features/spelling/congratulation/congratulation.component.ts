import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

import { ZorroModule } from '../../../zorro/zorro.module';

@Component({
  selector: 'app-congratulation',
  standalone: true,
  imports: [CommonModule, ZorroModule],
  template: `
    <div>
      <p>Congratulations! You have finished the quiz!</p>
    </div>
  `,
  styleUrl: './congratulation.component.less',
})
export class CongratulationComponent {
  constructor() {}
}
