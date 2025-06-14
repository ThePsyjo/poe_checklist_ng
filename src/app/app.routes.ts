import {Routes} from '@angular/router';

export const routes: Routes = [
  {path: '', loadComponent: () => import('./maps/maps.component').then(c => c.MapsComponent)},
  {path: 'passives', loadComponent: () => import('./passives/passives.component').then(c => c.PassivesComponent)},
  {path: 'trials', loadComponent: () => import('./trials/trials.component').then(c => c.TrialsComponent)},
  {path: 'up-trade', loadComponent: () => import('./up-trade/up-trade.component').then(c => c.UpTradeComponent)},
  {path: 'about', loadComponent: () => import('./about/about.component').then(c => c.AboutComponent)},
  {path: '404', loadComponent: () => import('./not-found/not-found.component').then(c => c.NotFoundComponent)},
  {path: '**', redirectTo: '/404'},
];
