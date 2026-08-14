import { Component, ViewEncapsulation } from '@angular/core';
import { DashboardComponent, GameSelection } from './dashboard/dashboard.component';
import { AlphabetSoundsComponent } from './games/alphabet-sounds/alphabet-sounds.component';
import { AlphabetCarComponent } from './games/alphabet-car/alphabet-car.component';

type Screen = 'dashboard' | GameSelection;

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [DashboardComponent, AlphabetSoundsComponent, AlphabetCarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  encapsulation: ViewEncapsulation.None
})
export class AppComponent {
  screen: Screen = 'dashboard';
  openGame(game: GameSelection): void { this.screen = game; }
  showDashboard(): void { this.screen = 'dashboard'; }
}
