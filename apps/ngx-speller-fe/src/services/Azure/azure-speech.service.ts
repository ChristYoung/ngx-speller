import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
// import * as SpeechSDK from 'microsoft-cognitiveservices-speech-sdk';

declare const SpeechSDK: any;

@Injectable({
  providedIn: 'root',
})
export class AzureSpeechService {
  private readonly subscriptionKey = import.meta.env['NG_APP_AZURE'];
  private readonly region = import.meta.env['NG_APP_REGION'];

  synthesizer: any;

  constructor() {}

  speak(sentence: string): void {
    const speechConfig = SpeechSDK.SpeechConfig.fromSubscription(this.subscriptionKey, this.region);
    this.synthesizer = new SpeechSDK.SpeechSynthesizer(speechConfig);

    this.synthesizer.speakTextAsync(
      sentence,
      (result) => {
        if (result.reason === SpeechSDK.ResultReason.SynthesizingAudioCompleted) {
          console.log('Synthesis finished.');
        } else {
          console.error('Speech synthesis failed:', result.errorDetails);
        }
        this.synthesizer.close();
        this.synthesizer = undefined;
      },
      (error) => {
        console.error('Error during synthesis:', error);
        this.synthesizer.close();
        this.synthesizer = undefined;
      },
    );
  }

  speakText(text: string): Observable<any> {
    return new Observable((observer) => {
      const speechConfig = SpeechSDK.SpeechConfig.fromSubscription(
        this.subscriptionKey,
        this.region,
      );
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
  }

  destroySpeaker(): void {
    if (this.synthesizer) {
      this.synthesizer.close();
      this.synthesizer = undefined;
    }
  }
}
