import { formatDate } from '@angular/common';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

import { PacienteService } from 'src/app/shared/services/paciente.service';
import { sortFunctionTamizajes } from '../../../functions/shortFuntion';
import { Tamizaje } from '../../../models/tamizaje.model';
import { DetalleTamizajeComponent } from '../../../popus/detalle-tamizaje/detalle-tamizaje.component';
import { TamizajeService } from '../../../shared/services/tamizaje.service';

@Component({
    selector: 'app-consultar',
    templateUrl: './consultar.component.html',
    styleUrls: ['./consultar.component.scss'],
})
export class ConsultarComponent implements OnInit, OnDestroy {
    formulario!: FormGroup;
    minDate = new Date(2022, 0, 1);
    maxDate = new Date();

    public rangoFechasTamizajes = new FormGroup({
        start: new FormControl(),
        end: new FormControl(),
    });

    displayedColumns: string[] = ['Identificacion', 'Fecha', 'Nivel', 'Acciones',
    ];
    dataSource = new MatTableDataSource();

    @ViewChild(MatSort, { static: true }) sort!: MatSort;
    @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;

    public tiposDeDocumento: any = [
        {
            Abreviatura: 'CC',
            Descripcion: 'C.C',
        },
        {
            Abreviatura: 'TI',
            Descripcion: 'T.I',
        },
    ];
    public todayDate: Date = new Date();
    dataTamizaje: any[] = [];

    modalDetalle = false;
    detalleInfoTamizaje: any = [];

    public infoPaciente: any = [];
    public nombreCompleto: any = '';

    constructor(
        private fb: FormBuilder,
        private tamizajeService: TamizajeService,
        private pacienteService: PacienteService,
        private dialog: MatDialog
    ) { }

    ngOnInit(): void {
        this.crearFormulario();
        this.getTamizajeByPacienteComponent();

        // Me subscribo a los cambios que ocurran en el rango de fechas
        this.rangoFechasTamizajes.valueChanges.subscribe((fecha) => {
            console.log('range Change', fecha);
            if (fecha.start !== null && fecha.end !== null) {
                this.filtrarPorRangoDeFechas(fecha.start, fecha.end);
            }
        });
    }
    ngOnDestroy(): void {
        this.tamizajeService.idPacienteTamizaje.next(0);
    }

    applyFilter(event: Event) {

        // Reseteo los demás filtros
        this.formulario.patchValue({ tipoId: '' });
        this.rangoFechasTamizajes.reset();

        const filterValue = (event.target as HTMLInputElement).value;
        this.dataSource.filter = filterValue.trim().toLowerCase();

        if (this.dataSource.paginator) {
            this.dataSource.paginator.firstPage();
        }
    }

    private crearFormulario() {
        this.formulario = this.fb.group({
            identificacion: [null],
            tipoId: [null],
            start: [null],
            end: [null],
        });
    }

    private getTamizajeByPacienteComponent() {
        this.tamizajeService.idPacienteTamizaje.subscribe((res) => {
            if (res) {
                this.formulario.get('identificacion')?.setValue(res);
                this.filtrarData();
            } else {
                this.getAllTamizajes();
            }
        });
    }

    public getAllTamizajes() {
        this.formulario.reset();
        this.tamizajeService.getAllTamizajes().subscribe((res) => {
            //console.log('all tamizajes: ', res.objetoRespuesta);
            this.dataTamizaje = res.objetoRespuesta;

            // Ordenaré por fecha los tamizajes
            this.dataTamizaje.sort(sortFunctionTamizajes);

            this.dataSource = new MatTableDataSource(this.dataTamizaje);

            this.dataSource.sort = this.sort;
            this.dataSource.paginator = this.paginator;
        });
    }

