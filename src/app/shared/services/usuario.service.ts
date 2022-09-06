import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { BehaviorSubject, Observable, Subject } from 'rxjs';

import { url } from '../../../environments/environment';
import { Usuario } from '../../models/usuario.model';

@Injectable({
    providedIn: 'root',
})
export class UsuarioService {

    enviromentUrl = url;
    usuarioConsultar: BehaviorSubject<any> = new BehaviorSubject({});
    public headers = new HttpHeaders().set('Authorization', localStorage.getItem('token') || '');

    public usuario: any;
    public user: any;
    public usuario_email: string = '';

    constructor(private http: HttpClient) { }

    // Esta Fx obtiene el email del localStorage, ya que en firebase solo se almacena el email, y luego el resto de datos
    public getUsuarioLogueado() {

        var subject = new Subject<string>();
        this.usuario = JSON.parse(localStorage.getItem('user') as string);
        this.usuario_email = this.usuario.email;

        this.getUsuarioByEmail(this.usuario_email)
            .subscribe((usuario) => {

                subject.next(usuario.objetoRespuesta[0]);;

            });
        return subject.asObservable();

    }

    getUsuarios(): Observable<any> {
        return this.http.get<any>(`${this.enviromentUrl}/usuarios/consultar`, { headers: this.headers });
    }

    getUsuarioById(id: number): Observable<any> {
        return this.http.get<Usuario>(`${this.enviromentUrl}/usuarios/identificacion?id=${id}`, { headers: this.headers });
    }

    getUsuarioByTipoId(Tipoid: string): Observable<any> {
        return this.http.get<Usuario>(`${this.enviromentUrl}/usuarios/tipoId?tipo_id=${Tipoid}`, { headers: this.headers });
    }

    getUsuarioByEmail(email: string): Observable<any> {
        return this.http.get<Usuario>(`${this.enviromentUrl}/usuarios/email?email=${email}`, { headers: this.headers });
    }

    changeStateUser(id: number, form: any) {
        return this.http.put<any>(
            `${this.enviromentUrl}/usuarios/actualizarEstado/${id}`, form, { headers: this.headers });
    }

    createUsuario(form: Usuario): Observable<any> {
        return this.http.post<Usuario>(`${this.enviromentUrl}/usuarios/crear`, form, { headers: this.headers });
    }

    updateUsuario(id: number, form: Usuario): Observable<any> {
        return this.http.put<Usuario>(`${this.enviromentUrl}/usuarios/actualizar/${id}`, form, { headers: this.headers });
    }

    deleteUsuario(id: number): Observable<any> {
        return this.http.delete<any>(`${this.enviromentUrl}/usuarios/eliminar/${id}`, { headers: this.headers });
    }

}
