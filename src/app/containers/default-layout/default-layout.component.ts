import { Component } from '@angular/core';

import { UsuarioService } from '../../shared/services/usuario.service';
import { navItemsAdmin, navItemsUsuario } from './_nav';

@Component({
    selector: 'app-dashboard',
    templateUrl: './default-layout.component.html',
})
export class DefaultLayoutComponent {

    public navItemsAdmin = navItemsAdmin;
    public navItemsUsuario = navItemsUsuario;
    public usuario: any;
    public usuario_email: string = '';

    public perfectScrollbarConfig = {
        suppressScrollX: true,
    };

    constructor(private usuarioSvc: UsuarioService) {

        // Obtener los datos del usuario logueado
        this.usuarioSvc.getUsuarioLogueado().subscribe((usuario) => this.usuario = usuario);

    }

}
