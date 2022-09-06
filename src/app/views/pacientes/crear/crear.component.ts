import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { Subscription } from 'rxjs';

import { ToasterComponent, ToasterPlacement } from '@coreui/angular';
import { EnumService } from 'src/app/shared/services/enum.service';
import { PacienteService } from 'src/app/shared/services/paciente.service';
import { Paciente } from '../../../models/paciente.model';
import { EpsService } from '../../../shared/services/eps.service';
import { PersonaService } from '../../../shared/services/persona.service';
import { SnackbarToastService } from '../../../shared/services/snackbar-toast.service';
import { transformEnum } from '../../../util/enum.util';

@Component({
    selector: 'app-crear',
    templateUrl: './crear.component.html',
    styleUrls: ['./crear.component.scss'],
})
export class CrearComponent implements OnInit, OnDestroy {
    public placement = ToasterPlacement.TopEnd;
    @ViewChild(ToasterComponent) toaster!: ToasterComponent;

    public todayDate: Date = new Date();

    public selectEducationLeve = [];
    public selectMaritalStatus = [];
    public selectLaboralStatus = [];
    public selectRegimenSalud = [];
    public selectDiabetes = [];
    public selectFuma = [];
    public selectPartos = [];
    public selectDispIntrauterino = [];
    public selectTiempoInsercion = [];
    public selectAnticonceptivosOrales = [];
    public selectRelacionCondon = [];
    public selectVacunaVph = [];
    public selectUltimaCitologia = [];
    public selectPruebaVPH = [];
    public selectMenopausia = [];

    public idPaciente!: number;
    public idEps!: number;
    public idEpsDespues!: number;
    public nombreEps!: number;
    public esActualizar: boolean = false;
    public allEps: any[] = [];
    public epsSeleccionada: string = '';
    public formulario!: FormGroup;
    private msmAgregado: string = 'Agregado Exitosamente!';
    private msmActualizado: string = 'Actualizado Exitosamente!';

    public tiposDeDocumento: any = [
        {
            Abreviatura: 'CC',
            Descripcion: 'C.C',
        },
        {
            Abreviatura: 'TI',
            Descripcion: 'T.I',
        },
    ];

    private regexEmail =
        /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
    private lastIdEps!: number;
    public subscription!: Subscription;

    constructor(
        private enumService: EnumService,
        private fb: FormBuilder,
        private pacienteService: PacienteService,
        private personaService: PersonaService,
        private epsService: EpsService,
        private router: Router,
        private _snackbar: SnackbarToastService,
        private activatedRoute: ActivatedRoute
    ) { }

    ngOnInit(): void {
        console.clear();

        // Obtengo el parametro que viene en la url
        this.activatedRoute.params.subscribe(({ id }) => (this.idPaciente = id));

        this.crearFormulario();

        // Editar Paciente
        if (
            (this.idPaciente && this.idPaciente !== null) ||
            this.idPaciente !== undefined
        ) {
            console.log('Actualizaré Paciente');

            // Deshabilito la modificación del Nº. Identificación
            this.formulario.get("per_identificacion")?.disable();

            this.llenarForm();
            this.esActualizar = true;

            // Deshabilito la modificación del Nº. Identificación
            //this.formulario.get('per_identificacion')?.disable();
        } else {
            console.log('Crearé Paciente');
        }

        this.getEps();
        this.getEnumEducationLevel();
        this.getEnumMaritalStatus();
        this.getEnumLaboralStatus();
        this.getEnumRegimenSalud();
        this.getEnumDiabetes();
        this.getEnumFuma();
        this.getEnumPartos();
        this.getEnumDispositivoIntrauterino();
        this.getEnumTiempoInsercion();
        this.getEnumAnticonceptivosOrales();
        this.getEnumRelacionCondon();
        this.getEnumVacunaVph();
        this.getEnumUltimaCitologia();
        this.getEnumPruebaVph();
        this.getEnumMenopausia();
    }

