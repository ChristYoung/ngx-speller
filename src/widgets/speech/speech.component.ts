import { Component, Input } from '@angular/core';
import { PreventButtonDefaultDirective } from '../../directives/prevent-button-default.directive';
import { ZorroModule } from '../../zorro/zorro.module';

@Component({
  selector: 'app-speech',
  standalone: true,
  imports: [ZorroModule, PreventButtonDefaultDirective],
  template: `
    <button
      nz-button
      (click)="triggerSpeech(speechText)"
      nzType="default"
      nzShape="circle"
      appPreventButtonDefault
    >
      <span nz-icon nzType="sound" nzTheme="outline"></span>
    </button>
  `,
  styleUrl: './speech.component.less',
})
export class SpeechComponent {
  @Input({ required: true }) speechText: string = '';

  triggerSpeech(text: string): void {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.pitch = 1;
    utterance.rate = 1;
    window.speechSynthesis.speak(utterance);
  }
}
