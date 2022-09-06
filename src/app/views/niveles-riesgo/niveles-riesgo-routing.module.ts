import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ConsultarComponent } from './consultar/consultar.component';
import { CrearEditarComponent } from './crear-editar/crear-editar.component';

const routes: Routes = [

    {
        path: '',
        data: {
            title: 'Riesgos'
        },
        children: [
            {
                path: '',
                redirectTo: 'consultar',
                pathMatch: 'full',
                data: {
                    title: 'Consultar',
                }
            },
            {
                path: 'consultar',
                component: ConsultarComponent,
                data: {
                    title: 'Consultar',
                }
            },
            {
                path: 'crear',
                component: CrearEditarComponent,
                data: {
                    title: 'Crear',
                }
            },
            {
                path: 'actualizar/:id',
                component: CrearEditarComponent,
                data: {
                    title: 'actualizar',
                }
            }
        ]
    }

];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class NivelesRiesgoRoutingModule { }
