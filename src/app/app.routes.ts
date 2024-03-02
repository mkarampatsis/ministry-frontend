import { Routes } from '@angular/router';

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
                (m) => m.LoginRoutes
            ),
    },
    {
        path: 'psped',
        loadChildren: () =>
            import('./components/psped/psped.routes').then(
                (m) => m.PspedRoutes
            ),
    },
];
