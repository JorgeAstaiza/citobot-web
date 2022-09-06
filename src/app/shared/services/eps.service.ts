import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { url } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class EpsService {
  enviromentUrl = url;
  constructor(private http: HttpClient) {}

  getToken() {
    let token: any = localStorage.getItem('user');
    token = JSON.parse(token);

    return token.stsTokenManager.accessToken;
  }

  getEps() {
    let header = new HttpHeaders().set('token', this.getToken());
    return this.http.get<any>(`${this.enviromentUrl}/eps/consultar`, {
      headers: header,
    });
  }

  saveEps(form: any) {
    return this.http.post<any>(`${this.enviromentUrl}/eps/crear`, form);
  }
}
