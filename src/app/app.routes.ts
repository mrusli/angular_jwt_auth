import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { TestAPIComponent } from './test-api/test-api.component';
import { UploadComponent } from './file-handling/upload/upload.component';
import { DownloadComponent } from './file-handling/download/download.component';

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
        path: 'upload',
        component: UploadComponent
    },
    {
        path: 'download',
        component: DownloadComponent
    }
];
