import { Component, Input } from '@angular/core';

import { Router } from '@angular/router';
import { HeaderComponent } from '@coreui/angular';
import { ConfiguracionXUsuario } from 'src/app/models/configuracion-x-usuario';
import { AuthService } from 'src/app/shared/services/auth.service';
import { ConfiguracionXUsuarioService } from '../../../shared/services/configuracion-x-usuario.service';
import { UsuarioService } from '../../../shared/services/usuario.service';

@Component({
    selector: 'app-default-header',
    templateUrl: './default-header.component.html',
})
export class DefaultHeaderComponent extends HeaderComponent {

    @Input() sidebarId: string = "sidebar";

    private ID_CONFIGURACION_VPH: number = 1;  // Id de la configuración del VPH
    private ID_CONFIGURACION_MODO: number = 7; // Id de la configuración del MODO

    public usuario: any;
    public usuario_email: string = '';


    constructor(
        private usuarioSvc: UsuarioService,
        public authService: AuthService,
        private _configuracionxUsuarioSvc: ConfiguracionXUsuarioService,
        public router: Router) {
        super();

        // Obtener los datos del usuario logueado
        this.usuarioSvc.getUsuarioLogueado().subscribe((usuario) => {
            this.usuario = usuario;

            this.verificarConfiguracionesEnBd(this.usuario);
        });

    }

    // Esto es solo cuando el usuario ingresa por primera vez
    verificarConfiguracionesEnBd(usuario: any): void {

        let idsConfiguraciones = [this.ID_CONFIGURACION_VPH, this.ID_CONFIGURACION_MODO];

        for (let index = 0; index < idsConfiguraciones.length; index++) {

            this._configuracionxUsuarioSvc
                .getConfiguracionxIdentificacionAndIdConfig(usuario.per_identificacion, idsConfiguraciones[index])
                .subscribe(respuesta => {

                    // Si la respuesta tiene una longitud === 0 debo registrar la configuración automáticamente.
                    // Mejorarla para que no siempre se agregue true en la linea 99
                    if (respuesta.objetoRespuesta.length === 0) {

                        this.registrarConfiguracion(usuario.per_identificacion, idsConfiguraciones[index]);
                    }
                    else {

                        switch (respuesta.objetoRespuesta[0].confu_conf_id) {

                            case this.ID_CONFIGURACION_VPH:

                                // Guardar la configuración en el localstorage
                                const configuracionVph = {
                                    id: respuesta.objetoRespuesta[0].confu_id,
                                    estado: respuesta.objetoRespuesta[0].confu_estado
                                }

                                localStorage.setItem('configuracionVph', JSON.stringify(configuracionVph));

                                break;

                            case this.ID_CONFIGURACION_MODO:

                                // Guardar la configuración en el localstorage
                                const configuracionModo = {
                                    id: respuesta.objetoRespuesta[0].confu_id,
                                    estado: respuesta.objetoRespuesta[0].confu_estado
                                }

                                localStorage.setItem('configuracionModo', JSON.stringify(configuracionModo));

                                break;
                        }

                    }

                });
        }

    }

    private registrarConfiguracion(identificacion: string, idConfiguracion: number): void {

        const objEnviar: ConfiguracionXUsuario = {
            confu_usu_per_identificacion: identificacion,
            confu_conf_id: idConfiguracion,
            confu_estado: true
        };

        this._configuracionxUsuarioSvc.createConfiguracionxUsuario(objEnviar).subscribe((respuesta) => {
            console.log('configuracionx usuario create', respuesta);

            if (respuesta.codigoRespuesta === 0) {
                // Vuelvo a hacer la verificación para que se guarde la configuracion en el localStorage
                this.verificarConfiguracionesEnBd(this.usuario);
            }
        })
    }

    public consultarUsuario(usuario: any) {
        if (usuario) {
            this.usuarioSvc.usuarioConsultar.next(usuario);
            this.router.navigate(['/usuarios/actualizar/', usuario.per_identificacion]);
        }
    }

    public cerrarSesion() {
        this.authService.SignOut();
    }

}
