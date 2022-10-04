import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { UsuarioService } from 'src/app/shared/services/usuario.service';
import { ImagenService } from '../../shared/services/imagen.service';

@Component({
  selector: 'app-detalle-tamizaje',
  templateUrl: './detalle-tamizaje.component.html',
  styleUrls: ['./detalle-tamizaje.component.scss'],
})
export class DetalleTamizajeComponent implements OnInit {
  public infoPaciente: any = [];
  public nombreCompleto: string = '';
  public urlImagen: string = '';
  public imgFromFtp: any;
  public estadoConfiguracionVph: boolean = false;
  public usuario: any;
  public multipleImagenes = false;
  public imag1: any;
  public imag2: any;
  public imag3: any;
  public imag4: any;
  public imag5: any;
  private contadorImg = 0;
  constructor(
    private imagen: ImagenService,
    private usuarioSvc: UsuarioService,
    private dialogRef: MatDialogRef<DetalleTamizajeComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    // Obtener los datos del usuario logueado
    this.usuarioSvc.getUsuarioLogueado().subscribe((usuario) => {
      this.usuario = usuario;
    });

    this.desplegarImagen();
    this.totalImagenes();
  }

  ngOnInit(): void {
    this.verificarConfiguracionVphEnLocalStorage(this.data);
  }

  private totalImagenes() {
    this.imagen.getTotalImagenes(this.data.Tamizaje.tam_id).subscribe((res) => {
      if (res.codigoRespuesta === 0) {
        res.objetoRespuesta[0].total === 5
          ? (this.multipleImagenes = true)
          : (this.multipleImagenes = false);
      }
    });
  }

  private verificarConfiguracionVphEnLocalStorage(data: any) {
    if (data.Tamizaje.tam_vph_no_info === 0) {
      this.estadoConfiguracionVph = true;
    } else {
      this.estadoConfiguracionVph = false;
    }
  }

  private desplegarImagen() {
    try {
      this.imagen
        .getImagenByIdTamizaje(this.data.Tamizaje.tam_id)
        .subscribe((imagen) => {
          if (imagen.objetoRespuesta.length > 1) {
            for (let i = 0; i < imagen.objetoRespuesta.length; i++) {
              this.obtenerImgFtp(imagen.objetoRespuesta[i].ima_ruta);
            }
          } else {
            if (imagen.objetoRespuesta[0].ima_ruta !== undefined) {
              this.urlImagen = imagen.objetoRespuesta[0].ima_ruta;
              this.obtenerImgFtp(this.urlImagen);
            }
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
    this.imagen.getImagenByFtp(objEnviar).subscribe((res: any) => {
      if (res) {
        this.createImageFromBlob(res);
      }
    });
  }

  async createImageFromBlob(image: Blob) {
    let reader = new FileReader();

    await reader.addEventListener(
      'load',
      () => {
        if (this.multipleImagenes) {
          this.contadorImg++;
          switch (this.contadorImg) {
            case 1:
              this.imag1 = reader.result;
              break;
            case 2:
              this.imag2 = reader.result;
              break;
            case 3:
              this.imag3 = reader.result;
              break;
            case 4:
              this.imag4 = reader.result;
              break;
            case 5:
              this.imag5 = reader.result;
              break;
          }
        } else {
          this.imgFromFtp = reader.result;
        }
      },
      false
    );

    if (image) {
      reader.readAsDataURL(image);
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
