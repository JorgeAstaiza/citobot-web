import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import {
	ButtonModule,
	CardModule,
	FormModule,
	GridModule,
	ModalModule,
	TableModule,
	ToastModule
} from '@coreui/angular';
import { IconModule } from '@coreui/icons-angular';
import { WebcamModule } from 'ngx-webcam';
import { AngularMaterialModule } from '../../shared/angular-material/angular-material.module';
import { ConsultarComponent } from './consultar/consultar.component';
import { CrearComponent } from './crear/crear.component';
import { TamizajeRoutingModule } from './tamizaje-routing.module';
import { WebcamSnapshotComponent } from './webcam-snapshot/webcam-snapshot.component';

@NgModule({
  declarations: [CrearComponent, ConsultarComponent, WebcamSnapshotComponent],
  imports: [
    AngularMaterialModule,
    CommonModule,
    TamizajeRoutingModule,
    TableModule,
    ButtonModule,
    CardModule,
    RouterModule,
    IconModule,
    ToastModule,
    FormModule,
    GridModule,
    ReactiveFormsModule,
    ModalModule,
    WebcamModule,
    FormsModule,
  ],
})
export class TamizajeModule {}
