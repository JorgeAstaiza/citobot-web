import { Component, ElementRef, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';

import { Observable, Subject } from 'rxjs';

import { WebcamImage, WebcamUtil } from 'ngx-webcam';
import { Tamizaje } from 'src/app/models/tamizaje.model';
import { InstruccionesTamizajeComponent } from 'src/app/popus/instrucciones-tamizaje/instrucciones-tamizaje.component';
import { EnumService } from 'src/app/shared/services/enum.service';
import { SnackbarToastService } from 'src/app/shared/services/snackbar-toast.service';
import { transformEnum } from 'src/app/util/enum.util';
import { Imagen } from '../../../models/imagen';
import { ImagenService } from '../../../shared/services/imagen.service';
import { PacienteService } from '../../../shared/services/paciente.service';
import { TamizajeService } from '../../../shared/services/tamizaje.service';
import { UsuarioService } from '../../../shared/services/usuario.service';

@Component({
    selector: 'app-crear',
    templateUrl: './crear.component.html',
    styleUrls: ['./crear.component.scss'],
})
export class CrearComponent implements OnInit {

    public formulario!: FormGroup;
    public estaHabilitado: boolean = false;
    public todayDate = new Date();
    public archivos: any[] = [];
    public loading: boolean = false;
    public isChecked: boolean = true;
    public paciente: string = '';
    public paciente_identificacion: any | null;
    public paciente_primerNombre: string = '';
    public paciente_segundoNombre: string = '';
    public paciente_primerApellido: string = '';
    public paciente_segundoApellido: string = '';
    public usuario: any | null;
    public usuario_email: string = '';
    public usuario_identificacion: any | null;
    public previsualizacionImagen1: string = '';
    public previsualizacionImagen2: string = '';
    public previsualizacionImagen3: string = '';
    public imagenDefinitiva: string = '';
    public tam_id: number = 0;
    public tam_vph: string = '';
    public tam_contraste: string = '';
    public tam_vph_booleano!: boolean;
    public idUltimoTamizaje: any;
    public estadoConfiguracionVph: string | null = '';
    public urlImagen: string = '';
    private msmAgregado: string = 'Agregado Exitosamente!';
    contrastes: string[] = [];
    public showWebcam = true;
    public allowCameraSwitch = true;
    public multipleWebcamsAvailable = false;
    private nextWebcam: Subject<boolean | string> = new Subject<
        boolean | string
    >();
    public webcamImage: any = [];
    public deviceId!: string;
    // webcam snapshot trigger
    private trigger: Subject<void> = new Subject<void>();
    public canvas!: ElementRef;
    captures: WebcamImage[] = [];

    private base64Img!: string;
    public btnCapture = false;

    checkImagen!: FormControl;

    constructor(
        private _fb: FormBuilder,
        private tamizajeSvc: TamizajeService,
        private imagenSvc: ImagenService,
        private usuarioSvc: UsuarioService,
        private activatedRoute: ActivatedRoute,
        private router: Router,
        private pacienteService: PacienteService,
        private _snackbar: SnackbarToastService,
        public dialog: MatDialog,
        private enumService: EnumService
    ) {
        this.obtenerIdUsuario();
        this.verificarConfiguracionVphEnLocalStorage();
        // Verificar la configuracón que se estableció del Vph en el módulo de configuraciones
        // Parametros de la url
        this.activatedRoute.params.subscribe((params: any) => {
            // Nuevo Tamizaje Con Plantilla
            if (params !== undefined) {
                console.log('Params:', params.idPaciente);
                this.paciente_identificacion = params.idPaciente;

                console.log('Params:', params.vphTamizaje);
                this.tam_vph = params.vphTamizaje;

                console.log('Params:', params.contrasteTamizaje);
                this.tam_contraste = params.contrasteTamizaje;

                console.log('Params:', params.idTamizaje);
                this.tam_id = params.idTamizaje;

                this.obtenerNombreDelPaciente();
                this.contruir_formulario();
                this.llenarForm();
                this.obtenerImagenFtp(params.idTamizaje);
            }
            this.checkImagen = new FormControl(null, Validators.required);
        });


    }

    ngOnInit(): void {

        this.getEnumContrastes();
        WebcamUtil.getAvailableVideoInputs().then(
            (mediaDevices: MediaDeviceInfo[]) => {
                this.multipleWebcamsAvailable = mediaDevices && mediaDevices.length > 1;
            }
        );
    }

    private contruir_formulario(): void {
        this.formulario = this._fb.group({
            vph: [true],
            contraste: ['', [Validators.required]],
            foto: [null, [Validators.required]],
        });

        this.formulario.get('vph')?.valueChanges.subscribe((value) => {
            this.isChecked = value;
        });

        this.formulario.get('foto')?.valueChanges.subscribe((value) => {
            switch (value) {
                case 1:
                    // La imagen definitiva es la Imagen1
                    this.imagenDefinitiva = this.previsualizacionImagen1;
                    break;

                case 2:
                    // La imagen definitiva es la Imagen2
                    this.imagenDefinitiva = this.previsualizacionImagen2;
                    break;

                case 3:
                    // La imagen definitiva es la Imagen3
                    this.imagenDefinitiva = this.previsualizacionImagen3;
                    break;

                default:
                    break;
            }
        });
    }

    private getEnumContrastes() {
        this.enumService.getEnum('tamizaje', 'tam_contraste').subscribe((res) => {
            if (res.objetoRespuesta) {
                this.contrastes = transformEnum(res.objetoRespuesta);
            }
        });
    }

    private obtenerImagenFtp(idTamizaje: number) {
        try {
            this.imagenSvc.getImagenByIdTamizaje(idTamizaje).subscribe((imagen) => {
                if (imagen.objetoRespuesta[0].ima_ruta !== undefined) {
                    this.urlImagen = imagen.objetoRespuesta[0].ima_ruta;
                    this.obtenerImgFtp(this.urlImagen);
                } else {
                    this.urlImagen =
                        'https://images.unsplash.com/photo-1583106853354-9d88c18d46cf?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1064&q=80';
                }
            });
        } catch (error) {
            console.log('Error: ', error);
        }
    }

    private obtenerImgFtp(nombre: string) {
        const objEnviar = {
            nombreImg: nombre,
        };
        this.imagenSvc.getImagenByFtp(objEnviar).subscribe((res) => {
            this.createImageFromBlob(res);
        });
    }

    createImageFromBlob(image: Blob) {
        let reader = new FileReader();
        reader.addEventListener(
            'load',
            () => {
                const obj = {
                    imageAsDataUrl: reader.result,
                };
                this.webcamImage.push(obj);
            },
            false
        );

        if (image) {
            reader.readAsDataURL(image);
        }
    }

    private obtenerNombreDelPaciente(): void {
        this.pacienteService
            .getPacienteById(this.paciente_identificacion)
            .subscribe((res) => {
                if (res.codigoRespuesta == 0) {
                    this.paciente =
                        res.objetoRespuesta[0].per_primer_nombre +
                        ' ' +
                        res.objetoRespuesta[0].per_otros_nombres +
                        ' ' +
                        res.objetoRespuesta[0].per_primer_apellido +
                        ' ' +
                        res.objetoRespuesta[0].per_segundo_apellido;
                }
            });
    }

    private llenarForm(): void {
        this.tam_vph !== 'Positivo'
            ? (this.tam_vph_booleano = false)
            : (this.tam_vph_booleano = true);

        this.obtenerImagenPorIdTamizaje();

        this.formulario.patchValue({ contraste: this.tam_contraste });
        this.formulario.patchValue({ vph: this.tam_vph_booleano });
        this.formulario.patchValue({ foto: 1 });
    }

    private obtenerIdUsuario() {
        this.usuario = JSON.parse(localStorage.getItem('user') as string);
        this.usuario_email = this.usuario.email;

        this.usuarioSvc
            .getUsuarioByEmail(this.usuario_email)
            .subscribe((usuario) => {
                this.usuario_identificacion = usuario.objetoRespuesta[0]?.per_identificacion;
            });

    }

    private verificarConfiguracionVphEnLocalStorage() {

        const configuracionVph = JSON.parse(localStorage.getItem('configuracionVph')!);
        this.estadoConfiguracionVph = configuracionVph.estado;

    }

    private obtenerImagenPorIdTamizaje() {
        this.imagenSvc.getImagenByIdTamizaje(this.tam_id).subscribe((imagen) => {
            this.urlImagen = imagen.objetoRespuesta[0].ima_ruta;
        });
    }

    public toggleWebcam(): void {
        this.showWebcam = !this.showWebcam;
    }

    public showNextWebcam(directionOrDeviceId: boolean | string): void {
        // true => move forward through devices
        // false => move backwards through devices
        // string => move to device with given deviceId
        this.nextWebcam.next(directionOrDeviceId);
    }

    public get nextWebcamObservable(): Observable<boolean | string> {
        return this.nextWebcam.asObservable();
    }

    public handleImage(webcamImage: WebcamImage): void {
        this.webcamImage.push(webcamImage);
        if (this.webcamImage.length === 3) {
            this.btnCapture = true;
        }
    }

    public cameraWasSwitched(deviceId: string): void {
        this.deviceId = deviceId;
    }

    public triggerSnapshot(): void {
        this.trigger.next();
    }

    public get triggerObservable(): Observable<void> {
        return this.trigger.asObservable();
    }

    setPhoto(idx: number) {
        this.base64Img = this.webcamImage[idx].imageAsBase64;
    }

    public save(): void {
        if (this.formulario.valid && this.checkImagen.valid) {
            this.formulario.get('vph')?.value === true
                ? (this.tam_vph = 'Positivo')
                : this.formulario.get('vph')?.value === false
                    ? (this.tam_vph = 'Negativo')
                    : (this.tam_vph = 'Sin VPH');

            const newTamizaje: Tamizaje = {
                tam_pac_per_identificacion: this.paciente_identificacion,
                tam_usu_per_identificacion: this.usuario_identificacion,
                tam_fecha: this.todayDate,
                tam_contraste: this.formulario.get('contraste')?.value,
                tam_vph: this.tam_vph,
                tam_niv_id: 18, // TODO: Cambiar este nivel de riesgo cuando ya sepamos cual será el id a registrar, de momento será ""
            };

            this.saveTamizaje(newTamizaje);
        } else {
            // Completa los campos
            this._snackbar.status(600);
        }
    }

    private saveTamizaje(newTamizaje: Tamizaje): void {
        this.tamizajeSvc.createTamizaje(newTamizaje).subscribe((res) => {
            try {
                if (res.codigoRespuesta === 0) {
                    // Obtener el id del último tamizaje agregado: útil para guardar la imagen
                    this.obtenerUltimoIdTamizajeXIdPaciente();
                } else {
                    // 404: Error, No es posible procesar la solicitud
                    this._snackbar.status(404);
                }
            } catch (error) {
                console.log('Error: ', error);
            }
        });
    }

    public obtenerUltimoIdTamizajeXIdPaciente() {
        this.tamizajeSvc
            .getUltimoIdTamizajeXIdPaciente(this.paciente_identificacion)
            .subscribe((res) => {
                this.idUltimoTamizaje = Object.values(res.objetoRespuesta[0])[0];
                // Guardo la imagen
                this.saveImagenConRuta(this.idUltimoTamizaje);
            });
    }

    public saveImagenConRuta(idUltimoTamizaje: number): void {
        const objImagen = {
            base64: this.base64Img,
            nombre: `${this.paciente_identificacion}_${this.idUltimoTamizaje}.jpeg`,
        };

        this.imagenSvc.guardarImagenFTP(objImagen).subscribe();
        const newImagen: Imagen = {
            ima_tam_id: idUltimoTamizaje,
            ima_tipo: 'jpeg', //TODO: Colocar esto dinámicamente y los ENUM: Mayúsculas
            ima_ruta: `${this.paciente_identificacion}_${this.idUltimoTamizaje}.jpeg`,
        };

        this.imagenSvc.createImagenConRuta(newImagen).subscribe((res) => {
            if (res.codigoRespuesta === 0) {
                this._snackbar.status(707, this.msmAgregado);
                this.router.navigateByUrl('tamizajes/consultar');
            } else {
                // 404: Error, No es posible procesar la solicitud
                this._snackbar.status(404);
            }
        });
    }

    public verInstrucciones(): void {
        this.dialog.open(InstruccionesTamizajeComponent);
    }

}