    private crearFormulario() {
        this.formulario = this.fb.group({
            per_identificacion: [null, [Validators.required, Validators.maxLength(10)]],
            per_primer_nombre: ['', [Validators.required]],
            per_otros_nombres: [''],
            per_primer_apellido: ['', [Validators.required]],
            per_segundo_apellido: ['', [Validators.required]],
            pac_fecha_nacimiento: ['', [Validators.required]],
            pac_direccion: ['', [Validators.required]],
            per_tip_id: [null, [Validators.required]],
            pac_telefono: ['', [Validators.required]],
            pac_celular: ['', [Validators.required]],
            pac_correo: ['', [Validators.required, Validators.pattern(this.regexEmail)]],
            pac_contacto_alternativo: ['', [Validators.required]],
            pac_telefono_contacto_alternativo: ['', [Validators.required]],
            pac_nivel_educacion: ['', [Validators.required]],
            pac_estado_civil: ['', [Validators.required]],
            pac_situacion_laboral: ['', [Validators.required]],
            pac_regimen_salud: ['', [Validators.required]],
            pac_estrato: ['', [Validators.required]],
            pac_diabetes: ['', [Validators.required]],
            pac_fuma: ['', [Validators.required]],
            pac_peso: ['', [Validators.required]],
            pac_talla: ['', [Validators.required]],
            pac_primera_mestruacion: ['', [Validators.required]],
            pac_partos: ['', [Validators.required]],
            pac_dispositivo_intrauterino: ['', [Validators.required]],
            pac_tiempo_insercion_DIU: ['', [Validators.required]],
            pac_anticonceptivos_orales: ['', [Validators.required]],
            pac_parejas_sexuales: ['', [Validators.required]],
            pac_relacion_condon: ['', [Validators.required]],
            pac_vacuna_vph: ['', [Validators.required]],
            pac_ultima_citologia: ['', [Validators.required]],
            pac_prueba_ADN_VPH: ['', [Validators.required]],
            pac_menopausia: ['', [Validators.required]],
            pac_infecciones_ts: ['', [Validators.required]],
            eps_nombre: ['', [Validators.required]],
        });

        this.formulario.valueChanges.subscribe((eps) => {
            this.epsSeleccionada = eps.eps_nombre;
        });
    }

    private llenarForm() {
        this.subscription = this.pacienteService.pacienteConsultar.subscribe(
            (res) => {
                if (res) {
                    console.log('Formulario: ', res);

                    this.formulario.patchValue(res);

                    console.log('res Paciente:' + JSON.stringify(res));
                    this.idEpsDespues = parseInt(JSON.stringify(res.pac_eps_id));
                    console.log('id res Paciente' + this.idEpsDespues);
                }
            }
        );
    }

    private getEps() {
        this.epsService.getEps().subscribe((res) => {
            this.allEps = res.objetoRespuesta;

            if (this.esActualizar) {
                // Obtener el nombre de la eps por el id
                for (const eps of this.allEps) {
                    if (eps.eps_id === this.idEpsDespues) {
                        this.nombreEps = eps.eps_nombre;
                        console.log('this.nombreEps: ' + this.nombreEps);

                        break;
                    }
                }

                this.formulario.patchValue({ eps_nombre: this.nombreEps });
            }
        });
    }

    public getIdEps(epsSeleccionada: string): void {
        console.log('value epsSeleccionada: ' + epsSeleccionada);
        console.log('value this.allEps: ' + JSON.stringify(this.allEps));

        for (const i in this.allEps) {
            if (this.allEps[i].eps_nombre === epsSeleccionada) {
                this.idEps = this.allEps[i].eps_id;
                console.log('this.idEps: ' + this.idEps);

                break;
            }
        }
    }

    private getEnumEducationLevel() {
        this.enumService
            .getEnum('paciente', 'pac_nivel_educacion')
            .subscribe((res) => {
                if (res.objetoRespuesta) {
                    this.selectEducationLeve = transformEnum(res.objetoRespuesta);
                }
            });
    }

    private getEnumMaritalStatus() {
        this.enumService
            .getEnum('paciente', 'pac_estado_civil')
            .subscribe((res) => {
                if (res.objetoRespuesta) {
                    this.selectMaritalStatus = transformEnum(res.objetoRespuesta);
                }
            });
    }

    private getEnumLaboralStatus() {
        this.enumService
            .getEnum('paciente', 'pac_situacion_laboral')
            .subscribe((res) => {
                if (res.objetoRespuesta) {
                    this.selectLaboralStatus = transformEnum(res.objetoRespuesta);
                }
            });
    }

    private getEnumRegimenSalud() {
        this.enumService
            .getEnum('paciente', 'pac_regimen_salud')
            .subscribe((res) => {
                if (res.objetoRespuesta) {
                    this.selectRegimenSalud = transformEnum(res.objetoRespuesta);
                }
            });
    }

