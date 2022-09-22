import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfiguracionXUsuario } from '../../../models/configuracion-x-usuario';
import { ConfiguracionXUsuarioService } from '../../../shared/services/configuracion-x-usuario.service';
import { SnackbarToastService } from '../../../shared/services/snackbar-toast.service';
import { UsuarioService } from '../../../shared/services/usuario.service';

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
    public idConfiguracionVph!: number;
    public estadoConfiguracionVph: string | null = '';
    private id_Config_Habilitar_Vph: number = 1; // Id de la configuración
    private id_Config_Habilitar_Modo: number = 7; // Id de la configuración
    public estaHabilitado: boolean = false;
    public usuario: any;
    public isCheckedModo: boolean = true;
    public idConfiguracionModo!: number;
    //public isCheckedCamara: boolean = true;

    constructor(private _fb: FormBuilder,
        public usuarioSvc: UsuarioService,
        private _configuracionxUsuarioSvc: ConfiguracionXUsuarioService,
        private _snackbar: SnackbarToastService) { }

    ngOnInit(): void {

        this.contruir_formulario();
        this.verificarConfiguracionVphEnLocalStorage();

        // Obtener los datos del usuario logueado
        this.usuarioSvc.getUsuarioLogueado().subscribe((usuario) => this.usuario = usuario);
    }

    private verificarConfiguracionVphEnLocalStorage() {

        const configuracionVph = JSON.parse(localStorage.getItem('configuracionVph')!);

        this.idConfiguracionVph = configuracionVph.id;
        this.estadoConfiguracionVph = configuracionVph.estado;

        // Convierta el string de la configuración a tipo boolean
        this.estadoConfiguracionVph === 'true'
            ? this.estaHabilitado = true
            : this.estaHabilitado = false;

        // Marco el vph
        this.llenarForm(this.estaHabilitado);
    }

    private contruir_formulario(): void {

        this.formulario = this._fb.group({
            vph: [true, [Validators.required]],
            modo: [true, [Validators.required]],
            /* camara: [true, [Validators.required]], */
        });

        this.formulario.valueChanges.subscribe(formulario => {

            this.isCheckedVph = formulario.vph;
            this.isCheckedModo = formulario.modo;
            // this.isCheckedCamara = formulario.camara

            console.log('formulario: ', formulario);

        });

    }

    private llenarForm(estaHabilitado: boolean): void {
        this.formulario.patchValue({ vph: estaHabilitado })
    }

    public save(): void {

        // Guardar la configuración en el localstorage

        /* VPH */
        const configuracionVph = {
            id: this.idConfiguracionVph,
            estado: this.isCheckedVph + ""
        }
        localStorage.setItem('configuracionVph', JSON.stringify(configuracionVph));

        /* MODO */
        const configuracionModo = {
            id: this.idConfiguracionModo,
            estado: this.isCheckedModo + ""
        }
        localStorage.setItem('configuracionModo', JSON.stringify(configuracionModo));


        // Guardo la configuración el la bd

        /* VPH */
        const objVph: ConfiguracionXUsuario = {
            confu_usu_per_identificacion: this.usuario.per_identificacion,
            confu_conf_id: this.id_Config_Habilitar_Vph,
            confu_estado: this.isCheckedVph + ""
        };

        /* MODO */
        const objModo: ConfiguracionXUsuario = {
            confu_usu_per_identificacion: this.usuario.per_identificacion,
            confu_conf_id: this.id_Config_Habilitar_Modo,
            confu_estado: this.isCheckedModo + ""
        };

        this._configuracionxUsuarioSvc.updateConfiguracionxUsuario(this.idConfiguracionVph, objVph).subscribe((res) => {

            if (res.codigoRespuesta === 0) {

                // Guardo la configuración por el usuario.
                this._snackbar.status(707, this.msmActualizado);
            }
            console.log(res);
        });

        this._configuracionxUsuarioSvc.updateConfiguracionxUsuario(this.idConfiguracionModo, objModo).subscribe((res) => {

            if (res.codigoRespuesta === 0) {

                // Guardo la configuración por el usuario.
                this._snackbar.status(707, this.msmActualizado);
            }
            console.log(res);
        });

    }

}
