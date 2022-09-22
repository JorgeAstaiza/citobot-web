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
    public usuario: any;

    private ID_CONFIGURACION_VPH: number = 1;  // Id de la configuración del VPH
    private ID_CONFIGURACION_MODO: number = 7; // Id de la configuración del MODO

    public isCheckedVph: boolean = true;
    public modoSeleccionado: string = 'Validación';

    public idConfiguracionUsuarioVph!: number;
    public idConfiguracionUsuarioModo!: number;

    public estadoConfiguracionVph: string | null = '';
    public estadoConfiguracionModo: string | null = '';

    public idConfiguracion: number = 0;
    public estaHabilitado: boolean = false;

    public msmActualizado: string = 'Actualizado Exitosamente!';

    // Listas estáticas
    public modos = [
        'Validación',
        'Entrenamiento'
    ];

    //public isCheckedCamara: boolean = true;

    constructor(private _fb: FormBuilder,
        public usuarioSvc: UsuarioService,
        private _configuracionxUsuarioSvc: ConfiguracionXUsuarioService,
        private _snackbar: SnackbarToastService) { }

    ngOnInit(): void {

        this.contruir_formulario();
        this.verificarConfiguracionesEnLocalStorage();

        // Obtener los datos del usuario logueado
        this.usuarioSvc.getUsuarioLogueado().subscribe((usuario) => {
            this.usuario = usuario;

            this.obtenerConfuIdModo(this.usuario);

        });
    }

    private contruir_formulario(): void {

        this.formulario = this._fb.group({
            vph: [true, [Validators.required]],
            modo: ['Validación', [Validators.required]],
        });

        this.formulario.valueChanges.subscribe(formulario => {

            this.isCheckedVph = formulario.vph;
            this.modoSeleccionado = formulario.modo;

            console.log('formulario: ', formulario);

        });

    }

    private obtenerConfuIdModo(usuario: any) {

        this._configuracionxUsuarioSvc.getConfiguracionxIdentificacionAndIdConfig(usuario.per_identificacion, this.ID_CONFIGURACION_MODO)
            .subscribe((res) => {

                console.log('ConfuIdModo: ', res);
                this.idConfiguracionUsuarioModo = res.objetoRespuesta[0].confu_id;

            });
    }

    private verificarConfiguracionesEnLocalStorage() {

        try {
            // Configuración del Vph
            //--------------------------------------------
            const configuracionVph = JSON.parse(localStorage.getItem('configuracionVph')!);

            this.idConfiguracionUsuarioVph = configuracionVph.id;
            this.estadoConfiguracionVph = configuracionVph.estado;

            // Convierta el string de la configuración a tipo boolean
            this.estadoConfiguracionVph === 'true'
                ? this.estaHabilitado = true
                : this.estaHabilitado = false;


            // Configuración del Modo
            //--------------------------------------------
            const configuracionModo = JSON.parse(localStorage.getItem('configuracionModo')!);
            this.idConfiguracionUsuarioModo = configuracionModo.id;
            this.estadoConfiguracionModo = configuracionModo.estado;

            // Marco el vph y modo en el formulario
            this.llenarForm(this.estaHabilitado, this.estadoConfiguracionModo!);

        } catch (error) {
            console.log('Error: ', error);

        }

    }

    private llenarForm(estaHabilitado: boolean, estadoConfiguracionModo: string): void {
        this.formulario.patchValue({ vph: estaHabilitado })
        this.formulario.patchValue({ modo: estadoConfiguracionModo })
    }

    public save(): void {

        // Guardar la configuración en el localStorage
        //--------------------------------------------
        const configuracionVph = {
            id: this.idConfiguracionUsuarioVph,
            estado: this.isCheckedVph + ""
        }
        localStorage.setItem('configuracionVph', JSON.stringify(configuracionVph));

        const configuracionModo = {
            id: this.idConfiguracionUsuarioModo,
            estado: this.modoSeleccionado
        }
        localStorage.setItem('configuracionModo', JSON.stringify(configuracionModo));


        // Guardo la configuración el la bd
        //--------------------------------------------
        const objVph: ConfiguracionXUsuario = {
            confu_usu_per_identificacion: this.usuario.per_identificacion,
            confu_conf_id: this.ID_CONFIGURACION_VPH,
            confu_estado: this.isCheckedVph + ""
        };

        const objModo: ConfiguracionXUsuario = {
            confu_usu_per_identificacion: this.usuario.per_identificacion,
            confu_conf_id: this.ID_CONFIGURACION_MODO,
            confu_estado: this.modoSeleccionado
        };

        this._configuracionxUsuarioSvc.updateConfiguracionxUsuario(this.idConfiguracionUsuarioVph, objVph).subscribe((res) => {

            if (res.codigoRespuesta === 0) {

                // Guardo la configuración por el usuario.
                this._snackbar.status(707, this.msmActualizado);
            }
            console.log(res);
        });

        this._configuracionxUsuarioSvc.updateConfiguracionxUsuario(this.idConfiguracionUsuarioModo, objModo).subscribe((res) => {

            if (res.codigoRespuesta === 0) {

                // Guardo la configuración por el usuario.
                this._snackbar.status(707, this.msmActualizado);
            }
            console.log(res);
        });

    }

}