    private getEnumDiabetes() {
        this.enumService.getEnum('paciente', 'pac_diabetes').subscribe((res) => {
            if (res.objetoRespuesta) {
                this.selectDiabetes = transformEnum(res.objetoRespuesta);
            }
        });
    }

    private getEnumFuma() {
        this.enumService.getEnum('paciente', 'pac_fuma').subscribe((res) => {
            if (res.objetoRespuesta) {
                this.selectFuma = transformEnum(res.objetoRespuesta);
            }
        });
    }

    private getEnumPartos() {
        this.enumService.getEnum('paciente', 'pac_partos').subscribe((res) => {
            if (res.objetoRespuesta) {
                this.selectPartos = transformEnum(res.objetoRespuesta);
            }
        });
    }

    private getEnumDispositivoIntrauterino() {
        this.enumService
            .getEnum('paciente', 'pac_dispositivo_intrauterino')
            .subscribe((res) => {
                if (res.objetoRespuesta) {
                    this.selectDispIntrauterino = transformEnum(res.objetoRespuesta);
                }
            });
    }

    private getEnumTiempoInsercion() {
        this.enumService
            .getEnum('paciente', 'pac_tiempo_insercion_DIU')
            .subscribe((res) => {
                if (res.objetoRespuesta) {
                    this.selectTiempoInsercion = transformEnum(res.objetoRespuesta);
                }
            });
    }

    private getEnumAnticonceptivosOrales() {
        this.enumService
            .getEnum('paciente', 'pac_anticonceptivos_orales')
            .subscribe((res) => {
                if (res.objetoRespuesta) {
                    this.selectAnticonceptivosOrales = transformEnum(res.objetoRespuesta);
                }
            });
    }

    private getEnumRelacionCondon() {
        this.enumService
            .getEnum('paciente', 'pac_relacion_condon')
            .subscribe((res) => {
                if (res.objetoRespuesta) {
                    this.selectRelacionCondon = transformEnum(res.objetoRespuesta);
                }
            });
    }

    private getEnumVacunaVph() {
        this.enumService.getEnum('paciente', 'pac_vacuna_vph').subscribe((res) => {
            if (res.objetoRespuesta) {
                this.selectVacunaVph = transformEnum(res.objetoRespuesta);
            }
        });
    }

    private getEnumUltimaCitologia() {
        this.enumService
            .getEnum('paciente', 'pac_ultima_citologia')
            .subscribe((res) => {
                if (res.objetoRespuesta) {
                    this.selectUltimaCitologia = transformEnum(res.objetoRespuesta);
                }
            });
    }

    private getEnumPruebaVph() {
        this.enumService
            .getEnum('paciente', 'pac_prueba_ADN_VPH')
            .subscribe((res) => {
                if (res.objetoRespuesta) {
                    this.selectPruebaVPH = transformEnum(res.objetoRespuesta);
                }
            });
    }

    private getEnumMenopausia() {
        this.enumService
            .getEnum('paciente', 'pac_menopausia')
            .subscribe((res) => {
                if (res.objetoRespuesta) {
                    this.selectMenopausia = transformEnum(res.objetoRespuesta);
                }
            });
    }

    public save() {
        this.getIdEps(this.epsSeleccionada);

        this.savePersona();
    }

    private savePersona() {
        if (this.formulario.valid) {
            const objEnviar = {
                per_identificacion: this.formulario.get('per_identificacion')?.value,
                per_primer_nombre: this.formulario.get('per_primer_nombre')?.value,
                per_otros_nombres: this.formulario.get('per_otros_nombres')?.value,
                per_primer_apellido: this.formulario.get('per_primer_apellido')?.value,
                per_segundo_apellido: this.formulario.get('per_segundo_apellido')
                    ?.value,
                per_gen_id: '1',
                per_tip_id: this.formulario.get('per_tip_id')?.value,
            };

            if (!this.esActualizar) {
                this.personaService.createPersona(objEnviar).subscribe((res) => {
                    if (res.codigoRespuesta === 0) {
                        this.savePaciente();
                    }
                    console.log(res);
                });
            } else {
                this.personaService
                    .updatePersona(this.idPaciente, objEnviar)
                    .subscribe((res) => {
                        if (res.codigoRespuesta === 0) {
                            this.savePaciente();
                        }
                        console.log(res);
                    });
            }
        } else {
            // Completa los campos
            this._snackbar.status(600);
        }
    }

