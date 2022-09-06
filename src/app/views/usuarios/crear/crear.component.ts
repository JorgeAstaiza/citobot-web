import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { Subscription } from 'rxjs';

import { ToasterComponent, ToasterPlacement } from '@coreui/angular';
import { AuthService } from 'src/app/shared/services/auth.service';
import { EnumService } from 'src/app/shared/services/enum.service';
import { SnackbarToastService } from 'src/app/shared/services/snackbar-toast.service';
import { UsuarioService } from 'src/app/shared/services/usuario.service';
import { Persona } from '../../../models/persona.model';
import { Usuario } from '../../../models/usuario.model';
import { PersonaService } from '../../../shared/services/persona.service';
import { ProfesionService } from '../../../shared/services/profesion.service';
import { transformEnum } from '../../../util/enum.util';

@Component({
    selector: 'app-crear',
    templateUrl: './crear.component.html',
    styleUrls: ['./crear.component.scss'],
})
export class CrearComponent implements OnInit {

    public placement: ToasterPlacement = ToasterPlacement.TopEnd;
    @ViewChild(ToasterComponent) toaster!: ToasterComponent;

    public selectRol = [];
    public selectEstado = [];
    public selectProfesiones: any[] = [];
    public selectProfesionesx2: any[] = [];
    public idUsuario !: number;
    public idProfesion !: number;
    public esActualizar: boolean = false;
    public profesionSeleccionada: string = '';
    public formulario!: FormGroup;
    private msmAgregado: string = 'Agregado Exitosamente!'
    private msmActualizado: string = 'Actualizado Exitosamente!'
    public usuarioRegistrado = false;

    private regexEmail =
        /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
    public lastIdProfesion!: number;
    public subscription!: Subscription;

    public hide: boolean = true;
    public tiposDeDocumento: any = [
        {
            Abreviatura: 'CC',
            Descripcion: 'C.C'
        },
        {
            Abreviatura: 'TI',
            Descripcion: 'T.I'
        }
    ]

    constructor(
        public authService: AuthService,
        private enumService: EnumService,
        private fb: FormBuilder,
        private usuarioService: UsuarioService,
        private personaService: PersonaService,
        private profesionService: ProfesionService,
        private _snackbar: SnackbarToastService,
        private activatedRoute: ActivatedRoute,
        private router: Router
    ) { }

    ngOnInit(): void {

        console.clear();

        // Obtengo el parametro que viene en la url
        this.activatedRoute.params.subscribe(({ id }) => this.idUsuario = id);

        this.crearFormulario();
        this.getProfesiones();

        // Editar Usuario
        if (this.idUsuario && this.idUsuario !== null || this.idUsuario !== undefined) {
            console.log('Actualizaré Usuario');

            this.llenarForm();
            this.esActualizar = true;

            // Deshabilito la modificación del los siguientes inputs
            this.formulario.get("per_identificacion")?.disable();
            this.formulario.get("usu_rol")?.disable();
            this.formulario.get("usu_email")?.disable();
            this.formulario.get("usu_usuario")?.disable();
            this.formulario.get("usu_clave")?.disable();
        }
        else {
            console.log('Crearé Usuario');
        }

        this.getEnumRol();
        this.getEnumEstado();

    }

    private crearFormulario() {

        this.formulario = this.fb.group({

            per_primer_nombre: ['', [Validators.required]],
            per_otros_nombres: [''],
            per_primer_apellido: ['', [Validators.required]],
            per_segundo_apellido: ['', [Validators.required]],
            per_tip_id: [null, Validators.required],
            per_identificacion: [null, [Validators.required, Validators.maxLength(10)]],
            usu_usuario: ['', [Validators.required, Validators.maxLength(10)]],
            usu_clave: [''],
            usu_email: ['', [Validators.pattern(this.regexEmail), Validators.maxLength(70), Validators.required]],
            pro_nombre: ['', [Validators.required]], // Profesión
            usu_rol: ['', [Validators.required]],
            usu_estado: ['', [Validators.required]]

        });

        this.formulario.get('pro_nombre')?.valueChanges.subscribe(profesion => this.profesionSeleccionada = profesion);

    }

    private llenarForm() {

        this.subscription = this.usuarioService.usuarioConsultar.subscribe(
            (res) => {
                if (res) {
                    console.log('res Usuario: ' + JSON.stringify(res));

                    this.formulario.patchValue(res);
                }
            }
        );

    }

    private getProfesiones() {

        this.profesionService.getProfesiones().subscribe((res) => {
            this.selectProfesiones = res.objetoRespuesta;

        });

    }

    private getIdProfesion() {

        for (const profesion of this.selectProfesiones) {

            if (profesion.pro_nombre === this.profesionSeleccionada) {

                this.idProfesion = profesion.pro_id;
                break;
            }
        }

    }

    private getEnumRol() {

        this.enumService.getEnum('usuario', 'usu_rol').subscribe((res) => {
            if (res.objetoRespuesta) {
                this.selectRol = transformEnum(res.objetoRespuesta);
            }
        });

    }

