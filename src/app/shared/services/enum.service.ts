import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { url } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class EnumService {
  enviromentUrl = url;
  test = 'http://localhost:8080/api';

  constructor(private http: HttpClient) {}

  public getEnum(tabla: string, columna: string): Observable<any> {
    return this.http.get<any>(
      `${this.enviromentUrl}/enum/consultar?tabla=${tabla}&columna=${columna}`
    );
  }
}
