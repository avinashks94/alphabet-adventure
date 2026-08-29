import { Component, OnDestroy, ViewEncapsulation } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  encapsulation: ViewEncapsulation.None,
})
export class AppComponent implements OnDestroy {
  showSplash = true;
  private readonly splashTimer = window.setTimeout(() => {
    this.showSplash = false;
  }, 3000);

  ngOnDestroy(): void {
    window.clearTimeout(this.splashTimer);
  }
}
