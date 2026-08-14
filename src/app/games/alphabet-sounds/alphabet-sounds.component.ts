import { Component, HostListener, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ALPHABET, AlphabetItem } from '../../shared/alphabet.data';

@Component({ selector: 'app-alphabet-sounds', standalone: true, templateUrl: './alphabet-sounds.component.html' })
export class AlphabetSoundsComponent {
  private readonly router = inject(Router);
  readonly alphabet = ALPHABET;
  readonly itemByLetter = new Map(ALPHABET.map(item => [item.letter, item]));
  selectedLetter = ALPHABET[0];
  spokenText = 'Press any letter to begin';

  @HostListener('window:keydown', ['$event'])
  handleKeydown(event: KeyboardEvent): void {
    const item = this.itemByLetter.get(event.key.toUpperCase());
    if (!item || event.repeat) return;
    event.preventDefault();
    this.playLetter(item);
  }
  playLetter(item: AlphabetItem): void {
    this.selectedLetter = item;
    this.spokenText = `${item.letter} for ${item.word}`;
    window.speechSynthesis?.cancel();
    const voice = new SpeechSynthesisUtterance(this.spokenText);
    voice.lang = 'en-US'; voice.rate = .9; voice.pitch = 1.1;
    window.speechSynthesis?.speak(voice);
  }
  goBack(): void { window.speechSynthesis?.cancel(); void this.router.navigate(['/dashboard']); }
}