    private getEnumEstado() {

        this.enumService.getEnum('usuario', 'usu_estado').subscribe((res) => {
            if (res.objetoRespuesta) {
                this.selectEstado = transformEnum(res.objetoRespuesta);
            }
        });

    }

    public save() {

        this.savePersona();

        if (this.esActualizar) {

            this.updateEstado();
        }

    }

    public savePersona() {

        if (this.formulario.valid) {

            const objEnviar: Persona = {
                per_identificacion: this.formulario.get('per_identificacion')?.value,
                per_primer_nombre: this.formulario.get('per_primer_nombre')?.value,
                per_otros_nombres: this.formulario.get('per_otros_nombres')?.value,
                per_primer_apellido: this.formulario.get('per_primer_apellido')?.value,
                per_segundo_apellido: this.formulario.get('per_segundo_apellido')?.value,
                per_gen_id: 1,
                per_tip_id: this.formulario.get('per_tip_id')?.value,
            };

            if (!this.esActualizar) {

                this.personaService.createPersona(objEnviar).subscribe((res) => {

                    res.codigoRespuesta === 0
                        ? this.saveUsuario()
                        : res.codigoRespuesta === -1
                            ? this._snackbar.status(303)  // 303: Usuario Duplicado: Número de Documento
                            : this._snackbar.status(404); // 404: Error, No es posible procesar la solicitud

                });

            } else {

                this.personaService.updatePersona(this.idUsuario, objEnviar).subscribe((res) => {
                    if (res.codigoRespuesta === 0) {
                        this.saveUsuario();
                    }
                    console.log(res);
                });
            }
        }
        else {
            // Completa los campos
            this._snackbar.status(600);
        }

    }

    public saveUsuario() {

        this.getIdProfesion();

        const objEnviar: Usuario = {

            usu_per_identificacion: this.formulario.get('per_identificacion')?.value,
            usu_usuario: this.formulario.get('usu_usuario')?.value,
            usu_clave: this.formulario.get('usu_clave')?.value,
            usu_email: this.formulario.get('usu_email')?.value,
            usu_pro_id: this.idProfesion,
            usu_rol: this.formulario.get('usu_rol')?.value,
            usu_estado: this.formulario.get('usu_estado')?.value

        };

        if (!this.esActualizar) {

            this.usuarioService.createUsuario(objEnviar).subscribe((res) => {

                if (res.codigoRespuesta === 0) {

                    const newUser = {
                        userName: this.formulario.get('usu_usuario')?.value,
                        id: this.formulario.get('per_identificacion')?.value,
                        role: this.formulario.get('usu_rol')?.value,
                        email: this.formulario.get('usu_email')?.value,
                        password: this.formulario.get('usu_clave')?.value,
                        passwordRepeat: this.formulario.get('usu_clave')?.value
                    }

                    // Registro en Firestore
                    let accion = 'crear';
                    this.saveUserInFirestore(newUser, accion);

                } else {
                    // 404: Error, No es posible procesar la solicitud
                    this._snackbar.status(404);
                }

                console.log(res);
            });

        } else {


            //let email = this.formulario.get('usu_email')?.value;

            //Actualizo datos del usuario en Firebase
            //this.updateUserInFirestore(email);

            delete objEnviar.usu_clave;

            // Actualizo datos del usuario en Mysql 
            this.usuarioService.updateUsuario(this.idUsuario, objEnviar).subscribe((res) => {

                if (res.codigoRespuesta === 0) {

                    this._snackbar.status(707, this.msmActualizado);
                    this.router.navigate(['/usuarios/consultar']);

                } else {
                    // 404: Error, No es posible procesar la solicitud
                    this._snackbar.status(404);
                }

                console.log(res);
            });

        }

    }

    updateUserInFirestore(email: string) {

        this.authService
            .updateUserFirebase(email)
            .then((result: any) => {
                console.log('saveUserInFirestore', result);
                /* if (result.user.uid) {

                    this._snackbar.status(707, this.msmActualizado)

                } */
            });
    }

    // Nuevo Usuario en Firebase
    saveUserInFirestore(newUser: any, accion: string) {

        this.authService
            .SignUp(newUser.email, newUser.password, newUser)
            .then((result: any) => {
                console.log('saveUserInFirestore', result);
                if (result.user.uid) {

                    accion === 'crear'
                        ? this._snackbar.status(707, this.msmAgregado)
                        : this._snackbar.status(707, this.msmActualizado)

                    this.router.navigate(['/usuarios/consultar']);
                }
            });
    }

    private updateEstado() {

        const objEstado = {
            usu_estado: this.formulario.get('usu_estado')?.value
        };

        this.usuarioService.changeStateUser(this.idUsuario, objEstado).subscribe((res) => {

            if (res.codigoRespuesta === 0) {

                console.log('Estado Actualizado');

                /* setTimeout(() => {
                    this.router.navigate(['/usuarios/consultar']);
                }, 2000); */

            } else {
                //this.snackbar.addToastSucces();;
                console.log('Estado No Actualizado');
            }

        })
    }

    ngOnDestroy() {

        this.usuarioService.usuarioConsultar.next({});

        if (this.subscription) {
            this.subscription.unsubscribe();
        }

    }

}
