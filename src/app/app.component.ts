import { Component, HostListener } from '@angular/core';

type AlphabetItem = {
  letter: string;
  word: string;
  emoji: string;
};

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  readonly alphabet: AlphabetItem[] = [
    { letter: 'A', word: 'Ant', emoji: '🐜' },
    { letter: 'B', word: 'Bear', emoji: '🐻' },
    { letter: 'C', word: 'Cat', emoji: '🐱' },
    { letter: 'D', word: 'Dog', emoji: '🐶' },
    { letter: 'E', word: 'Elephant', emoji: '🐘' },
    { letter: 'F', word: 'Fish', emoji: '🐠' },
    { letter: 'G', word: 'Giraffe', emoji: '🦒' },
    { letter: 'H', word: 'Horse', emoji: '🐴' },
    { letter: 'I', word: 'Ice cream', emoji: '🍦' },
    { letter: 'J', word: 'Jet', emoji: '✈️' },
    { letter: 'K', word: 'Kangaroo', emoji: '🦘' },
    { letter: 'L', word: 'Lion', emoji: '🦁' },
    { letter: 'M', word: 'Monkey', emoji: '🐵' },
    { letter: 'N', word: 'Nose', emoji: '👃' },
    { letter: 'O', word: 'Octopus', emoji: '🐙' },
    { letter: 'P', word: 'Panda', emoji: '🐼' },
    { letter: 'Q', word: 'Queen', emoji: '👑' },
    { letter: 'R', word: 'Rabbit', emoji: '🐰' },
    { letter: 'S', word: 'Star', emoji: '⭐' },
    { letter: 'T', word: 'Tiger', emoji: '🐯' },
    { letter: 'U', word: 'Umbrella', emoji: '☂️' },
    { letter: 'V', word: 'Volcano', emoji: '🌋' },
    { letter: 'W', word: 'Whale', emoji: '🐳' },
    { letter: 'X', word: 'Xylophone', emoji: '🎼' },
    { letter: 'Y', word: 'Yarn', emoji: '🧶' },
    { letter: 'Z', word: 'Zebra', emoji: '🦓' },
  ];

  readonly itemByLetter = new Map(
    this.alphabet.map((item) => [item.letter.toLowerCase(), item]),
  );

  selectedLetter: AlphabetItem = this.alphabet[0];
  spokenText = 'Press any letter to begin';

  @HostListener('window:keydown', ['$event'])
  handleKeydown(event: KeyboardEvent): void {
    const key = event.key.toUpperCase();
    const item = this.itemByLetter.get(key.toLowerCase());

    if (!item || event.repeat) {
      return;
    }

    event.preventDefault();
    this.playLetter(item);
  }

  playLetter(item: AlphabetItem): void {
    this.selectedLetter = item;
    this.spokenText = `${item.letter} for ${item.word}`;
    this.speak(this.spokenText);
  }

  private speak(text: string): void {
    if (!('speechSynthesis' in window)) {
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.rate = 0.9;
    utterance.pitch = 1.1;
    window.speechSynthesis.speak(utterance);
  }
}
