import { Component, inject } from '@angular/core';
import { AuthService } from 'src/app/shared/services/auth.service';

@Component({
    selector: 'app-user-navbar',
    standalone: true,
    imports: [],
    templateUrl: './user-navbar.component.html',
    styleUrl: './user-navbar.component.css',
})
export class UserNavbarComponent {
    authservice = inject(AuthService);
    user = this.authservice.user;

    logout() {
        this.authservice.signOut();
    }
}
