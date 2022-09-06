import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { ButtonModule, CardModule, FormModule, GridModule, ToastModule } from '@coreui/angular';
import { IconModule } from '@coreui/icons-angular';
import { AngularMaterialModule } from '../../shared/angular-material/angular-material.module';
import { NotificationsModule } from '../notifications/notifications.module';
import { LoginComponent } from './login/login.component';
import { Page404Component } from './page404/page404.component';
import { Page500Component } from './page500/page500.component';
import { PagesRoutingModule } from './pages-routing.module';
import { RegisterComponent } from './register/register.component';

@NgModule({
    declarations: [
        LoginComponent,
        RegisterComponent,
        Page404Component,
        Page500Component
    ],
    imports: [
        AngularMaterialModule,
        CommonModule,
        PagesRoutingModule,
        CardModule,
        ButtonModule,
        GridModule,
        IconModule,
        FormModule,
        ReactiveFormsModule,
        NotificationsModule,
        ToastModule,
        HttpClientModule
    ]
})
export class PagesModule {
}
