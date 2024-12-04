import { Injectable } from '@angular/core';
import * as SpeechSDK from 'microsoft-cognitiveservices-speech-sdk';

@Injectable({
  providedIn: 'root',
})
export class AzureSpeechService {
  private readonly subscriptionKey = import.meta.env['NG_APP_AZURE'];
  private readonly region = import.meta.env['NG_APP_REGION'];

  constructor() {}

  speak(sentence: string): void {
    const speechConfig = SpeechSDK.SpeechConfig.fromSubscription(this.subscriptionKey, this.region);
    speechConfig.speechSynthesisVoiceName = 'en-US-AriaNeural';
    const synthesizer = new SpeechSDK.SpeechSynthesizer(speechConfig);

    synthesizer.speakTextAsync(
      sentence,
      (result) => {
        if (result.reason === SpeechSDK.ResultReason.SynthesizingAudioCompleted) {
          console.log('Synthesis finished.');
        } else {
          console.error('Speech synthesis failed:', result.errorDetails);
        }
        synthesizer.close();
      },
      (error) => {
        console.error('Error during synthesis:', error);
        synthesizer.close();
      },
    );
  }
}
