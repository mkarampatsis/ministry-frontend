import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { AuthService } from 'src/app/shared/services/auth.service';
import { UserInfoComponent } from '../../shared/components/user-info/user-info.component';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
    selector: 'app-navigation',
    standalone: true,
    imports: [RouterLink, RouterLinkActive, UserInfoComponent],
    templateUrl: './navigation.component.html',
    styleUrl: './navigation.component.css',
})
export class NavigationComponent {
    authService = inject(AuthService);
    user = this.authService.user;
}
