import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
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
        <nz-space>
          <button nz-button nzType="primary" *nzSpaceItem (click)="navigate()">
            Go to input new words.
          </button>
          <app-import-json-to-db
            *nzSpaceItem
            (uploadedDone)="uploadedDone.emit()"
          ></app-import-json-to-db>
        </nz-space>
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
  @Output() uploadedDone = new EventEmitter<void>();

  navigate(): void {
    this.router.navigate(['../layout/input']);
  }
}
