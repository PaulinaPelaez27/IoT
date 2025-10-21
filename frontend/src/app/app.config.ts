import {
  ApplicationConfig,
  provideZoneChangeDetection,
  inject,
} from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import {
  provideClientHydration,
  withEventReplay,
} from '@angular/platform-browser';
import {
  provideHttpClient,
  withFetch,
  withInterceptors,
} from '@angular/common/http';

import { AuthInterceptor } from '../interceptors/auth.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),

    AuthInterceptor,

    provideHttpClient(
      withFetch(),
      withInterceptors([
        (req, next) => inject(AuthInterceptor).intercept(req, { handle: next }),
      ])
    ),

    provideClientHydration(withEventReplay()),
  ],
};
