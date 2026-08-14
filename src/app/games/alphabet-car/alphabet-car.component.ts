import { Component, HostListener, inject, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { ALPHABET } from '../../shared/alphabet.data';

type StopPosition = { x: number; y: number };

@Component({
  selector: 'app-alphabet-car',
  standalone: true,
  templateUrl: './alphabet-car.component.html',
  styleUrl: './alphabet-car.component.css',
  styles: [
    '.loop-car-wrap{transition:left .2s linear,top .2s linear!important}',
    '.selected-letter-card{display:flex;align-items:center;gap:10px}.status-tree{font-size:2rem;filter:drop-shadow(0 3px 2px #52723855)}.selected-letter-copy{display:flex;align-items:center;gap:9px}.selected-letter-copy small{font-weight:800;color:#82734b;text-transform:uppercase;letter-spacing:.08em;font-size:.66rem}.selected-letter-badge{display:grid;place-items:center;width:44px;height:44px;border-radius:14px;background:linear-gradient(135deg,#7658e9,#ff4f87);color:#fff;font-size:1.75rem;line-height:1;box-shadow:0 5px 0 #4932a5,0 8px 16px #553acb3d;text-shadow:0 2px #0002}.status-message{color:#514526}@media(max-width:550px){.selected-letter-copy small{display:none}.selected-letter-badge{width:38px;height:38px;font-size:1.45rem}.status-message{font-size:.85rem}}',
  ],
})
export class AlphabetCarComponent implements OnDestroy {
  private readonly router = inject(Router);
  readonly alphabet = ALPHABET;
  readonly itemByLetter = new Map(
    ALPHABET.map((item, index) => [item.letter, index]),
  );
  readonly stopPositions: StopPosition[] = [
    { x: 8, y: 18 },
    { x: 18.5, y: 18 },
    { x: 29, y: 18 },
    { x: 39.5, y: 18 },
    { x: 50, y: 18 },
    { x: 60.5, y: 18 },
    { x: 71, y: 18 },
    { x: 81.5, y: 18 },
    { x: 92, y: 18 },
    { x: 92, y: 50 },
    { x: 81.5, y: 50 },
    { x: 71, y: 50 },
    { x: 60.5, y: 50 },
    { x: 50, y: 50 },
    { x: 39.5, y: 50 },
    { x: 29, y: 50 },
    { x: 18.5, y: 50 },
    { x: 8, y: 50 },
    { x: 8, y: 82 },
    { x: 20, y: 82 },
    { x: 32, y: 82 },
    { x: 44, y: 82 },
    { x: 56, y: 82 },
    { x: 68, y: 82 },
    { x: 80, y: 82 },
    { x: 92, y: 82 },
  ];
  carIndex = 0;
  carDirection: 'forward' | 'backward' = 'forward';
  isDriving = false;
  selectedLetter = '';
  carMessage = "Press a letter and let's drive!";
  private arrivalTimer?: ReturnType<typeof setTimeout>;

  get carPosition(): number {
    return (this.carIndex / (this.alphabet.length - 1)) * 100;
  }
  get carLeft(): number {
    return this.stopPositions[this.carIndex].x;
  }
  get carTop(): number {
    return this.stopPositions[this.carIndex].y;
  }

  ngOnDestroy(): void {
    if (this.arrivalTimer) clearTimeout(this.arrivalTimer);
    window.speechSynthesis?.cancel();
  }
  @HostListener('window:keydown', ['$event'])
  handleKeydown(event: KeyboardEvent): void {
    const index = this.itemByLetter.get(event.key.toUpperCase());
    if (index === undefined || event.repeat) return;
    event.preventDefault();
    this.driveTo(index);
  }
  driveTo(index: number): void {
    if (this.arrivalTimer) clearTimeout(this.arrivalTimer);
    const letter = this.alphabet[index].letter;
    this.selectedLetter = letter;
    if (index === this.carIndex) {
      this.isDriving = false;
      this.carMessage = `We are already at ${letter}!`;
      this.arrivalTimer = setTimeout(() => this.announceArrival(letter), 100);
      return;
    }
    this.isDriving = true;
    this.carMessage = `Driving to ${letter}...`;
    this.moveAlongRoad(index, letter);
  }
  goBack(): void {
    void this.router.navigate(['/']);
  }
  private speak(letter: string): void {
    window.speechSynthesis?.cancel();
    const voice = new SpeechSynthesisUtterance(letter);
    voice.lang = 'en-US';
    voice.rate = 0.75;
    voice.pitch = 1.1;
    window.speechSynthesis?.speak(voice);
  }

  private moveAlongRoad(targetIndex: number, letter: string): void {
    const nextIndex = this.carIndex + (targetIndex > this.carIndex ? 1 : -1);
    const currentPosition = this.stopPositions[this.carIndex];
    const nextPosition = this.stopPositions[nextIndex];
    if (nextPosition.x !== currentPosition.x) {
      this.carDirection =
        nextPosition.x < currentPosition.x ? 'backward' : 'forward';
    }
    this.carIndex = nextIndex;
    this.arrivalTimer = setTimeout(() => {
      this.carIndex === targetIndex
        ? this.announceArrival(letter)
        : this.moveAlongRoad(targetIndex, letter);
    }, 210);
  }

  private announceArrival(letter: string): void {
    this.isDriving = false;
    this.carMessage = '';
    this.speak(letter);
  }
}
