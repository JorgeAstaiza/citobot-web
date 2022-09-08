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

    public newMessages = new Array(4);
    public newTasks = new Array(5);
    public newNotifications = new Array(5);
    public usuario: any;
    public usuario_email: string = '';
    private id_Config_Habilitar_Vph: number = 1; // Id de la configuración


    constructor(
        private usuarioSvc: UsuarioService,
        public authService: AuthService,
        private _configuracionxUsuarioSvc: ConfiguracionXUsuarioService,
        public router: Router) {
        super();

        // Obtener los datos del usuario logueado
        this.usuarioSvc.getUsuarioLogueado().subscribe((usuario) => {
            this.usuario = usuario;

            this.verificarConfiguracionVphEnBd(this.usuario);
        });

    }

    // Esto es solo cuando el usuario ingresa por primera vez
    verificarConfiguracionVphEnBd(usuario: any): void {
        this._configuracionxUsuarioSvc.getConfiguracionxIdentificacionAndIdConfig(usuario.per_identificacion, this.id_Config_Habilitar_Vph).subscribe(respuesta => {

            // Si la respuesta tiene una longitud === 0 debo registrar la configuración automáticamente.
            if (respuesta.objetoRespuesta.length === 0) {
                this.registrarConfiguracion(usuario.per_identificacion, this.id_Config_Habilitar_Vph);
            }
            else {

                // Guardar la configuración en el localstorage
                const configuracionVph = {
                    id: respuesta.objetoRespuesta[0].confu_id,
                    estado: respuesta.objetoRespuesta[0].confu_estado
                }

                localStorage.setItem('configuracionVph', JSON.stringify(configuracionVph));

            }

        })
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
                this.verificarConfiguracionVphEnBd(this.usuario);
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
