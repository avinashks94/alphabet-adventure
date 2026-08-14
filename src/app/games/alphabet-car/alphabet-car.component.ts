import { AfterViewInit, Component, ElementRef, EventEmitter, HostListener, OnDestroy, Output, ViewChild } from '@angular/core';
import { ALPHABET } from '../../shared/alphabet.data';

@Component({ selector: 'app-alphabet-car', standalone: true, templateUrl: './alphabet-car.component.html' })
export class AlphabetCarComponent implements AfterViewInit, OnDestroy {
  @Output() back = new EventEmitter<void>();
  @ViewChild('roadViewport') roadViewport?: ElementRef<HTMLElement>;
  readonly alphabet = ALPHABET;
  readonly itemByLetter = new Map(ALPHABET.map((item, index) => [item.letter, index]));
  carIndex = 0;
  carDirection: 'forward' | 'backward' = 'forward';
  isDriving = false;
  carMessage = 'Press a letter and let\'s drive!';
  private arrivalTimer?: ReturnType<typeof setTimeout>;

  get carPosition(): number { return this.carIndex / (this.alphabet.length - 1) * 100; }
  ngAfterViewInit(): void { setTimeout(() => this.scrollCarIntoView(false)); }
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
    const distance = Math.abs(index - this.carIndex);
    this.carDirection = index < this.carIndex ? 'backward' : 'forward';
    this.carIndex = index;
    this.isDriving = distance > 0;
    const item = this.alphabet[index];
    this.carMessage = distance ? `Driving to ${item.letter}...` : `We are already at ${item.letter}!`;
    setTimeout(() => this.scrollCarIntoView(true));
    this.arrivalTimer = setTimeout(() => {
      this.isDriving = false;
      this.carMessage = `Honk honk! ${item.letter} for ${item.word}`;
      this.playHorn(); this.speak(`${item.letter} for ${item.word}`);
    }, distance ? 900 : 100);
  }
  goBack(): void { this.back.emit(); }
  private scrollCarIntoView(smooth: boolean): void {
    const viewport = this.roadViewport?.nativeElement;
    if (!viewport) return;
    const carX = 60 + this.carPosition / 100 * Math.max(viewport.scrollWidth - 120, 0);
    viewport.scrollTo({ left: carX - viewport.clientWidth / 2, behavior: smooth ? 'smooth' : 'auto' });
  }
  private playHorn(): void {
    const AudioCtor = window.AudioContext || (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtor) return;
    const context = new AudioCtor(), now = context.currentTime;
    [0, .22].forEach(delay => {
      const oscillator = context.createOscillator(), gain = context.createGain();
      oscillator.type = 'square'; oscillator.frequency.value = 330;
      gain.gain.setValueAtTime(.0001, now + delay); gain.gain.exponentialRampToValueAtTime(.12, now + delay + .02); gain.gain.exponentialRampToValueAtTime(.0001, now + delay + .16);
      oscillator.connect(gain).connect(context.destination); oscillator.start(now + delay); oscillator.stop(now + delay + .18);
    });
    setTimeout(() => context.close(), 600);
  }
  private speak(text: string): void {
    window.speechSynthesis?.cancel();
    const voice = new SpeechSynthesisUtterance(text);
    voice.lang = 'en-US'; voice.rate = .9; voice.pitch = 1.1;
    window.speechSynthesis?.speak(voice);
  }
}
