import { Component, ElementRef, OnDestroy, OnInit } from '@angular/core';
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
export class CrearComponent implements OnInit, OnDestroy {
  public formulario!: FormGroup;
  public estaHabilitado: boolean = false;
  public todayDate = new Date();
  public loading: boolean = false;
  public isChecked: boolean = true;
  public modoPruebas = false;
  public paciente: string = '';
  public paciente_identificacion: any | null;
  public paciente_primerNombre: string = '';
  public paciente_segundoNombre: string = '';
  public paciente_primerApellido: string = '';
  public paciente_segundoApellido: string = '';
  public usuario: any | null;
  public usuario_email: string = '';
  public usuario_identificacion: any | null;
  public imagenDefinitiva: string = '';
  public tam_id: number = 0;
  public tam_vph: string = '';
  public tam_contraste: string = '';
  public tam_vph_booleano!: boolean;
  public idUltimoTamizaje: any;
  public estadoConfiguracionVph: string | null = '';
  public estadoConfiguracionModo: string | null = '';
  public urlImagen: string = '';
  contrastes: string[] = [];
  public showWebcam = true;
  public allowCameraSwitch = true;
  public multipleWebcamsAvailable = false;
  private nextWebcam: Subject<boolean | string> = new Subject<
    boolean | string
  >();
  public listaImagenesMostrar: any = [];
  public listaImagenesGuardar: any = [];

