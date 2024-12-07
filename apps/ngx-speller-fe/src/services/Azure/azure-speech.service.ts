import { inject, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, switchMap } from 'rxjs';
import { Settings } from '../../types';
// import * as SpeechSDK from 'microsoft-cognitiveservices-speech-sdk';

declare const SpeechSDK: any;

@Injectable({
  providedIn: 'root',
})
export class AzureSpeechService {
  private readonly subscriptionKey = import.meta.env['NG_APP_AZURE'];
  private readonly region = import.meta.env['NG_APP_REGION'];
  private store = inject(Store);
  setting$: Observable<Settings>;

  synthesizer: any;

  constructor() {
    this.setting$ = this.store.select('settings');
  }

  speakText(text: string): Observable<any> {
    return this.setting$.pipe(
      switchMap((settings) => {
        const voiceName = settings.commonSettings.voiceName;
        return new Observable((observer) => {
          const speechConfig = SpeechSDK.SpeechConfig.fromSubscription(
            this.subscriptionKey,
            this.region,
          );
          // speechConfig.speechSynthesisVoiceName =
          //   'Microsoft Server Speech Text to Speech Voice (en-US, BrianNeural)';
          console.log('voiceName', voiceName);
          speechConfig.speechSynthesisVoiceName = voiceName;
          this.synthesizer = new SpeechSDK.SpeechSynthesizer(speechConfig);
          this.synthesizer.speakTextAsync(
            text,
            (result) => {
              if (result.reason === SpeechSDK.ResultReason.SynthesizingAudioCompleted) {
                console.log('Synthesis finished.');
                observer.next(result);
                observer.complete();
              } else {
                console.error('Speech synthesis failed:', result.errorDetails);
                observer.error(result.errorDetails);
              }
              this.synthesizer.close();
              this.synthesizer = undefined;
            },
            (error) => {
              console.error('Error during synthesis:', error);
              observer.error(error);
              this.synthesizer.close();
              this.synthesizer = undefined;
            },
          );
        });
      }),
    );
  }

  destroySpeaker(): void {
    if (this.synthesizer) {
      this.synthesizer.close();
      this.synthesizer = undefined;
    }
  }
}
