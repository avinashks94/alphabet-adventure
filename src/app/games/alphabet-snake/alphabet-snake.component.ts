import { CommonModule } from '@angular/common';
import { Component, HostListener, OnDestroy, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ChildSpeechService } from '../../shared/child-speech.service';

interface WordItem {
  letter: string;
  name: string;
  emoji: string;
}
interface Point {
  x: number;
  y: number;
}

@Component({
  selector: 'app-alphabet-snake',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './alphabet-snake.component.html',
  styleUrl: './alphabet-snake.component.css',
})
export class AlphabetSnakeComponent implements OnDestroy {
  private readonly router = inject(Router);
  private readonly speech = inject(ChildSpeechService);
  private moveTimer?: number;

  readonly items: WordItem[] = [
    ['A', 'Apple', '\u{1F34E}'],
    ['B', 'Ball', '\u26BD'],
    ['C', 'Cat', '\u{1F431}'],
    ['D', 'Dog', '\u{1F436}'],
    ['E', 'Egg', '\u{1F95A}'],
    ['F', 'Fish', '\u{1F41F}'],
    ['G', 'Goat', '\u{1F410}'],
    ['H', 'Hat', '\u{1F3A9}'],
    ['I', 'Ice Cream', '\u{1F366}'],
    ['J', 'Juice', '\u{1F9C3}'],
    ['K', 'Kite', '\u{1FA81}'],
    ['L', 'Lion', '\u{1F981}'],
    ['M', 'Moon', '\u{1F319}'],
    ['N', 'Nose', '\u{1F443}'],
    ['O', 'Orange', '\u{1F34A}'],
    ['P', 'Pig', '\u{1F437}'],
    ['Q', 'Queen', '\u{1F451}'],
    ['R', 'Rabbit', '\u{1F430}'],
    ['S', 'Sun', '\u2600\uFE0F'],
    ['T', 'Tiger', '\u{1F42F}'],
    ['U', 'Umbrella', '\u2602\uFE0F'],
    ['V', 'Van', '\u{1F690}'],
    ['W', 'Watch', '\u231A'],
    ['X', 'Xylophone', '\u{1F3B5}'],
    ['Y', 'Yo-yo', '\u{1FA80}'],
    ['Z', 'Zebra', '\u{1F993}'],
  ].map(([letter, name, emoji]) => ({ letter, name, emoji }));

  eaten = new Set<string>();
  activeItem?: WordItem;
  isMoving = false;
  snakePosition: Point = { x: 50, y: 91 };
  snakeAngle = 0;

  @HostListener('window:keydown', ['$event'])
  onKeyDown(event: KeyboardEvent): void {
    if (/^[a-z]$/i.test(event.key)) {
      event.preventDefault();
      this.chooseLetter(event.key.toUpperCase());
    }
  }

  chooseLetter(letter: string): void {
    if (this.isMoving) return;
    const item = this.items.find((entry) => entry.letter === letter);
    if (!item) return;
    const index = this.items.indexOf(item);
    const target = {
      x: 7.5 + (index % 7) * 14.15,
      y: 13 + Math.floor(index / 7) * 22.5,
    };
    const start = { ...this.snakePosition };
    const dx = target.x - start.x;
    const dy = target.y - start.y;
    this.snakeAngle = (Math.atan2(dy, dx) * 180) / Math.PI;
    this.activeItem = item;
    this.isMoving = true;
    const began = performance.now();
    window.clearInterval(this.moveTimer);
    this.moveTimer = window.setInterval(() => {
      const progress = Math.min((performance.now() - began) / 1050, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      this.snakePosition = { x: start.x + dx * eased, y: start.y + dy * eased };
      if (progress === 1) {
        window.clearInterval(this.moveTimer);
        this.eaten = new Set(this.eaten).add(letter);
        this.isMoving = false;
        this.speech.speak(item.name);
      }
    }, 16);
  }

  goHome(): void {
    this.speech.cancel();
    void this.router.navigate(['/dashboard']);
  }
  reset(): void {
    window.clearInterval(this.moveTimer);
    this.speech.cancel();
    this.eaten = new Set();
    this.activeItem = undefined;
    this.isMoving = false;
    this.snakePosition = { x: 50, y: 91 };
    this.snakeAngle = 0;
  }
  ngOnDestroy(): void {
    window.clearInterval(this.moveTimer);
    this.speech.cancel();
  }
}
