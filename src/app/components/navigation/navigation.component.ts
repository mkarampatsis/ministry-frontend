import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { AuthService } from 'src/app/shared/services/auth.service';
import { UserNavbarComponent } from '../user-navbar/user-navbar.component';

@Component({
    selector: 'app-navigation',
    standalone: true,
    imports: [CommonModule, UserNavbarComponent],
    templateUrl: './navigation.component.html',
    styleUrl: './navigation.component.css',
})
export class NavigationComponent {
    authService = inject(AuthService);
    user = this.authService.user;
}
