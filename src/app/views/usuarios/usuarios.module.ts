import { ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UsuariosRoutingModule } from './usuarios-routing.module';
import { CrearComponent } from './crear/crear.component';
import { ConsultarComponent } from './consultar/consultar.component';
import { GridModule, FormModule, ButtonModule, TableModule, CardModule, ToastModule } from '@coreui/angular';
import { RouterModule } from '@angular/router';
import { IconModule } from '@coreui/icons-angular';
import { AngularMaterialModule } from 'src/app/shared/angular-material/angular-material.module';




@NgModule({
    declarations: [
        CrearComponent,
        ConsultarComponent,

    ],
    imports: [
        AngularMaterialModule,
        CommonModule,
        UsuariosRoutingModule,
        GridModule,
        FormModule,
        ReactiveFormsModule,
        TableModule,
        CardModule,
        RouterModule,
        IconModule,
        ToastModule,
    ]
})
export class UsuariosModule { }
