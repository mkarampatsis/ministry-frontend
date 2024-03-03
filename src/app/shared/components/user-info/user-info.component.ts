import { Component, inject } from '@angular/core';
import { AuthService } from 'src/app/shared/services/auth.service';

@Component({
    selector: 'app-user-info',
    standalone: true,
    imports: [],
    templateUrl: './user-info.component.html',
    styleUrl: './user-info.component.css',
})
export class UserInfoComponent {
    authService = inject(AuthService);
    user = this.authService.user;

    logout() {
        this.authService.signOut();
    }
}