    public savePaciente() {
        const objEnviar: Paciente = {
            pac_per_identificacion: this.formulario.get('per_identificacion')?.value,
            pac_fecha_nacimiento: this.formulario.get('pac_fecha_nacimiento')?.value,
            pac_direccion: this.formulario.get('pac_direccion')?.value,
            pac_telefono: this.formulario.get('pac_telefono')?.value,
            pac_celular: this.formulario.get('pac_celular')?.value,
            pac_correo: this.formulario.get('pac_correo')?.value,
            pac_contacto_alternativo: this.formulario.get('pac_contacto_alternativo')
                ?.value,
            pac_telefono_contacto_alternativo: this.formulario.get(
                'pac_telefono_contacto_alternativo'
            )?.value,
            pac_nivel_educacion: this.formulario.get('pac_nivel_educacion')?.value,
            pac_estado_civil: this.formulario.get('pac_estado_civil')?.value,
            pac_situacion_laboral: this.formulario.get('pac_situacion_laboral')
                ?.value,
            pac_eps_id: this.idEps,
            pac_regimen_salud: this.formulario.get('pac_regimen_salud')?.value,
            pac_estrato: this.formulario.get('pac_estrato')?.value,
            pac_diabetes: this.formulario.get('pac_diabetes')?.value,
            pac_fuma: this.formulario.get('pac_fuma')?.value,
            pac_peso: this.formulario.get('pac_peso')?.value,
            pac_talla: this.formulario.get('pac_talla')?.value,
            pac_primera_mestruacion: this.formulario.get('pac_primera_mestruacion')
                ?.value,
            pac_partos: this.formulario.get('pac_partos')?.value,
            pac_dispositivo_intrauterino: this.formulario.get(
                'pac_dispositivo_intrauterino'
            )?.value,
            pac_tiempo_insercion_DIU: this.formulario.get('pac_tiempo_insercion_DIU')
                ?.value,
            pac_anticonceptivos_orales: this.formulario.get(
                'pac_anticonceptivos_orales'
            )?.value,
            pac_parejas_sexuales: this.formulario.get('pac_parejas_sexuales')?.value,
            pac_relacion_condon: this.formulario.get('pac_relacion_condon')?.value,
            pac_vacuna_vph: this.formulario.get('pac_vacuna_vph')?.value,
            pac_ultima_citologia: this.formulario.get('pac_ultima_citologia')?.value,
            pac_prueba_ADN_VPH: this.formulario.get('pac_prueba_ADN_VPH')?.value,
            pac_menopausia: this.formulario.get('pac_menopausia')?.value,
            pac_infecciones_ts: this.formulario.get('pac_infecciones_ts')?.value,
        };

        console.log(
            '🚀 ~ file: crear.component.ts ~ line 424 ~ CrearComponent ~ savePaciente ~ objEnviar',
            objEnviar
        );
        console.log('esActualizar: ', this.esActualizar);

        if (!this.esActualizar) {
            console.log('🚀 ~ objEnviar Create', objEnviar);
            this.pacienteService.createPaciente(objEnviar).subscribe((res) => {
                console.log('respuesta: ' + res);

                if (res.codigoRespuesta === 0) {
                    this._snackbar.status(707, this.msmAgregado);

                    setTimeout(() => {
                        this.router.navigate(['/pacientes/consultar']);
                    }, 2000);
                }
                else if (res.codigoRespuesta === -1) {
                    // Paciente Duplicado: Número de Documento
                    this._snackbar.status(303);
                }
                else {
                    // 404: Error, No es posible procesar la solicitud
                    this._snackbar.status(404);
                }

                console.log(res);
            });
        } else {
            //console.log('Paciente Update: ' + JSON.stringify(objEnviar));

            this.pacienteService
                .updatePaciente(this.idPaciente, objEnviar)
                .subscribe((res) => {
                    console.log('res Update: ' + res);

                    if (res.codigoRespuesta === 0) {
                        this._snackbar.status(707, this.msmActualizado);

                        this.router.navigate(['/pacientes/consultar']);

                    } else {
                        // 404: Error, No es posible procesar la solicitud
                        this._snackbar.status(404);
                    }

                    console.log(res);
                });
        }
    }

    ngOnDestroy() {
        this.pacienteService.pacienteConsultar.next({});

        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }
}
