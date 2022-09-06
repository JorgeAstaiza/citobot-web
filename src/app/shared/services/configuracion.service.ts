import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { url } from '../../../environments/environment';
import { Configuracion } from '../../models/configuracion';

@Injectable({
    providedIn: 'root'
})
export class ConfiguracionService {

    enviromentUrl = url;
    usuarioConsultar: BehaviorSubject<any> = new BehaviorSubject({});
    public headers = new HttpHeaders().set('Authorization', localStorage.getItem('token') || '');

    constructor(private http: HttpClient) { }

    getConfiguraciones(): Observable<any> {
        return this.http.get<any>(`${this.enviromentUrl}/configuracion/consultar`, { headers: this.headers });
    }

    getConfiguracionById(id: number): Observable<any> {
        return this.http.get<Configuracion>(`${this.enviromentUrl}/configuracion/idconf?id=${id}`, { headers: this.headers });
    }

    getConfiguracionByName(nombre: string): Observable<any> {
        return this.http.get<Configuracion>(`${this.enviromentUrl}/configuracion/nombre?nombre=${nombre}`, { headers: this.headers });
    }

    createConfiguracion(form: Configuracion): Observable<any> {
        return this.http.post<Configuracion>(`${this.enviromentUrl}/configuracion/crear`, form, { headers: this.headers });
    }

    updateConfiguracion(id: number, form: Configuracion): Observable<any> {
        return this.http.put<Configuracion>(`${this.enviromentUrl}/configuracion/actualizar/${id}`, form, { headers: this.headers });
    }

    deleteConfiguracion(id: number): Observable<any> {
        return this.http.delete<any>(`${this.enviromentUrl}/configuracion/eliminar/${id}`, { headers: this.headers });
    }

}
