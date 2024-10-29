import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DbService } from '../../services/DataBase/db.service';
import { ZorroModule } from '../../zorro/zorro.module';
import { Store } from '@ngrx/store';
import { finalize, Observable, switchMap } from 'rxjs';
import { Settings } from '../../types';
import { CommonModule } from '@angular/common';

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
  setting$: Observable<Settings>;

  inputWords: string = '';
  loading = false;

  constructor() {
    this.setting$ = this.store.select('settings');
  }

  onSubmit() {
    this.loading = true;
    this.setting$
      .pipe(
        switchMap((setting) => {
          const apiType = setting.commonSettings.apiType;
          return this.db.addWordsToIndexDBByInput(this.inputWords, apiType);
        }),
        finalize(() => (this.loading = false)),
      )
      .subscribe(() => (this.inputWords = '')); // clear input after submit
  }
}
