import { Routes } from '@angular/router';
import { LoginComponent } from './users/login/login.component';
import { UserListComponent } from './users/user-list/user-list.component';

export const routes: Routes = [ 
    { path: 'login', component: LoginComponent },
    { path: 'users', component: UserListComponent },
    { path: '', redirectTo: '/login', pathMatch: 'full' },
];
