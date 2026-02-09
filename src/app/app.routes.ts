import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'heroes',
    children: [
      {
        path: 'list',
        loadComponent: () => import('./heroes/pages/list/heroes-list.component').then(m => m.HeroesListComponent)
      },
      {
        path: '',
        redirectTo: 'list',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: 'heroes',
    pathMatch: 'full'
  }
];



