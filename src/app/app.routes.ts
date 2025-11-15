import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { TestAPIComponent } from './test-api/test-api.component';
import { CustomerComponent } from './customer/customer.component';

export const routes: Routes = [
    {
        path: 'login',
        component: LoginComponent
    },
    {
        path: 'testAPI',
        component: TestAPIComponent
    },
    {
        path: 'customer',
        component: CustomerComponent
    }
];
