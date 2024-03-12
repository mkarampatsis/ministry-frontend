import { Routes } from '@angular/router';
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
    {
        path: 'monades',
        loadChildren: () =>
            import('./components/monades/monades.routes').then(
                (m) => m.MonadesRoutes,
            ),
    },
    {
        path: '**',
        redirectTo: 'login',
    },
];