    public filtrarPorTipoIdentificacion(tipoId: any) {
        if (tipoId == '') {
            this.getAllTamizajes();
        } else {

            // Reseteo los demás filtros
            this.formulario.patchValue({ identificacion: '' });
            this.rangoFechasTamizajes.reset();

            console.log('Tipo Seleccionado: ', tipoId);
            this.tamizajeService.getTamizajeByTipoId(tipoId).subscribe((res) => {
                if (res.codigoRespuesta === 0) {
                    this.dataTamizaje = res.objetoRespuesta;
                    // Ordenaré por fecha los tamizajes
                    this.dataTamizaje.sort(sortFunctionTamizajes);
                    this.dataSource = new MatTableDataSource(this.dataTamizaje);

                    this.dataSource.sort = this.sort;
                    this.dataSource.paginator = this.paginator;
                }
            });
        }
    }

    public filtrarPorRangoDeFechas(fechaStart: Date, fechaEnd: Date) {

        // Reseteo los demás filtros
        this.formulario.patchValue({ identificacion: '' });
        this.formulario.patchValue({ tipoId: '' });


        let fechaInicio = formatDate(fechaStart, 'yyyy-MM-dd', 'en-US') + '';
        let fechaFin = formatDate(fechaEnd, 'yyyy-MM-dd', 'en-US') + '';

        this.tamizajeService
            .getTamizajeByDate(fechaInicio, fechaFin)
            .subscribe((res) => {
                console.log(res);

                if (res.codigoRespuesta === 0) {

                    this.dataTamizaje = res.objetoRespuesta;

                    // Ordenaré por fecha los tamizajes
                    this.dataTamizaje.sort(sortFunctionTamizajes);
                    this.dataSource = new MatTableDataSource(this.dataTamizaje);

                    this.dataSource.sort = this.sort;
                    this.dataSource.paginator = this.paginator;
                }
            });
    }

    public filtrarData() {
        //const identificacion = this.formulario.get('identificacion')?.value;
        const fechaInicial = this.formulario.get('fechaInicial')?.value;
        const fechaFinal = this.formulario.get('fechaFinal')?.value;
        const tipoId = this.formulario.get('tipoId')?.value;
        console.log(fechaInicial);

        if (fechaInicial && fechaFinal) {
            console.log('Fecha Inicial: ', fechaInicial, 'Fecha Final: ', fechaFinal);
            this.tamizajeService
                .getTamizajeByDate(fechaInicial, fechaFinal)
                .subscribe((res) => {
                    console.log(res);

                    if (res.codigoRespuesta === 0) {
                        this.dataTamizaje = res.objetoRespuesta;

                        this.dataSource = new MatTableDataSource(this.dataTamizaje);

                        this.dataSource.sort = this.sort;
                        this.dataSource.paginator = this.paginator;
                    }
                });
        }
        if (tipoId) {
            console.log('Tipo Id: ', tipoId);

            this.tamizajeService.getTamizajeByTipoId(tipoId).subscribe((res) => {
                if (res.codigoRespuesta === 0) {
                    this.dataTamizaje = res.objetoRespuesta;

                    this.dataSource = new MatTableDataSource(this.dataTamizaje);

                    this.dataSource.sort = this.sort;
                    this.dataSource.paginator = this.paginator;
                }
            });
        }
    }

    public async verDetalleTamizaje(tamizaje: Tamizaje) {
        this.detallePaciente(tamizaje);
    }

    private async detallePaciente(tamizaje: Tamizaje) {
        await this.pacienteService
            .getPacienteById(tamizaje.per_identificacion!)
            .subscribe((res) => {
                if (res.codigoRespuesta === 0) {
                    this.infoPaciente = res.objetoRespuesta[0];
                    this.nombreCompleto =
                        res.objetoRespuesta[0].per_primer_nombre +
                        ' ' +
                        res.objetoRespuesta[0]?.per_otros_nombres +
                        ' ' +
                        res.objetoRespuesta[0].per_primer_apellido +
                        ' ' +
                        res.objetoRespuesta[0]?.per_segundo_apellido;

                    // Abro la ventana modal
                    this.dialog.open(DetalleTamizajeComponent, {
                        data: { Tamizaje: tamizaje, NombrePaciente: this.nombreCompleto },
                    });
                }
            });
    }

    public limpiarFiltros() {
        this.rangoFechasTamizajes.reset();
        this.ngOnInit();
    }
}
