import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Configuracion } from '../../../models/configuracion';
import { ConfiguracionService } from '../../../shared/services/configuracion.service';
import { SnackbarToastService } from '../../../shared/services/snackbar-toast.service';

/**
 * @title Basic use of `<table mat-table>`
 */

@Component({
    selector: 'app-general',
    templateUrl: './general.component.html',
    styleUrls: ['./general.component.scss']
})
export class GeneralComponent implements OnInit {

    public formulario!: FormGroup;
    public isCheckedVph: boolean = true;
    public msmActualizado: string = 'Actualizado Exitosamente!';
    public idConfiguracion: number = 0;
    public configuracionVph: string | null = '';
    public estaHabilitado: boolean = false;
    //public isCheckedCamara: boolean = true;

    constructor(private _fb: FormBuilder,
        private _configuracionSvc: ConfiguracionService,
        private _snackbar: SnackbarToastService) {

        this.contruir_formulario();

    }

    private contruir_formulario(): void {

        this.formulario = this._fb.group({
            vph: [true, [Validators.required]],
            /* camara: [true, [Validators.required]], */
        });

        this.formulario.valueChanges.subscribe(formulario => {

            this.isCheckedVph = formulario.vph
            // this.isCheckedCamara = formulario.camara
        });

    }

    ngOnInit(): void {
        this.obtenerConfiguraciones();
    }

    private obtenerConfiguraciones(): void {

        // Verificar la configuración que se estableció del Vph en el módulo de configuraciones
        this._configuracionSvc.getConfiguracionById(4).subscribe(configuracion => {

            this.idConfiguracion = configuracion.objetoRespuesta[0].conf_id;
            this.configuracionVph = configuracion.objetoRespuesta[0].conf_estado;
            console.log('this.configuracionVph Recibida: ', this.configuracionVph);

            // Convierta el string de la configuración a tipo boolean
            this.configuracionVph === 'true'
                ? this.estaHabilitado = true
                : this.estaHabilitado = false;

            // Marco el vph
            this.llenarForm(this.estaHabilitado);
        });

    }

    private llenarForm(estaHabilitado: boolean) { this.formulario.patchValue({ vph: estaHabilitado }) }

    public save() {

        // Guardo la configuración el la bd o localStorage
        if (this.formulario.valid) {

            const objEnviar: Configuracion = {
                conf_nombre: 'Habilitar Vph',
                conf_descripcion: 'Configuración para pedir desde el sistema el valor del VPH o no. Los valores son True para pedir el valor positivo o negativo y False para no pedir el valor. ',
                conf_estado: this.isCheckedVph
            };

            this._configuracionSvc.updateConfiguracion(4, objEnviar).subscribe((res) => {

                if (res.codigoRespuesta === 0) {
                    this._snackbar.status(707, this.msmActualizado);
                }
                console.log(res);
            });
        }
        else {
            // Completa los campos
            this._snackbar.status(600);
        }
    }

}
