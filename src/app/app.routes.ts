import { Routes } from '@angular/router';
import { UserInfoComponent } from './shared/components/user-info/user-info.component';
import { AuthGuard } from './shared/services/auth.guard';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full',
    },
    {
        path: 'login',
        loadChildren: () =>
            import('./components/login/login.routes').then(
                (m) => m.LoginRoutes,
            ),
    },
    {
        path: 'psped',
        loadChildren: () =>
            import('./components/psped/psped.routes').then(
                (m) => m.PspedRoutes,
            ),
    },
    {
        path: 'foreis',
        loadChildren: () =>
            import('./components/foreis/foreis.routes').then(
                (m) => m.ForeisRoutes,
            ),
    },
];
