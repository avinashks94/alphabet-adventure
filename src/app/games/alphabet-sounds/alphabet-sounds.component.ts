import { Component, HostListener, OnDestroy, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ALPHABET, AlphabetItem } from '../../shared/alphabet.data';
import { ChildSpeechService } from '../../shared/child-speech.service';

@Component({
  selector: 'app-alphabet-sounds',
  standalone: true,
  templateUrl: './alphabet-sounds.component.html',
})
export class AlphabetSoundsComponent implements OnDestroy {
  private readonly router = inject(Router);
  private readonly speech = inject(ChildSpeechService);
  readonly alphabet = ALPHABET;
  readonly itemByLetter = new Map(ALPHABET.map((item) => [item.letter, item]));
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
    this.speech.speak(this.spokenText);
  }
  ngOnDestroy(): void { this.speech.cancel(); }

  goBack(): void {
    this.speech.cancel();
    void this.router.navigate(['/dashboard']);
  }
}
