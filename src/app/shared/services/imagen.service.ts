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
      { headers: this.headers }
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

  createImagen(form: any): Observable<any> {
    return this.http.post<Imagen>(
      `${this.enviromentUrl}/imagenes/crear`,
      form,
      { headers: this.headers }
    );
  }

  guardarImagenFTP(base64: any): Observable<any> {
    return this.http.post<any>(`${this.enviromentUrl}/imagenes/ftp`, base64, {
      headers: this.headers,
    });
  }

  createImagenConRuta(form: Imagen): Observable<any> {
    return this.http.post<Imagen>(
      `${this.enviromentUrl}/imagenes/crear`,
      form,
      { headers: this.headers }
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
      { headers: this.headers }
    );
  }
}
