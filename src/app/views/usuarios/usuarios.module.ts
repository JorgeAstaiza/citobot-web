import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { RouterModule } from '@angular/router';
import { CardModule, FormModule, GridModule, TableModule, ToastModule } from '@coreui/angular';
import { IconModule } from '@coreui/icons-angular';
import { NgxMaskModule } from 'ngx-mask';
import { AngularMaterialModule } from 'src/app/shared/angular-material/angular-material.module';
import { ConsultarComponent } from './consultar/consultar.component';
import { CrearComponent } from './crear/crear.component';
import { UsuariosRoutingModule } from './usuarios-routing.module';




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
        NgxMaskModule.forChild()
    ]
})
export class UsuariosModule { }
