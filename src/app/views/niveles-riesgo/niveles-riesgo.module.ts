import { ReactiveFormsModule } from '@angular/forms';
import { ButtonModule, CardModule, FormModule, GridModule, TableModule, ToastModule } from '@coreui/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NivelesRiesgoRoutingModule } from './niveles-riesgo-routing.module';
import { ConsultarComponent } from './consultar/consultar.component';
import { CrearEditarComponent } from './crear-editar/crear-editar.component';
import { RouterModule } from '@angular/router';
import { AngularMaterialModule } from 'src/app/shared/angular-material/angular-material.module';


@NgModule({
    declarations: [
        ConsultarComponent,
        CrearEditarComponent
    ],
    imports: [
        AngularMaterialModule,
        CommonModule,
        NivelesRiesgoRoutingModule,
        RouterModule,
        FormModule,
        ReactiveFormsModule,
        GridModule,
        ButtonModule,
        TableModule,
        CardModule
    ]
})
export class NivelesRiesgoModule { }
