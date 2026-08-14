import { Component, EventEmitter, Output } from '@angular/core';

export type GameSelection = 'alphabet-sounds' | 'alphabet-car';

@Component({ selector: 'app-dashboard', standalone: true, templateUrl: './dashboard.component.html' })
export class DashboardComponent {
  @Output() gameSelected = new EventEmitter<GameSelection>();
}
