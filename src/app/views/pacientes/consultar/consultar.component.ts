import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';


import { ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

import { sortFunctionPacientes } from 'src/app/functions/shortFuntion';
import { TamizajeService } from 'src/app/shared/services/tamizaje.service';
import { PacienteService } from '../../../shared/services/paciente.service';
@Component({
    selector: 'app-consultar',
    templateUrl: './consultar.component.html',
    styleUrls: ['./consultar.component.scss'],
})
export class ConsultarComponent implements OnInit {

    displayedColumns: string[] = ['Identificacion', 'Nombres', 'Apellidos', 'Acciones'];
    dataSource = new MatTableDataSource();

    @ViewChild(MatSort, { static: true }) sort!: MatSort;
    @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;

    formulario!: FormGroup;
    dataPacientes: any = [];
    columns = ['Identificacion', 'Nombres', 'Apellidos', 'Acciones'];
    constructor(
        private pacienteService: PacienteService,
        private fb: FormBuilder,
        private router: Router,
        private tamizajeService: TamizajeService
    ) { }

    ngOnInit(): void {

        this.crearFiltro();
        this.getAllPacientes();

    }


    applyFilter(event: Event) {
        const filterValue = (event.target as HTMLInputElement).value;
        this.dataSource.filter = filterValue.trim().toLowerCase();

        if (this.dataSource.paginator) {
            this.dataSource.paginator.firstPage();
        }
    }

    private crearFiltro() {
        this.formulario = this.fb.group({
            identificacion: [null],
            tipoId: [null],
        });
    }

    public getAllPacientes() {
        this.formulario.reset();
        this.pacienteService.getPacientes().subscribe((res) => {
            if (res.objetoRespuesta.length) {
                this.dataPacientes = res.objetoRespuesta;

                // Ordenaré alfabeticamente a los pacientes por el primer nombre 
                this.dataPacientes.sort(sortFunctionPacientes);

                this.dataSource = new MatTableDataSource(this.dataPacientes);

                this.dataSource.sort = this.sort;
                this.dataSource.paginator = this.paginator;
            }
        });
    }

    public filtrarData() {
        const id = this.formulario.get('identificacion')?.value;
        const tipoId = this.formulario.get('tipoId')?.value;
        if (id) {
            this.pacienteService.getPacienteById(id).subscribe((res) => {
                if (res.codigoRespuesta == 0) {
                    this.dataPacientes = res.objetoRespuesta;
                }
            });
        } else if (tipoId) {
            this.pacienteService.getPacienteByTipoId(tipoId).subscribe((res) => {
                if (res.codigoRespuesta == 0) {
                    this.dataPacientes = res.objetoRespuesta;
                }
            });
        }
    }

    public consultarPaciente(paciente: any) {
        if (paciente) {
            this.pacienteService.pacienteConsultar.next(paciente);
            this.router.navigate(['/pacientes/actualizar/', paciente.pac_per_identificacion]);
        }
    }

    public listaTamizajes(paciente: any) {
        console.log(paciente);
        if (paciente) {
            this.tamizajeService.idPacienteTamizaje.next(
                paciente.pac_per_identificacion
            );
            this.router.navigate(['/tamizaje/consultar']);
        }
    }

}
