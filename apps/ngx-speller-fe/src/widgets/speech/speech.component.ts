import { Component, inject, Input } from '@angular/core';
import { PreventButtonDefaultDirective } from '../../directives/prevent-button-default.directive';
import { ZorroModule } from '../../zorro/zorro.module';
import { AzureSpeechService } from '../../services/Azure/azure-speech.service';

@Component({
  selector: 'app-speech',
  standalone: true,
  imports: [ZorroModule, PreventButtonDefaultDirective],
  template: `
    <button nz-button (click)="triggerSpeech(speechText)" nzType="default" nzShape="circle">
      <span nz-icon nzType="sp:sound" nzTheme="outline"></span>
    </button>
  `,
  styleUrl: './speech.component.less',
})
export class SpeechComponent {
  @Input({ required: true }) speechText: string = '';
  speechService = inject(AzureSpeechService);

  triggerSpeech(sentence: string): void {
    this.speechService.speak(sentence);
  }
}
