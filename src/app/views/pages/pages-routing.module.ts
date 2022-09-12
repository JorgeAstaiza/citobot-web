import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { LoginComponent } from './login/login.component';
import { Page404Component } from './page404/page404.component';
import { Page500Component } from './page500/page500.component';
import { RegisterComponent } from './register/register.component';

const routes: Routes = [
    {
        path: '404',
        component: Page404Component,
        data: {
            title: 'Page 404'
        }
    },
    {
        path: '500',
        component: Page500Component,
        data: {
            title: 'Page 500'
        }
    },
    {
        path: 'login',
        component: LoginComponent,
        data: {
            title: 'Acceso'
        }
    },
    {
        path: 'register',
        component: RegisterComponent,
        data: {
            title: 'Register Page'
        }
    },
    {
        path: 'forgot-password',
        component: ForgotPasswordComponent,
        data: {
            title: 'Restablecer Contraseña'
        }
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class PagesRoutingModule {
}
