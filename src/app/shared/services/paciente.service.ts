import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { BehaviorSubject, Observable } from 'rxjs';

import { url } from '../../../environments/environment';
import { Paciente } from '../../models/paciente.model';

@Injectable({
  providedIn: 'root',
})
export class PacienteService {
  enviromentUrl = url;
  test = 'http://localhost:8080/api';

  pacienteConsultar: BehaviorSubject<any> = new BehaviorSubject({});
  public headers = new HttpHeaders().set(
    'Authorization',
    localStorage.getItem('token') || ''
  );

  constructor(private http: HttpClient) {}

  getPacientes(): Observable<any> {
    return this.http.get<any>(`${this.enviromentUrl}/pacientes/consultar`);
  }

  getPacienteById(id: number): Observable<any> {
    return this.http.get<Paciente>(
      `${this.enviromentUrl}/pacientes/identificacion?id=${id}`,
      { headers: this.headers }
    );
  }

  getPacienteByTipoId(Tipoid: string): Observable<any> {
    return this.http.get<Paciente>(
      `${this.enviromentUrl}/pacientes/tipoId?tipo_id=${Tipoid}`,
      { headers: this.headers }
    );
  }

  createPaciente(form: Paciente): Observable<any> {
    return this.http.post<Paciente>(
      `${this.enviromentUrl}/pacientes/crear`,
      form
    );
  }

  updatePaciente(id: number, form: Paciente): Observable<any> {
    return this.http.put<Paciente>(
      `${this.enviromentUrl}/pacientes/actualizar/${id}`,
      form
    );
  }

  deletePaciente(id: number): Observable<any> {
    return this.http.delete<any>(
      `${this.enviromentUrl}/pacientes/eliminar/${id}`
    );
  }
}
