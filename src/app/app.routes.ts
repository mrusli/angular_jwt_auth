import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { TestAPIComponent } from './test-api/test-api.component';

export const routes: Routes = [
    {
        path: 'login',
        component: LoginComponent
    },
    {
        path: 'testAPI',
        component: TestAPIComponent
    }
];