  public deviceId!: string;
  // webcam snapshot trigger
  private trigger: Subject<void> = new Subject<void>();
  public canvas!: ElementRef;
  captures: WebcamImage[] = [];
  public tipoImagen = 'image/jpeg';
  private propiedadesTipoFileImagen!: File;
  public btnCapture = false;
  private LIMITE_IMAGENES = 3;
  public cargandoImagenes = false;
  public tamizajeApartirDeOtro = false;
  checkImagen!: FormControl;
  public opcionesVph = ['Sin VPH', 'Positivo', 'Negativo'];
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
    // Verificar la configuracón que se estableció del Vph en el módulo de configuraciones
    // Parametros de la url
    this.activatedRoute.params.subscribe((params: any) => {
      // Nuevo Tamizaje Con Plantilla
      if (params !== undefined) {
        this.paciente_identificacion = params.idPaciente;
        this.tam_vph = params.vphTamizaje;
        this.tam_contraste = params.contrasteTamizaje;
        this.tam_id = params.idTamizaje;
        if (params?.idTamizaje) {
          this.tamizajeApartirDeOtro = true;
        } else {
          this.tamizajeApartirDeOtro = false;
        }   
        this.obtenerNombreImg(params.idTamizaje);
      }
    });
  }

  ngOnInit(): void {
    this.checkImagen = new FormControl(null);
    this.getEnumContrastes();
    WebcamUtil.getAvailableVideoInputs().then(
      (mediaDevices: MediaDeviceInfo[]) => {
        this.multipleWebcamsAvailable = mediaDevices && mediaDevices.length > 1;
      }
    );
    this.contruir_formulario();
    this.obtenerNombreDelPaciente();
    this.llenarForm();
    this.changeModo();
    this.verificarConfiguracionesEnLocalStorage();
  }
  ngOnDestroy(): void {
    this.listaImagenesMostrar = [];
  }
  private contruir_formulario(): void {
    this.formulario = this._fb.group({
      vph: [null],
      contraste: ['', [Validators.required]],
      foto: [null, [Validators.required]],
    });
  }

  private changeModo() {
    let modo: any = localStorage.getItem('configuracionModo');
    modo = JSON.parse(modo);
    if (modo?.estado === 'Entrenamiento') {
      this.modoPruebas = true;
      this.LIMITE_IMAGENES = 5;
      this.formulario.get('foto')?.clearValidators();
      this.checkImagen.clearValidators();
    } else {
      this.modoPruebas = false;
      this.LIMITE_IMAGENES = 3;
      this.formulario.get('foto')?.setValidators([Validators.required]);
      this.checkImagen.setValidators([Validators.required]);
    }
    this.formulario.updateValueAndValidity();
  }

  private getEnumContrastes() {
    this.enumService.getEnum('tamizaje', 'tam_contraste').subscribe((res) => {
      if (res.objetoRespuesta) {
        this.contrastes = transformEnum(res.objetoRespuesta);
      }
    });
  }

  /**
   * obtiene el nombre de la imagenes desde la base de datos y con ese nombre se 
   * consulta en AWS la url y tambien se obtiene la imagen entera de tipo File
   * para crear un tamizaje a partir de otro
   * @param idTamizaje 
   */
  private obtenerNombreImg(idTamizaje: number) {
    if (!idTamizaje) {
      return;
    }
    try {
      this.imagenSvc.getImagenByIdTamizaje(idTamizaje).subscribe((imagen) => {
        this.cargandoImagenes = true;
        if (imagen.objetoRespuesta.length > 1) {
          this.modoPruebas = true;
          this.LIMITE_IMAGENES = 5;
          for (const iterator of imagen.objetoRespuesta) {
            this.urlImagen = iterator.ima_ruta;
            this.obtenerUrlImagenAWS(this.urlImagen);
            this.getImageFileFromURL(this.urlImagen);
          }
        } else {
          if (imagen.objetoRespuesta[0]?.ima_ruta !== undefined) {
            this.getImageFileFromURL(imagen.objetoRespuesta[0].ima_ruta);
            this.modoPruebas = false;
            this.LIMITE_IMAGENES = 3;
            this.urlImagen = imagen.objetoRespuesta[0].ima_ruta;
            this.obtenerUrlImagenAWS(this.urlImagen);
          }
        }
      });
    } catch (error) {
      console.log('Error: ', error);
    }
  }

  /**
   * obtiene la imagen desde AWS y la transforma en tipo File cuando se quiere crear un tamizaje a partir de otro
   * @param nombreImg 
   */
  getImageFileFromURL(nombreImg: string) {
    this.imagenSvc.descargarImagenTipoFile(nombreImg).subscribe((res: Blob) => {
      if (res.type) {
        const imagen = new File([res], 'image.jpeg', { type: res.type });
        this.propiedadesTipoFileImagen = imagen;
        this.listaImagenesGuardar.push(imagen);
        this.setPhoto(0);
        this.checkImagen.setValue(0);
        this.checkImagen.markAsTouched();
      } else {
        this._snackbar.status(404);
      }
    })
  }

  /**
   * obtiene la url publica de la imagen a partir del nombre de la imagen almacenada en AWS
   * @param nombreImagen 
   */
  private obtenerUrlImagenAWS(nombreImagen: string) {
    this.imagenSvc.obtenerURLImagenAWS(nombreImagen).subscribe((res) => {
      if (!res.url) {
        return
      }
      this.cargandoImagenes = false;
      const imagenMostrar = {
        imageAsDataUrl: res.url
      }
      this.listaImagenesMostrar.push(imagenMostrar);
      if (this.LIMITE_IMAGENES === 5) {
        if (this.listaImagenesMostrar.length === this.LIMITE_IMAGENES) {
          this.cargandoImagenes = false;
          this.btnCapture = true;
        }
      } else {
        if (this.listaImagenesMostrar.length === 1) {
          this.cargandoImagenes = false;
          this.btnCapture = true;
          
        }
      }
    })
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
    this.obtenerImagenPorIdTamizaje();

    this.formulario.patchValue({ contraste: this.tam_contraste });
    this.formulario.patchValue({ vph: this.tam_vph });
    this.formulario.patchValue({ foto: 1 });
  }

  private obtenerIdUsuario() {
    this.usuario = JSON.parse(localStorage.getItem('user') as string);
    this.usuario_email = this.usuario.email;

    this.usuarioSvc
      .getUsuarioByEmail(this.usuario_email)
      .subscribe((usuario) => {
        this.usuario_identificacion =
          usuario.objetoRespuesta[0]?.per_identificacion;
      });
  }

  private verificarConfiguracionesEnLocalStorage() {
    // Configuración del Vph
    //--------------------------------------------
    if (!this.tamizajeApartirDeOtro) {
      const configuracionVph = JSON.parse(
        localStorage.getItem('configuracionVph')!
      );
      this.estadoConfiguracionVph = configuracionVph.estado;
      if (this.estadoConfiguracionVph === 'true') {
        this.formulario.get('vph')?.setValidators([Validators.required]);
        this.formulario.updateValueAndValidity();
      }
    } else {
      this.estadoConfiguracionVph = 'true';
      this.formulario.get('vph')?.setValidators([Validators.required]);
      this.formulario.updateValueAndValidity();
    }

    // Configuración del Modo
    //--------------------------------------------
    const configuracionModo = JSON.parse(
      localStorage.getItem('configuracionModo')!
    );
    this.estadoConfiguracionModo = configuracionModo.estado;
  }

  private obtenerImagenPorIdTamizaje() {
    this.imagenSvc.getImagenByIdTamizaje(this.tam_id).subscribe((imagen) => {
      this.urlImagen = imagen.objetoRespuesta[0]?.ima_ruta;
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
    // Convierte la imagen en un objeto de tipo File
    const imageFile = this.dataURLtoFile(webcamImage.imageAsDataUrl, 'foto.png');
    this.listaImagenesMostrar.push(webcamImage);
    this.listaImagenesGuardar.push(imageFile);
    if (this.listaImagenesMostrar.length === this.LIMITE_IMAGENES) {
      this.btnCapture = true;
    }
  }


  /**
   * convierte la imagen capturada por webcam a tipo File
   * @param dataUrl 
   * @param filename 
   * @returns imagen tipo File
   */
  private dataURLtoFile(dataUrl: string, filename: string): File {
    const arr = dataUrl.split(',');
    const matchResult = arr[0].match(/:(.*?);/);
    const mime = matchResult ? matchResult[1] : '';
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
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
    this.propiedadesTipoFileImagen = this.listaImagenesGuardar[idx];
    this.listaImagenesGuardar[idx][0] ? this.propiedadesTipoFileImagen = this.listaImagenesGuardar[idx][0] 
    : this.propiedadesTipoFileImagen = this.listaImagenesGuardar[idx]; 
  }

  public guardarTamizaje(): void {
    if (this.modoPruebas && this.listaImagenesMostrar.length !== this.LIMITE_IMAGENES) {
      this._snackbar.status(
        101,
        '',
        'Debes tener al menos 5 imagenes en modo prueba'
      );
      return;
    }
    if (this.formulario.valid && this.checkImagen.valid) {
      this.loading = true;
      if (this.estadoConfiguracionVph === 'false') {
        this.formulario.get('vph')?.setValue('Sin VPH');
      }
      const newTamizaje: Tamizaje = {
        tam_pac_per_identificacion: this.paciente_identificacion,
        tam_usu_per_identificacion: this.usuario_identificacion,
        tam_fecha: this.todayDate,
        tam_contraste: this.formulario.get('contraste')?.value,
        tam_vph: this.formulario.get('vph')?.value,
        tam_niv_id: 1, // TODO: Cambiar este nivel de riesgo cuando ya sepamos cual será el id a registrar, de momento será el más bajo,
        tam_vph_no_info: this.estadoConfiguracionVph === 'true' ? 1 : 0,
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
          const idTamizaje = res.objetoRespuesta.insertId;
          this.guardarImagenEnAWS(idTamizaje);
        } else {
          // 404: Error, No es posible procesar la solicitud
          this._snackbar.status(404);
        }
      } catch (error) {
        console.log('Error: ', error);
        this.loading = false;
      }
    });
  }

  guardarImagenEnAWS(idUltimoTamizaje: number) {
    if (this.modoPruebas) {
      for (const key in this.listaImagenesGuardar) {
        let fail = false;
        if (fail) {
          break;
        }
        const nombreImgGuardar = `${this.paciente_identificacion}_${idUltimoTamizaje}_${parseInt(key) + 1}.jpeg`;
        this.imagenSvc.guardarImagen(this.listaImagenesGuardar[key], nombreImgGuardar).subscribe((res) => {
          if (res.result.$metadata.httpStatusCode === 200) {
            this.guardarRutaImagen(idUltimoTamizaje, nombreImgGuardar, parseInt(key) + 1);
          } else {
            this.eliminarTamizajeById(idUltimoTamizaje);
            fail = true;
            this.loading = false;
          }
        });
      }
    } else {
      const nombreImgGuardar = `${this.paciente_identificacion}_${idUltimoTamizaje}.jpeg` 
      this.imagenSvc.guardarImagen(this.propiedadesTipoFileImagen, nombreImgGuardar).subscribe((res) => {     
        if (res.result.$metadata.httpStatusCode === 200) {
          this.guardarRutaImagen(idUltimoTamizaje, nombreImgGuardar);
        } else {
          this.eliminarTamizajeById(idUltimoTamizaje);
        }
      });
    }
  }

  private guardarRutaImagen(idUltimoTamizaje: number, nombreImagen: string, key?: number | null) {
    const lengthImages = this.listaImagenesMostrar.length;
    let newImagen: Imagen;
    const mensajeAgregadoExito = 'Agregado Exitosamente!';
    newImagen = {
      ima_tam_id: idUltimoTamizaje,
      ima_tipo: 'jpeg', //TODO: Colocar esto dinámicamente y los ENUM: Mayúsculas
      ima_ruta: nombreImagen,
    };
    this.imagenSvc.createImagenConRuta(newImagen).subscribe((res) => {
      if (res.codigoRespuesta === 0) {
        if (key) {
          if (key + 1 === lengthImages) {
            this.loading = false;
            this._snackbar.status(707, mensajeAgregadoExito);
            this.router.navigateByUrl('tamizajes/consultar');
          }
        } else {
          this.loading = false;
          this._snackbar.status(707, mensajeAgregadoExito);
          this.router.navigateByUrl('tamizajes/consultar');
        }
      } else {
        // 404: Error, No es posible procesar la solicitud
        this._snackbar.status(404);
        this.loading = false;
      }
    });
  }

  private eliminarTamizajeById(idTamizaje: number) {
    this.tamizajeSvc.eliminarTamizajeById(idTamizaje).subscribe();
  }

  public verInstrucciones(): void {
    this.dialog.open(InstruccionesTamizajeComponent);
  }

  public capturarImagen(event: any): void {
    const numeroElementoAgregar = event.target.files.length;
    for (const imagen of event.target.files) {
      this.listaImagenesGuardar.push(imagen);
    }
    if (this.listaImagenesGuardar.length > this.LIMITE_IMAGENES) {
      this._snackbar.status(304);
      this.btnCapture = false;
      this.listaImagenesGuardar.splice(-numeroElementoAgregar);
      return;
    }

    if (this.listaImagenesGuardar.length === this.LIMITE_IMAGENES) {
      this.btnCapture = true;
    }
    if (event.target.files.length > 1) {
      for (const iterator of event.target.files) {
        const archivoCapturado = iterator;
        this.extraerBase64(archivoCapturado).then((imagen: any) => {
          const obj = {
            imageAsDataUrl: imagen.base,
          };
          this.listaImagenesMostrar.push(obj);
        });
      }
    } else {
      const archivoCapturado = event.target.files[0];
      this.extraerBase64(archivoCapturado).then((imagen: any) => {
        const obj = {
          imageAsDataUrl: imagen.base,
        };
        this.listaImagenesMostrar.push(obj);
      });
    }

  }

  private extraerBase64 = async ($event: any) =>
    new Promise((resolve, reject) => {
      try {
        const reader = new FileReader();
        reader.readAsDataURL($event);
        reader.onload = () => {
          resolve({
            base: reader.result,
          });
        };
        reader.onerror = (error) => {
          resolve({
            base: null,
          });
        };
      } catch (e) {
        return null;
      }
    });
}
