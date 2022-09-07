import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';

import { NivelRiesgo } from 'src/app/models/nivel-riesgo';
import { SnackbarToastService } from 'src/app/shared/services/snackbar-toast.service';
import { RespuestaGeneral } from '../../../models/respuesta-general';
import { NivelRiesgoService } from '../../../shared/services/nivel-riesgo.service';

@Component({
  selector: 'app-consultar',
  templateUrl: './consultar.component.html',
  styleUrls: ['./consultar.component.scss'],
})
export class ConsultarComponent implements OnInit {
  displayedColumns: string[] = ['Id', 'Descripcion', 'Mensaje', 'Acciones'];
  dataSource = new MatTableDataSource();

  @ViewChild(MatSort, { static: true }) sort!: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;

  formulario!: FormGroup;
  public dataNivelesRiesgo: any = [];

  constructor(
    private nivelesRiesgoSvc: NivelRiesgoService,
    private _snackbar: SnackbarToastService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getAllNivelesRiesgo();
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  public getAllNivelesRiesgo() {
    this.nivelesRiesgoSvc.getNivelesRiesgos().subscribe((res) => {
      if (res.objetoRespuesta.length) {
        this.dataNivelesRiesgo = res.objetoRespuesta;

        this.dataSource = new MatTableDataSource(this.dataNivelesRiesgo);

        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
      }
    });
  }
  public editarRiesgo(riesgo: NivelRiesgo) {
    this.nivelesRiesgoSvc.riesgoEditar.next(riesgo);
    this.router.navigate(['riesgos/crear']);
  }
  public deleteRiesgo(riesgo: NivelRiesgo) {
    if (riesgo.niv_id) {
      this.nivelesRiesgoSvc
        .deleteRiesgo(riesgo.niv_id)
        .subscribe((res: RespuestaGeneral) => {
          if (res.codigoRespuesta === 0) {
            this._snackbar.status(707, 'Riesgo eliminado exitosamente!');
            this.getAllNivelesRiesgo();
          } else {
            this._snackbar.status(404);
          }
        });
    }
  }
}
