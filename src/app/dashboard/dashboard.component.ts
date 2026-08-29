import { AfterViewInit, Component, ElementRef, HostListener, OnDestroy, ViewChild } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent implements AfterViewInit, OnDestroy {
  @ViewChild('gameTrack') private gameTrack?: ElementRef<HTMLElement>;
  private audioContext?: AudioContext;
  private musicGain?: GainNode;
  private musicTimer?: number;
  private musicStartTimer?: number;
  private musicStep = 0;
  musicMuted = false;

  ngAfterViewInit(): void {
    const splashRemaining = Math.max(0, 3100 - performance.now());
    this.musicStartTimer = window.setTimeout(() => this.startMusic(), splashRemaining);
  }

  @HostListener('window:pointerdown')
  @HostListener('window:keydown')
  unlockMusic(): void {
    if (!this.musicMuted && !this.musicTimer) this.startMusic();
  }

  toggleMusic(): void {
    this.musicMuted = !this.musicMuted;
    if (this.musicMuted) {
      window.clearInterval(this.musicTimer);
      this.musicTimer = undefined;
      this.musicGain?.gain.setTargetAtTime(0.0001, this.audioContext?.currentTime || 0, .03);
    } else {
      this.startMusic();
    }
  }

  slideGames(direction: -1 | 1): void {
    this.playNavigationSound(direction);
    const track = this.gameTrack?.nativeElement;
    if (!track) return;
    const atStart = track.scrollLeft < 8;
    const atEnd = track.scrollLeft + track.clientWidth >= track.scrollWidth - 8;
    if (direction === 1 && atEnd) track.scrollTo({ left: 0, behavior: 'smooth' });
    else if (direction === -1 && atStart) track.scrollTo({ left: track.scrollWidth, behavior: 'smooth' });
    else track.scrollBy({ left: direction * track.clientWidth, behavior: 'smooth' });
  }

  private startMusic(): void {
    if (this.musicMuted || this.musicTimer) return;
    this.audioContext ??= new AudioContext();
    if (!this.musicGain) {
      this.musicGain = this.audioContext.createGain();
      this.musicGain.connect(this.audioContext.destination);
    }
    this.musicGain.gain.setValueAtTime(.55, this.audioContext.currentTime);
    void this.audioContext.resume().then(() => {
      if (this.musicMuted || this.musicTimer) return;
      this.playMusicNote();
      this.musicTimer = window.setInterval(() => this.playMusicNote(), 390);
    }).catch(() => undefined);
  }

  private playMusicNote(): void {
    if (!this.audioContext || !this.musicGain || this.musicMuted) return;
    const melody = [523.25, 659.25, 783.99, 659.25, 587.33, 698.46, 880, 698.46, 659.25, 783.99, 987.77, 783.99, 587.33, 659.25, 523.25, 392];
    const frequency = melody[this.musicStep++ % melody.length];
    const now = this.audioContext.currentTime;
    const oscillator = this.audioContext.createOscillator();
    const volume = this.audioContext.createGain();
    oscillator.type = 'triangle';
    oscillator.frequency.setValueAtTime(frequency, now);
    volume.gain.setValueAtTime(.0001, now);
    volume.gain.exponentialRampToValueAtTime(.07, now + .015);
    volume.gain.exponentialRampToValueAtTime(.0001, now + .3);
    oscillator.connect(volume); volume.connect(this.musicGain);
    oscillator.start(now); oscillator.stop(now + .31);
  }

  private playNavigationSound(direction: -1 | 1): void {
    if (this.musicMuted) return;
    this.audioContext ??= new AudioContext();
    const context = this.audioContext;
    void context.resume();
    const notes = direction === 1 ? [523.25, 659.25] : [659.25, 523.25];
    notes.forEach((frequency, index) => {
      const start = context.currentTime + index * .075;
      const oscillator = context.createOscillator();
      const volume = context.createGain();
      oscillator.type = 'sine'; oscillator.frequency.setValueAtTime(frequency, start);
      volume.gain.setValueAtTime(.001, start);
      volume.gain.exponentialRampToValueAtTime(.13, start + .012);
      volume.gain.exponentialRampToValueAtTime(.001, start + .16);
      oscillator.connect(volume); volume.connect(context.destination);
      oscillator.start(start); oscillator.stop(start + .17);
    });
  }

  ngOnDestroy(): void {
    window.clearTimeout(this.musicStartTimer);
    window.clearInterval(this.musicTimer);
    void this.audioContext?.close();
  }
}