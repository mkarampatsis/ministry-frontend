import { ApplicationConfig, LOCALE_ID } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import localeEl from '@angular/common/locales/el';

import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { GoogleLoginProvider, SocialAuthServiceConfig } from '@abacritt/angularx-social-login';
import { GoogleClientId } from './shared/config';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { AuthInterceptorService } from './shared/services/auth-interceptor.service';
import { BackendInterceptor } from './shared/services/backend-interceptor.service';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

registerLocaleData(localeEl, 'el-GR');

export const appConfig: ApplicationConfig = {
    providers: [
        { provide: LOCALE_ID, useValue: 'el-GR' },
        provideRouter(routes),
        {
            provide: 'SocialAuthServiceConfig',
            useValue: {
                autoLogin: false,
                providers: [
                    {
                        id: GoogleLoginProvider.PROVIDER_ID,
                        provider: new GoogleLoginProvider(GoogleClientId),
                    },
                ],
                onError: (err: any) => {
                    console.log(err);
                },
            } as SocialAuthServiceConfig,
        },
        {
            provide: HTTP_INTERCEPTORS,
            useClass: AuthInterceptorService,
            multi: true,
        },
        { provide: HTTP_INTERCEPTORS, useClass: BackendInterceptor, multi: true },
        provideHttpClient(withInterceptorsFromDi()),
        provideAnimationsAsync(),
    ],
};
