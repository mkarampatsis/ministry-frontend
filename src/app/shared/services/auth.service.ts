import { Injectable, inject, signal } from '@angular/core';
import { SocialAuthService } from '@abacritt/angularx-social-login';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { IUser, IAuthResponse } from 'src/app/shared/interfaces/auth';

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    socialAuthService = inject(SocialAuthService);
    http = inject(HttpClient);
    router = inject(Router);

    user = signal(<IUser | null>null);

    constructor() {
        this.socialAuthService.authState.subscribe({
            next: (user) => {
                console.log(user);
                if (user) {
                    const { idToken } = user;
                    this.http
                        .post<IAuthResponse>(
                            `${environment.apiUrl}/auth/google-auth`,
                            {
                                idToken,
                            }
                        )
                        .subscribe({
                            next: (res: IAuthResponse) => {
                                this.user.set(res.user);
                                localStorage.setItem(
                                    'accessToken',
                                    res.accessToken
                                );
                                this.router.navigate(['/indicators']);
                            },
                            error: (err) => {
                                console.log(err);
                            },
                        });
                }
            },
            error: (err) => {
                console.log(err);
            },
        });
    }

    signOut() {
        this.socialAuthService.signOut();
        this.user.set(null);
        localStorage.removeItem('accessToken');
        this.router.navigate(['/home']);
    }
}
