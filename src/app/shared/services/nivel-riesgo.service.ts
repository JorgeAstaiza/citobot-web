import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { BehaviorSubject, Observable } from 'rxjs';

import { url } from '../../../environments/environment';
import { NivelRiesgo } from '../../models/nivel-riesgo';

@Injectable({
  providedIn: 'root',
})
export class NivelRiesgoService {
  enviromentUrl = url;
  usuarioConsultar: BehaviorSubject<any> = new BehaviorSubject({});
  public headers = new HttpHeaders().set(
    'Authorization',
    localStorage.getItem('token') || ''
  );

  constructor(private http: HttpClient) {}

  getNivelesRiesgos(): Observable<any> {
    return this.http.get<any>(`${this.enviromentUrl}/riesgos/consultar`, {
      headers: this.headers,
    });
  }

  createRiesgo(form: NivelRiesgo): Observable<any> {
    return this.http.post<NivelRiesgo>(
      `${this.enviromentUrl}/riesgos/crear`,
      form,
      { headers: this.headers }
    );
  }

  updateRiesgo(id: number, form: NivelRiesgo): Observable<any> {
    return this.http.put<NivelRiesgo>(
      `${this.enviromentUrl}/riesgos/actualizar/${id}`,
      form,
      { headers: this.headers }
    );
  }

  deleteRiesgo(id: number): Observable<any> {
    return this.http.delete<any>(
      `${this.enviromentUrl}/riesgos/eliminar/${id}`,
      { headers: this.headers }
    );
  }
}
