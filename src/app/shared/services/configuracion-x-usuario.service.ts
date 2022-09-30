import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { BehaviorSubject, Observable } from 'rxjs';

import { url } from '../../../environments/environment';
import { ConfiguracionXUsuario } from '../../models/configuracion-x-usuario';

@Injectable({
  providedIn: 'root',
})
export class ConfiguracionXUsuarioService {
  enviromentUrl = url;
  test = 'http://localhost:8080/api';

  usuarioConsultar: BehaviorSubject<any> = new BehaviorSubject({});
  public headers = new HttpHeaders().set(
    'Authorization',
    localStorage.getItem('token') || ''
  );

  constructor(private http: HttpClient) {}

  getConfiguracionxIdentificacionAndIdConfig(
    identificacion: number,
    id_configuracion: number
  ): Observable<any> {
    return this.http.get<ConfiguracionXUsuario>(
      `${this.enviromentUrl}/confusuario/todas?confu_usu_per_identificacion=${identificacion}&confu_conf_id=${id_configuracion}`,
      { headers: this.headers }
    );
  }

  createConfiguracionxUsuario(form: ConfiguracionXUsuario): Observable<any> {
    return this.http.post<ConfiguracionXUsuario>(
      `${this.enviromentUrl}/confusuario/crear`,
      form,
      { headers: this.headers }
    );
  }

  updateConfiguracionxUsuario(
    id: number,
    form: ConfiguracionXUsuario
  ): Observable<any> {
    return this.http.put<ConfiguracionXUsuario>(
      `${this.enviromentUrl}/confusuario/actualizar/${id}`,
      form,
      { headers: this.headers }
    );
  }
}
