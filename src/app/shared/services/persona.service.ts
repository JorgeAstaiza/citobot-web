import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { url } from '../../../environments/environment';

@Injectable({
    providedIn: 'root',
})
export class PersonaService {
    enviromentUrl = url;
    constructor(private http: HttpClient) { }

    createPersona(form: any) {
        return this.http.post<any>(`${this.enviromentUrl}/personas/crear`, form);
    }

    updatePersona(id: number, form: any) {
        return this.http.put<any>(`${this.enviromentUrl}/personas/actualizar/${id}`, form);
    }

}
