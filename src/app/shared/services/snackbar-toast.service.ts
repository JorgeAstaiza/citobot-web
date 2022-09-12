import { Injectable } from '@angular/core';

import { NgToastService } from 'ng-angular-popup';

@Injectable({
    providedIn: 'root',
})
export class SnackbarToastService {
    constructor(private toast: NgToastService) { }

    public status(status: number, titulo?: string, detalle?: string): void {
        switch (status) {
            // 707: Exito : Aplica para (Agregado, Actualizado, Eliminado) satisfactoriamente.
            case 707:
                this.toast.success({ detail: 'Ok', summary: titulo, duration: 2000 });
                break;

            case 708:
                this.toast.success({ detail: 'Enviado!', summary: titulo, duration: 4000 });
                break;

            // 303: El valor ya existe (Duplicado)
            case 303:
                this.toast.info({
                    detail: 'Datos Duplicados!',
                    summary: 'Por favor, ingresa valores diferentes',
                    duration: 2000,
                });
                break;

            // 600: Completa los campos obligatorios
            case 600:
                this.toast.warning({
                    detail: 'Opps!',
                    summary: 'Completa los campos obligatorios',
                    duration: 2000,
                });
                break;

            // 404: Error
            case 404:
                this.toast.error({
                    detail: 'Opps!',
                    summary: 'No es posible procesar tu solicitud en este momento.',
                    duration: 2000,
                });
                break;

            case 101:
                this.toast.error({ detail: detalle, summary: titulo, duration: 2000 });
                break;

            default:
                break;
        }
    }
}
