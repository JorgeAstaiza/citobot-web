import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { BehaviorSubject, Observable } from 'rxjs';

import { Tamizaje } from 'src/app/models/tamizaje.model';
import { url } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class TamizajeService {
  enviromentUrl = url;
  test = 'http://localhost:8080/api';

  idPacienteTamizaje: BehaviorSubject<any> = new BehaviorSubject(null);
  public headers = new HttpHeaders().set(
    'Authorization',
    localStorage.getItem('token') || ''
  );

  constructor(private http: HttpClient) {}

  getAllTamizajes(): Observable<any> {
    return this.http.get<any>(`${this.enviromentUrl}/tamizajes/todos`, {
      headers: this.headers,
    });
  }

  getTamizajebyUserId(id: number): Observable<any> {
    return this.http.get<any>(
      `${this.enviromentUrl}/tamizajes/identificacion?id=${id}`,
      { headers: this.headers }
    );
  }

  getTamizajeByDate(fechaInicial: string, fechaFinal: string): Observable<any> {
    return this.http.get<any>(
      `${this.enviromentUrl}/tamizajes/rangoFecha?fecha_inicio=${fechaInicial}&fecha_fin=${fechaFinal}`,
      { headers: this.headers }
    );
  }

  getTamizajeByTipoId(tipoId: string): Observable<any> {
    return this.http.get<any>(
      `${this.enviromentUrl}/tamizajes/tipoIdentificacion?tipo_id=${tipoId}`,
      { headers: this.headers }
    );
  }

  getDetalleTamizaje(id: number) {
    return this.http.get<any>(
      `${this.enviromentUrl}/tamizajes/id?id_tam=${id}`,
      {
        headers: this.headers,
      }
    );
  }

  getUltimoIdTamizajeXIdPaciente(id: number) {
    return this.http.get<any>(
      `${this.enviromentUrl}/tamizajes/ultimo?id=${id}`,
      {
        headers: this.headers,
      }
    );
  }

  getUltimoTamizaje(id: number) {
    return this.http.get<any>(
      `${this.enviromentUrl}/tamizajes/id?id_tam=${id}`,
      {
        headers: this.headers,
      }
    );
  }

  createTamizaje(form: Tamizaje): Observable<any> {
    return this.http.post<Tamizaje>(
      `${this.enviromentUrl}/tamizajes/crear`,
      form,
      {
        headers: this.headers,
      }
    );
  }

  eliminarTamizajeById(idTamizaje: number): Observable<any> {
    return this.http.delete<Tamizaje>(
      `${this.enviromentUrl}/tamizajes/eliminarbyid?id=${idTamizaje}`,
      {
        headers: this.headers,
      }
    );
  }
}
