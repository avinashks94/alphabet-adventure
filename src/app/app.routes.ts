import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'dashboard',
  },
  {
    path: 'dashboard',
    title: 'Alphabet Adventure',
    loadComponent: () =>
      import('./dashboard/dashboard.component').then(
        (m) => m.DashboardComponent,
      ),
  },
  {
    path: 'alphabet-sounds',
    title: 'Alphabet Sounds',
    loadComponent: () =>
      import('./games/alphabet-sounds/alphabet-sounds.component').then(
        (m) => m.AlphabetSoundsComponent,
      ),
  },
  {
    path: 'alphabet-car',
    title: 'Alphabet Car',
    loadComponent: () =>
      import('./games/alphabet-car/alphabet-car.component').then(
        (m) => m.AlphabetCarComponent,
      ),
  },
  { path: '**', redirectTo: 'dashboard' },
];
