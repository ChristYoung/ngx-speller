import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  inject,
} from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ZorroModule } from '../../zorro/zorro.module';
import { ImportJsonToDbComponent } from '../import-json-to-db/import-json-to-db.component';

@Component({
  selector: 'app-empty',
  standalone: true,
  template: `
    <nz-empty
      nzNotFoundImage="https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg"
      [nzNotFoundContent]="contentTpl"
      [nzNotFoundFooter]="footerTpl"
    >
      <ng-template #contentTpl>
        <span> {{ emptyTips }} </span>
      </ng-template>
      <ng-template #footerTpl>
        <button nz-button nzType="primary" (click)="navigate()">
          Go to input new words.
        </button>
        <app-import-json-to-db></app-import-json-to-db>
      </ng-template>
    </nz-empty>
  `,
  styles: [
    `
      :host {
        display: flex;
        height: 100vh;
        align-items: center;
        justify-content: center;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, ZorroModule, RouterLink, ImportJsonToDbComponent],
})
export class EmptyComponent {
  private router = inject(Router);
  @Input({ required: true }) emptyTips: string;

  navigate(): void {
    this.router.navigate(['../layout/input']);
  }
}
