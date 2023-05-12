import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

const routes: Routes = [
  {path: '', loadComponent: () => import('./maps/maps.component').then(c => c.MapsComponent)},
  {path: 'passives', loadComponent: () => import('./passives/passives.component').then(c => c.PassivesComponent)},
  // {path: 'pantheons', loadComponent: () => import('./pantheons/pantheons.component').then(c => c.PantheonsComponent)},
  {path: 'trials', loadComponent: () => import('./trials/trials.component').then(c => c.TrialsComponent)},
  {path: 'about', loadComponent: () => import('./about/about.component').then(c => c.AboutComponent)},
  {path: '404', loadComponent: () => import('./not-found/not-found.component').then(c => c.NotFoundComponent)},
  {path: '**', redirectTo: '/404'},
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    initialNavigation: 'enabledBlocking',
//    useHash: true,
})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
