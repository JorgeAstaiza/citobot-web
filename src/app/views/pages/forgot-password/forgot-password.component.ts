import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/shared/services/auth.service';
import { SnackbarToastService } from 'src/app/shared/services/snackbar-toast.service';

@Component({
    selector: 'app-forgot-password',
    templateUrl: './forgot-password.component.html',
    styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {

    public formulario!: FormGroup;

    constructor(private fb: FormBuilder,
        public authService: AuthService,
        public router: Router,
        private _snackbar: SnackbarToastService) { }

    ngOnInit(): void {
        this.crearFormulario();
    }

    private crearFormulario() {
        /* Creating a form control with the name `usu_email` and setting the initial value to
        `null` and adding the `Validators.required` validator. */
        this.formulario = this.fb.group({
            usu_email: [null, [Validators.required]]
        });
    }

    public async restablecerClave() {

        try {
            const email = this.formulario.get('usu_email')?.value;

            await this.authService.sendPasswordResetEmail(email);

            this._snackbar.status(708, ' Revisa tu correo | Spam');

            // Redirecciono al login
            this.router.navigateByUrl('/login');

        } catch (error) {
            console.log(error);
        }
    }

}
