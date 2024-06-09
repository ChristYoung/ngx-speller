import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DbService } from '../../services/DataBase/db.service';
import { ZorroModule } from '../../zorro/zorro.module';

@Component({
  selector: 'app-input',
  standalone: true,
  imports: [ZorroModule, FormsModule],
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
  constructor(private db: DbService) {}
  inputWords: string = '';
  loading = false;
  onSubmit() {
    this.loading = true;
    this.db.addWordsToIndexDBByInput(this.inputWords).subscribe(() => {
      this.loading = false;
      this.inputWords = '';
    });
  }
}
