import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { AuthService } from 'src/app/shared/services/auth.service';
import { UserNavbarComponent } from '../user-navbar/user-navbar.component';
import { UserInfoComponent } from '../../shared/components/user-info/user-info.component';

@Component({
    selector: 'app-navigation',
    standalone: true,
    imports: [CommonModule, UserNavbarComponent, UserInfoComponent],
    templateUrl: './navigation.component.html',
    styleUrl: './navigation.component.css',
})
export class NavigationComponent {
    authService = inject(AuthService);
    user = this.authService.user;
}
