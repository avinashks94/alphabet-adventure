import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ChildSpeechService {
  speak(text: string): void {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const speech = new SpeechSynthesisUtterance(text);
    const voices = window.speechSynthesis.getVoices();
    speech.voice = voices.find((voice) =>
      /^en[-_]/i.test(voice.lang) && /samantha|zira|aria|ava|female|google uk english female/i.test(voice.name),
    ) ?? voices.find((voice) => /^en[-_]/i.test(voice.lang)) ?? null;
    speech.lang = speech.voice?.lang || 'en-US';
    speech.rate = 0.78;
    speech.pitch = 1.3;
    speech.volume = 1;
    window.speechSynthesis.speak(speech);
  }

  cancel(): void {
    window.speechSynthesis?.cancel();
  }
}