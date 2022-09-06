import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ConfiguracionRoutingModule } from './configuracion-routing.module';
import { GeneralComponent } from './general/general.component';
import { AngularMaterialModule } from 'src/app/shared/angular-material/angular-material.module';
import { CardModule, FormModule, GridModule, ToastModule } from '@coreui/angular';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { IconModule } from '@coreui/icons-angular';


@NgModule({
    declarations: [
        GeneralComponent
    ],
    imports: [
        AngularMaterialModule,
        CommonModule,
        ConfiguracionRoutingModule,
        CardModule,
        AngularMaterialModule,
        GridModule,
        FormModule,
        ReactiveFormsModule,
        RouterModule,
        IconModule,
        ToastModule,
    ]
})
export class ConfiguracionModule { }
