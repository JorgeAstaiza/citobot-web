import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { AuthService } from 'src/app/shared/services/auth.service';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
    formulario!: FormGroup;
    hide: boolean = true;
    constructor(public authService: AuthService, private fb: FormBuilder) { }
    ngOnInit(): void {
        this.crearFormulario();
    }
    private crearFormulario() {
        this.formulario = this.fb.group({
            usu_email: [null, [Validators.required]],
            usu_clave: [null, [Validators.required]],
        });
    }

    public loginUser() {
        const email = this.formulario.get('usu_email')?.value;
        const password = this.formulario.get('usu_clave')?.value;
        if (this.formulario.valid) {

            // TODO: Para evitar dar 2 click en iniciar fue necesario iniciar 2 veces sesión... Revisar esto a futuro
            for (let index = 0; index <= 1; index++) {
                this.authService.SignIn(email, password).then((res: any) => { });
            }

        }
    }
}
