import { Component, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from 'src/app/shared/services/auth.service';

@Component({
    selector: 'app-user-info',
    standalone: true,
    imports: [RouterLink, MatIconModule, NgbDropdownModule],
    templateUrl: './user-info.component.html',
    styleUrl: './user-info.component.css',
})
export class UserInfoComponent {
    authService = inject(AuthService);
    user = this.authService.user;
    imgSrcError = false;

    logout() {
        this.authService.signOut();
    }
}
