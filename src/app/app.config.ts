import {ApplicationConfig} from '@angular/core';
import {provideRouter} from '@angular/router';

import {routes} from './app.routes';

/**
 * Application config used during bootstrap.
 */
export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
  ]
};
