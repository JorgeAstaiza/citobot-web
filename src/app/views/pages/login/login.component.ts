import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { AuthService } from 'src/app/shared/services/auth.service';
import { SnackbarToastService } from 'src/app/shared/services/snackbar-toast.service';
import { UsuarioService } from 'src/app/shared/services/usuario.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  formulario!: FormGroup;
  hide: boolean = true;
  constructor(
    public authService: AuthService,
    private fb: FormBuilder,
    private usuarioService: UsuarioService,
    private _snackbar: SnackbarToastService
  ) {}
  ngOnInit(): void {
    this.crearFormulario();
  }

  private crearFormulario() {
    this.formulario = this.fb.group({
      usu_email: [null, [Validators.required]],
      usu_clave: [null, [Validators.required]],
    });
  }

  public async loginUser() {
    const email = this.formulario.get('usu_email')?.value;
    const password = this.formulario.get('usu_clave')?.value;
    if (this.formulario.valid) {
      this.usuarioService.getUsuarioByEmail(email).subscribe((res) => {
        if (res.objetoRespuesta.length !== 0) {
          if (res.objetoRespuesta[0].usu_estado === 'Activo') {
            // TODO: Para evitar dar 2 click en iniciar fue necesario iniciar 2 veces sesión... Revisar esto a futuro
            for (let index = 0; index <= 1; index++) {
              try {
                this.authService.SignIn(email, password).then((res: any) => {});
              } catch (error) {
                console.log('Error: ', error);
              }
            }
          } else {
            this._snackbar.status(101, 'Error', 'Usuario inactivo');
          }
        } else {
          this._snackbar.status(101, 'Error', 'Usuario no registrado');
        }
      });
    }
  }
}
