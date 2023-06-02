import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { BehaviorSubject, Observable } from 'rxjs';

import { url } from '../../../environments/environment';
import { Imagen } from '../../models/imagen';

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

  constructor(private http: HttpClient) {}

  getImagenByIdTamizaje(id: number): Observable<any> {
    return this.http.get<Imagen>(
      `${this.enviromentUrl}/imagenes/obtener?id=${id}`,
      {
        headers: this.headers,
      }
    );
  }

  getImagenByFtp(nombre: any): Observable<Blob> {
    return this.http.post(
      `${this.enviromentUrl}/imagenes/ftpdescargar`,
      nombre,
      {
        responseType: 'blob',
        headers: new HttpHeaders().set(
          'Authorization',
          localStorage.getItem('token') || ''
        ),
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
    const headers = new HttpHeaders({'Content-Type': 'multipart/form-data'}).set(
      'Authorization',
      localStorage.getItem('token') || ''
    );
    let formData = new FormData();
    formData.append('file', imagen);
    formData.append('nombre', nombreImg);
    
    return this.http.post<any>(`${this.enviromentUrl}/imagenes/save-img-aws`, formData, {
      headers: headers,
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
