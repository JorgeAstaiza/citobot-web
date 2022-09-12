import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DefaultLayoutComponent } from './containers';
import { AuthGuard } from './shared/auth.guard';
import { SecureInnerPagesGuard } from './shared/secure-inner-pages.guard';
import { ForgotPasswordComponent } from './views/pages/forgot-password/forgot-password.component';
import { LoginComponent } from './views/pages/login/login.component';
import { Page404Component } from './views/pages/page404/page404.component';
import { Page500Component } from './views/pages/page500/page500.component';
import { RegisterComponent } from './views/pages/register/register.component';

const routes: Routes = [
    {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full',
    },
    {
        path: '',
        component: DefaultLayoutComponent,
        data: {
            title: 'Home',
        },
        children: [
            {
                path: 'dashboard',
                loadChildren: () =>
                    import('./views/dashboard/dashboard.module').then(
                        (m) => m.DashboardModule
                    ),
                canActivate: [AuthGuard],
            },
            {
                path: 'pacientes',
                loadChildren: () =>
                    import('./views/pacientes/pacientes.module').then(
                        (m) => m.PacientesModule
                    ),
                canActivate: [AuthGuard],
            },
            {
                path: 'usuarios',
                loadChildren: () =>
                    import('./views/usuarios/usuarios.module').then(
                        (m) => m.UsuariosModule
                    ),
                canActivate: [AuthGuard],
            },
            {
                path: 'tamizaje',
                loadChildren: () =>
                    import('./views/tamizaje/tamizaje.module').then(
                        (m) => m.TamizajeModule
                    ),
                canActivate: [AuthGuard],
            },
            {
                path: 'riesgos',
                loadChildren: () =>
                    import('./views/niveles-riesgo/niveles-riesgo.module').then(
                        (m) => m.NivelesRiesgoModule
                    ),
                canActivate: [AuthGuard],
            },
            {
                path: 'configuracion',
                loadChildren: () =>
                    import('./views/configuracion/configuracion.module').then(
                        (m) => m.ConfiguracionModule
                    ),
                canActivate: [AuthGuard],
            },
            {
                path: 'theme',
                loadChildren: () =>
                    import('./views/theme/theme.module').then((m) => m.ThemeModule),
            },
            {
                path: 'base',
                loadChildren: () =>
                    import('./views/base/base.module').then((m) => m.BaseModule),
            },
            {
                path: 'buttons',
                loadChildren: () =>
                    import('./views/buttons/buttons.module').then((m) => m.ButtonsModule),
            },
            {
                path: 'forms',
                loadChildren: () =>
                    import('./views/forms/forms.module').then((m) => m.CoreUIFormsModule),
            },
            {
                path: 'charts',
                loadChildren: () =>
                    import('./views/charts/charts.module').then((m) => m.ChartsModule),
            },
            {
                path: 'icons',
                loadChildren: () =>
                    import('./views/icons/icons.module').then((m) => m.IconsModule),
            },
            {
                path: 'notifications',
                loadChildren: () =>
                    import('./views/notifications/notifications.module').then(
                        (m) => m.NotificationsModule
                    ),
            },
            {
                path: 'widgets',
                loadChildren: () =>
                    import('./views/widgets/widgets.module').then((m) => m.WidgetsModule),
            },
            {
                path: 'pages',
                loadChildren: () =>
                    import('./views/pages/pages.module').then((m) => m.PagesModule),
                canActivate: [SecureInnerPagesGuard],
            },
        ],
    },
    {
        path: '404',
        component: Page404Component,
        data: {
            title: 'Page 404',
        },
    },
    {
        path: '500',
        component: Page500Component,
        data: {
            title: 'Page 500',
        },
    },
    {
        path: 'login',
        component: LoginComponent,
        data: {
            title: 'Login Page',
        },
    },
    {
        path: 'register',
        component: RegisterComponent,
        data: {
            title: 'Register Page',
        },
    },
    {
        path: 'forgot-password',
        component: ForgotPasswordComponent,
        data: {
            title: 'Restablecer Contraseña'
        }
    },

    { path: '**', redirectTo: 'dashboard' },
];

@NgModule({
    imports: [
        RouterModule.forRoot(routes, {
            scrollPositionRestoration: 'top',
            anchorScrolling: 'enabled',
            initialNavigation: 'enabledBlocking',
            // relativeLinkResolution: 'legacy'
        }),
    ],
    exports: [RouterModule],
})
export class AppRoutingModule { }
