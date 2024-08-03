import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ZorroModule } from '../../../zorro/zorro.module';
import { canReach24, ResultOf24 } from '../../../utils';

@Component({
  selector: 'app-easter-eggs',
  standalone: true,
  imports: [CommonModule, FormsModule, ZorroModule],
  template: `
    <div class="24_container" style="padding: 20px; margin: 30px auto;">
      <h3>输入任意4个数，计算24点</h3>
      <div class="number_container" style="margin-bottom: 20px;">
        <nz-input-number
          [(ngModel)]="value1"
          [nzMin]="1"
          [nzMax]="10"
          [nzStep]="1"
        ></nz-input-number>
        <nz-input-number
          [(ngModel)]="value2"
          [nzMin]="1"
          [nzMax]="10"
          [nzStep]="1"
        ></nz-input-number>
        <nz-input-number
          [(ngModel)]="value3"
          [nzMin]="1"
          [nzMax]="10"
          [nzStep]="1"
        ></nz-input-number>
        <nz-input-number
          [(ngModel)]="value4"
          [nzMin]="1"
          [nzMax]="10"
          [nzStep]="1"
        ></nz-input-number>
      </div>
      <button
        nz-button
        nzType="primary"
        [disabled]="!value1 || !value2 || !value3 || !value4"
        (click)="onCalculateClick()"
      >
        Calculate
      </button>
      @if (resultOf24?.success) {
      <h3>{{ resultOf24.expression }}</h3>
      } @else {
      <h3>Can not calculate to 24</h3>
      }
    </div>
  `,
  styleUrl: './easter-eggs.component.less',
})
export class EasterEggsComponent {
  value1 = 0;
  value2 = 0;
  value3 = 0;
  value4 = 0;
  resultOf24: ResultOf24;

  onCalculateClick() {
    this.resultOf24 = canReach24([
      this.value1,
      this.value2,
      this.value3,
      this.value4,
    ]);
  }
}
