import {APP_INITIALIZER, ApplicationConfig, importProvidersFrom} from '@angular/core';
import {provideRouter} from '@angular/router';

import {routes} from './app.routes';
import {KeycloakAngularModule, KeycloakService} from "keycloak-angular";
import {HttpClientModule} from "@angular/common/http";

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    importProvidersFrom(KeycloakAngularModule),
    HttpClientModule,
    KeycloakService,
    {
      provide: APP_INITIALIZER,
      useFactory: initializeKeycloak,
      multi: true,
      deps: [KeycloakService],
    }]
};

export function initializeKeycloak(keycloak: KeycloakService): () => Promise<boolean> {

  return () =>
    keycloak.init({
      config: {
        url: 'https://keycloak.szut.dev/auth',
        realm: 'szut',
        clientId: 'employee-management-service-frontend'
      },
      initOptions: {
        onLoad: 'check-sso',
        checkLoginIframe: false,
      },
      enableBearerInterceptor: true,
      bearerExcludedUrls: ['/assets', '/clients/public']
    });
}
