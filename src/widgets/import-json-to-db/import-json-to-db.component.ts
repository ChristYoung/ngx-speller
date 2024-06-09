import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { DbService } from '../../services/DataBase/db.service';
import { FileService } from '../../services/file.service';
import { WholeIndexDBConfig } from '../../types';
import { ZorroModule } from '../../zorro/zorro.module';

@Component({
  selector: 'app-import-json-to-db',
  standalone: true,
  imports: [CommonModule, ZorroModule],
  template: ` <button color="accent" nz-button (click)="importClicked()">
    Import from JSON file
  </button>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ImportJsonToDbComponent {
  private fileReader = inject(FileService);
  private db = inject(DbService);

  importClicked(): void {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (event: Event) => {
      const files = (event.target as HTMLInputElement).files;
      if (files && files.length > 0) {
        this.fileReader.readJSONFile(files[0]).subscribe({
          next: (data: WholeIndexDBConfig) => {
            console.log('jsonFile', data);
            this.db.addWordsToIndexDBByJSONFile(data);
          },
          error: (error) => {
            console.error(error);
          },
        });
      }
    };
    input.click();
  }
}
