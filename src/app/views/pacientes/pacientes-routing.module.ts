import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ConsultarComponent } from './consultar/consultar.component';
import { CrearComponent } from './crear/crear.component';

const routes: Routes = [
    {
        path: '',
        data: {
            title: 'Pacientes',
        },
        children: [
            {
                path: '',
                redirectTo: 'crear',
            },
            {
                path: 'crear',
                component: CrearComponent,
                data: {
                    title: 'Crear',
                }
            },
            {
                path: 'actualizar/:id',
                component: CrearComponent,
                data: {
                    title: 'actualizar',
                }
            },
            {
                path: 'consultar',
                component: ConsultarComponent,
                data: {
                    title: 'Consultar',
                },
            },
        ],
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class PacientesRoutingModule { }
