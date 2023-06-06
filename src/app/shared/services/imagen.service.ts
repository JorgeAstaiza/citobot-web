import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { BehaviorSubject, Observable } from 'rxjs';

import { url } from '../../../environments/environment';
import { Imagen } from '../../models/imagen';
import axios from 'axios';

@Injectable({
  providedIn: 'root',
})
export class ImagenService {
  enviromentUrl = url;
  test = 'http://localhost:8080/api';
  imagenConsultar: BehaviorSubject<any> = new BehaviorSubject({});
  public headers = new HttpHeaders().set(
    'Authorization',
    localStorage.getItem('token') || ''
  );

  constructor(private http: HttpClient) { }

  getImagenByIdTamizaje(id: number): Observable<any> {
    return this.http.get<Imagen>(
      `${this.enviromentUrl}/imagenes/obtener?id=${id}`,
      {
        headers: this.headers,
      }
    );
  }

  obtenerURLImagenAWS(nombre: string): Observable<any> {
    return this.http.get(
      `${this.enviromentUrl}/imagenes/get-img-aws/${nombre}`,
      {
        headers: this.headers,
      }
    );
  }

  descargarImagenTipoFile(nombreImg: string): Observable<Blob> {
    const headers = new HttpHeaders().set(
      'Authorization',
      localStorage.getItem('token') || ''
    );
    return this.http.get(
      `${this.enviromentUrl}/imagenes/descargar-img/${nombreImg}`,
      {
        headers: headers,
        responseType: 'blob'
      }
    );
  }

  getTotalImagenes(idTamizaje: number): Observable<any> {
    return this.http.get<Imagen>(
      `${this.enviromentUrl}/imagenes/total-img?id=${idTamizaje}`,
      { headers: this.headers }
    );
  }

  createImagen(form: any): Observable<any> {
    return this.http.post<Imagen>(
      `${this.enviromentUrl}/imagenes/crear`,
      form,
      {
        headers: this.headers,
      }
    );
  }

  guardarImagen(imagen: File, nombreImg: string): Observable<any> {
    let formData = new FormData();
    formData.append('file', imagen, nombreImg);
    formData.append('nombre', nombreImg);
    const headers = {
      'Authorization': localStorage.getItem('token') || '',
      'Content-Type': 'multipart/form-data'
    };
    return new Observable<any>((observer) => {
      axios.post(`${this.enviromentUrl}/imagenes/save-img-aws`, formData, { headers }).then(
        response => {
          observer.next(response.data);
          observer.complete()
        }
      ).catch(error => {
        observer.error(error)
      })
    });
  }

  createImagenConRuta(form: Imagen): Observable<any> {
    return this.http.post<Imagen>(
      `${this.enviromentUrl}/imagenes/crear`,
      form,
      {
        headers: this.headers,
      }
    );
  }

  updateImagen(id: number, form: Imagen): Observable<any> {
    return this.http.put<Imagen>(
      `${this.enviromentUrl}/imagenes/actualizar/${id}`,
      form,
      { headers: this.headers }
    );
  }

  deleteImagen(id: number): Observable<any> {
    return this.http.delete<any>(
      `${this.enviromentUrl}/imagenes/eliminar/${id}`,
      {
        headers: this.headers,
      }
    );
  }
}
