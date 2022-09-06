import { Component, Input } from '@angular/core';

import { Router } from '@angular/router';
import { HeaderComponent } from '@coreui/angular';
import { AuthService } from 'src/app/shared/services/auth.service';
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


    constructor(
        private usuarioSvc: UsuarioService,
        public authService: AuthService,
        public router: Router) {
        super();

        // Obtener los datos del usuario logueado
        this.usuarioSvc.getUsuarioLogueado().subscribe((usuario) => this.usuario = usuario);

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
