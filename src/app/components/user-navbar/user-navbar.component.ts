import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-user-navbar',
    standalone: true,
    imports: [CommonModule, RouterLink],
    templateUrl: './user-navbar.component.html',
    styleUrl: './user-navbar.component.css',
})
export class UserNavbarComponent {}
