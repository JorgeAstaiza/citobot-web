import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { NivelRiesgoService } from 'src/app/shared/services/nivel-riesgo.service';
import { SnackbarToastService } from 'src/app/shared/services/snackbar-toast.service';

@Component({
  selector: 'app-crear-editar',
  templateUrl: './crear-editar.component.html',
  styleUrls: ['./crear-editar.component.scss'],
})
export class CrearEditarComponent implements OnInit {
  niv_mensaje!: FormControl;
  niv_descripcion!: FormControl;

  constructor(
    private fb: FormBuilder,
    private nivelesRiesgoSvc: NivelRiesgoService,
    private _snackbar: SnackbarToastService,
    private router: Router
  ) {
    this.niv_mensaje = new FormControl(null, Validators.required);
    this.niv_descripcion = new FormControl(null, Validators.required);
  }

  ngOnInit(): void {}

  public saveRiesgo() {
    if (this.niv_descripcion.valid && this.niv_descripcion.valid) {
      const objEnviar = {
        niv_mensaje: this.niv_mensaje.value,
        niv_descripcion: this.niv_descripcion.value,
      };
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
