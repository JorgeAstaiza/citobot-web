import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { NivelRiesgoService } from 'src/app/shared/services/nivel-riesgo.service';
import { SnackbarToastService } from 'src/app/shared/services/snackbar-toast.service';

@Component({
  selector: 'app-crear-editar',
  templateUrl: './crear-editar.component.html',
  styleUrls: ['./crear-editar.component.scss'],
})
export class CrearEditarComponent implements OnInit, OnDestroy {
  niv_mensaje!: FormControl;
  niv_descripcion!: FormControl;
  actualizar = false;
  idRiesgoActualizar!: number;
  constructor(
    private fb: FormBuilder,
    private nivelesRiesgoSvc: NivelRiesgoService,
    private _snackbar: SnackbarToastService,
    private router: Router
  ) {
    this.niv_mensaje = new FormControl(null, Validators.required);
    this.niv_descripcion = new FormControl(null, Validators.required);
  }

  ngOnInit(): void {
    this.nivelesRiesgoSvc.riesgoEditar.subscribe((res) => {
      console.log(res);
      if (res.niv_id) {
        this.actualizar = true;
        this.idRiesgoActualizar = res.niv_id;
        this.niv_mensaje.setValue(res.niv_mensaje);
        this.niv_descripcion.setValue(res.niv_descripcion);
      }
    });
  }
  ngOnDestroy(): void {
    this.nivelesRiesgoSvc.riesgoEditar.next({});
    this.actualizar = false;
  }

  public saveRiesgo() {
    if (this.niv_descripcion.valid && this.niv_descripcion.valid) {
      const objEnviar = {
        niv_mensaje: this.niv_mensaje.value,
        niv_descripcion: this.niv_descripcion.value,
      };
      if (this.actualizar) {
        this.nivelesRiesgoSvc
          .updateRiesgo(this.idRiesgoActualizar, objEnviar)
          .subscribe((res) => {
            if (res.codigoRespuesta === 0) {
              this._snackbar.status(707, 'Riesgo creado exitosamente!');
              this.router.navigate(['riesgos/consultar']);
            } else {
              this._snackbar.status(404);
            }
          });
      } else {
        this.nivelesRiesgoSvc.createRiesgo(objEnviar).subscribe((res) => {
          if (res.codigoRespuesta === 0) {
            this._snackbar.status(707, 'Riesgo creado exitosamente!');
            this.router.navigate(['riesgos/consultar']);
          } else {
            this._snackbar.status(404);
          }
        });
      }
    }
  }
}
