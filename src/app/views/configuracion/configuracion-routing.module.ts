import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GeneralComponent } from './general/general.component';

const routes: Routes = [
    {
        path: '',
        data: {
            title: 'Configuración',
        },
        children: [
            {
                path: '',
                component: GeneralComponent,
                data: {
                    title: 'General',
                }
            }
        ]
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ConfiguracionRoutingModule { }
