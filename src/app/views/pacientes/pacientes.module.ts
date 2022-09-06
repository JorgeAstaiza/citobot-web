import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { ButtonModule, CardModule, FormModule, GridModule, TableModule, ToastModule } from '@coreui/angular';
import { IconModule } from '@coreui/icons-angular';
import { AngularMaterialModule } from 'src/app/shared/angular-material/angular-material.module';
import { ConsultarComponent } from './consultar/consultar.component';
import { CrearComponent } from './crear/crear.component';
import { PacientesRoutingModule } from './pacientes-routing.module';
@NgModule({
    declarations: [ConsultarComponent, CrearComponent],
    imports: [
        AngularMaterialModule,
        CommonModule,
        PacientesRoutingModule,
        RouterModule,
        FormModule,
        ReactiveFormsModule,
        GridModule,
        ButtonModule,
        TableModule,
        CardModule,
        IconModule,
        ToastModule
    ]
})
export class PacientesModule { }
