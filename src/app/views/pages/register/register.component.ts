import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { AuthService } from 'src/app/shared/services/auth.service';
import { EnumService } from 'src/app/shared/services/enum.service';

@Component({
    selector: 'app-register',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
    public formulario!: FormGroup;
    public usuarioRegistrado = false;
    public passwordMistake = false;
    public formInvalid = false;
    private regexEmail =
        /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
    private regexSoloNumeros = /^[0-9,$]*/;
    public selectRole = [];
    constructor(
        public authService: AuthService,
        private enumService: EnumService,
        private fb: FormBuilder
    ) { }

    ngOnInit() {
        this.crearForm();
        this.getEnumRole();
    }

    private crearForm() {
        this.formulario = this.fb.group({
            userName: [null, [Validators.required, Validators.minLength(5)]],
            id: [
                null,
                [Validators.required, Validators.pattern(this.regexSoloNumeros)],
            ],
            role: [null, [Validators.required]],
            email: [null, [Validators.required, Validators.pattern(this.regexEmail)]],
            password: [null, Validators.required],
            passwordRepeat: [null, Validators.required],
        });
    }

    private getEnumRole() {
        this.enumService.getEnum('usuario', 'usu_rol').subscribe((res) => {
            console.log(res.objetoRespuesta);
        });
    }

    public registrarUsuario() {
        const email = this.formulario.get('email')?.value;
        const password = this.formulario.get('password')?.value;
        const passwordRepeat = this.formulario.get('passwordRepeat')?.value;

        if (this.formulario.valid) {
            if (password === passwordRepeat) {

                this.authService
                    .SignUp(email, password, this.formulario.value)
                    .then((result: any) => {
                        console.log(result);
                        if (result.user.uid) {
                            this.usuarioRegistrado = true;
                            this.saveUserLocalStorage();
                            setTimeout(() => {
                                this.usuarioRegistrado = false;
                            }, 3000);
                        }
                    });
            } else {
                this.passwordMistake = true;
                setTimeout(() => {
                    this.passwordMistake = false;
                }, 3000);
            }
        } else {
            this.formInvalid = true;
            setTimeout(() => {
                this.formInvalid = false;
            }, 3000);
        }
    }

    private saveUserLocalStorage() {
        console.log(this.formulario.value);
        const objEnviar = {
            usu_per_identificacion: this.formulario.get('id')?.value,
            usu_usuario: this.formulario.get('userName')?.value,
            usu_clave: this.formulario.get('password')?.value,
            usu_email: this.formulario.get('email')?.value,
            usu_pro_id: 1,
            usu_rol: this.formulario.get('role')?.value,
            usu_estado: 'Activo',
        };
        localStorage.setItem('usuario', JSON.stringify(objEnviar));
        // this.authService.registerUser(objEnviar).subscribe((res) => {
        //   console.log(res);

        // })
    }
}
