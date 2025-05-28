import { Routes } from '@angular/router';
import { LayoutComponent } from './core/layout/layout.component';
import { LoginComponent } from './core/auth/login/login.component';
import { AuthGuard } from './core/auth/auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: '',
    component: LayoutComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'profile',
        loadComponent: () =>
          import('./core/components/profile/profile.component').then(
            (c) => c.ProfileComponent
          ),
      },
      {
        path: 'users',
        loadChildren: () =>
          import('./features/users/users.routes').then((m) => m.USERS_ROUTES),
      },
      {
        path: 'attractions',
        loadChildren: () =>
          import('./features/attractions/attractions.routes').then(
            (m) => m.ATTRACTIONS_ROUTES
          ),
      },
      {
        path: 'pet-sales',
        loadChildren: () =>
          import('./features/pet-sales/pet-sales.routes').then(
            (m) => m.PET_SALES_ROUTES
          ),
      },
      {
        path: '',
        redirectTo: 'users',
        pathMatch: 'full',
      },
    ],
  },
];
