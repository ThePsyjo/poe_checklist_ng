import { enableProdMode, importProvidersFrom } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { environment } from './environments/environment';
import { AppComponent } from './app/app.component';
import { MatSortModule } from '@angular/material/sort';
import { provideAnimations } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app/app-routing.module';
import { BrowserModule, bootstrapApplication } from '@angular/platform-browser';

if (environment.production) {
  enableProdMode();
}

document.addEventListener('DOMContentLoaded', () => {
  bootstrapApplication(AppComponent, {
    providers: [
        importProvidersFrom(BrowserModule.withServerTransition({ appId: 'serverApp' }), AppRoutingModule, FormsModule, MatSortModule),
        provideAnimations()
    ]
})
  .catch(err => console.error(err));
});
