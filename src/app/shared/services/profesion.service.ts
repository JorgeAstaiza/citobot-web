import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { url } from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class ProfesionService {

    enviromentUrl = url;
    constructor(private http: HttpClient) { }

    getProfesiones() {
        return this.http.get<any>(`${this.enviromentUrl}/profesion/consultar`);
    }

    saveProfesion(form: any) {
        return this.http.post<any>(`${this.enviromentUrl}/profesion/crear`, form);
    }
}
