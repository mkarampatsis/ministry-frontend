import { Component, inject } from '@angular/core';
import { NavigationComponent } from './components/navigation/navigation.component';
import { FooterComponent } from './components/footer/footer.component';
import { ContentComponent } from './components/content/content.component';
import { AuthService } from './shared/services/auth.service';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [NavigationComponent, ContentComponent, FooterComponent],
    templateUrl: './app.component.html',
    styleUrl: './app.component.css',
})
export class AppComponent {
    authService = inject(AuthService);
}
