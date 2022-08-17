import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {MapsComponent} from './maps/maps.component';
import {NotFoundComponent} from './not-found/not-found.component';
import {AboutComponent} from './about/about.component';
import {TrialsComponent} from './trials/trials.component';
import {PassivesComponent} from "./passives/passives.component";

const routes: Routes = [
  {path: '', component: MapsComponent},
  {path: 'passives', component: PassivesComponent},
  // {path: 'pantheons', component: PantheonsComponent},
  {path: 'trials', component: TrialsComponent},
  {path: 'about', component: AboutComponent},
  {path: '404', component: NotFoundComponent},
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
