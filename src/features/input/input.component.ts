import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { NzMessageService } from 'ng-zorro-antd/message';
import { catchError, EMPTY, Observable, switchMap } from 'rxjs';
import { DbService } from '../../services/DataBase/db.service';
import { Settings } from '../../types';
import { ZorroModule } from '../../zorro/zorro.module';

@Component({
  selector: 'app-input',
  standalone: true,
  imports: [ZorroModule, FormsModule, CommonModule],
  template: `
    <div class="container">
      <textarea
        rows="14"
        nz-input
        [placeholder]="'Just input any words that you are not familiar'"
        [(ngModel)]="inputWords"
      ></textarea>
      <div class="button_container">
        <button
          nz-button
          type="button"
          nzType="primary"
          [class.spinner]="loading"
          disabled="{{ !inputWords || loading }}"
          (click)="onSubmit()"
        >
          Submit
        </button>
        <button nz-button type="button" (click)="inputWords = ''">Clear</button>
      </div>
    </div>
  `,
  styleUrl: './input.component.less',
})
export class InputComponent {
  private db = inject(DbService);
  private store = inject(Store);
  private nzMessage = inject(NzMessageService);
  setting$: Observable<Settings>;

  inputWords: string = '';
  loading = false;

  constructor() {
    this.setting$ = this.store.select('settings');
  }

  onSubmit(): void {
    this.loading = true;
    this.setting$
      .pipe(
        switchMap((setting) => {
          const apiType = setting.commonSettings.apiType;
          return this.db.addWordsToIndexDBByInput(this.inputWords, apiType);
        }),
        catchError((e) => {
          console.error('input word error:', e);
          this.loading = false;
          const errorMessage =
            e?.target?.error?.message ?? 'Input word error, please try again later.';
          this.nzMessage.error(errorMessage);
          return EMPTY;
        }),
      )
      .subscribe(() => {
        this.loading = false;
        this.inputWords = '';
      }); // clear input after submit
  }
}
