import { GoogleSigninButtonModule } from '@abacritt/angularx-social-login';
import { Component } from '@angular/core';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [GoogleSigninButtonModule],
    templateUrl: './login.component.html',
    styleUrl: './login.component.css',
})
export class LoginComponent {}
