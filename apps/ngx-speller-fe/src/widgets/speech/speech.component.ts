import { ChangeDetectorRef, Component, inject, Input } from '@angular/core';
import { AzureSpeechService } from '../../services/Azure/azure-speech.service';
import { ZorroModule } from '../../zorro/zorro.module';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-speech',
  standalone: true,
  imports: [ZorroModule],
  template: `
    <button
      nz-button
      (click)="triggerSpeech(speechText)"
      [nzLoading]="loading"
      nzType="default"
      nzShape="circle"
    >
      <span nz-icon nzType="sp:sound" nzTheme="outline"></span>
    </button>
  `,
  styleUrl: './speech.component.less',
})
export class SpeechComponent {
  @Input({ required: true }) speechText: string = '';
  speechService = inject(AzureSpeechService);
  _cd = inject(ChangeDetectorRef);
  loading: boolean = false;

  triggerSpeech(sentence: string): void {
    this.loading = true;
    this.speechService
      .speakText(sentence)
      .pipe(
        finalize(() => {
          this.loading = false;
          this._cd.markForCheck();
        }),
      )
      .subscribe(() => {
        console.log('finished speak');
      });
  }
}
