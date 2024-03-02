import { Route } from '@angular/router';
import { UserInfoComponent } from './user-info.component';
import { AuthGuard } from 'src/app/shared/services/auth.guard';

export const UserInfoRoutes: Route[] = [
    {
        path: '',
        component: UserInfoComponent,
        canActivate: [AuthGuard],
    },
];
