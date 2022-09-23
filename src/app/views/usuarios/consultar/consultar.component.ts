import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';

import { sortFunctionUsuarios } from '../../../functions/shortFuntion';
import { Usuario } from '../../../models/usuario.model';
import { UsuarioService } from '../../../shared/services/usuario.service';

@Component({
    selector: 'app-consultar',
    templateUrl: './consultar.component.html',
    styleUrls: ['./consultar.component.scss'],
})
export class ConsultarComponent implements OnInit {

    displayedColumns: string[] = ['Identificacion', 'Nombres', 'Apellidos', 'Rol', 'Estado', 'Acciones'];
    dataSource = new MatTableDataSource();
    apiResponse: any = [];

    @ViewChild(MatSort, { static: true }) sort!: MatSort;
    @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;

    formulario!: FormGroup;
    dataUsuarios: any = [];
    valueIdentificacion: number = 0;
    public usuario: any;
    public usuario_email: string = '';

    constructor(
        private usuarioService: UsuarioService,
        private fb: FormBuilder,
        private usuarioSvc: UsuarioService,
        private router: Router
    ) { }

    ngOnInit(): void {
        this.crearFiltro();
        this.getAllUsuarios();


    }

    private crearFiltro() {
        this.formulario = this.fb.group({
            identificacion: [null],
            tipoId: [null],
            email: [null],
        });

        this.formulario.get('identificacion')?.valueChanges.subscribe((value) => {
            this.valueIdentificacion = value;
        });
    }

    public getAllUsuarios() {
        this.formulario.reset();
        this.usuarioService.getUsuarios().subscribe((res) => {
            if (res.objetoRespuesta.length) {
                this.apiResponse = res;
                this.dataUsuarios = res.objetoRespuesta;

                // Ordenaré alfabeticamente a los usuarios por el primer nombre 
                this.dataUsuarios.sort(sortFunctionUsuarios);
                this.dataSource = new MatTableDataSource(this.dataUsuarios);

                this.dataSource.sort = this.sort;
                this.dataSource.paginator = this.paginator;
            }
        });
    }

    applyFilter(event: Event) {
        const filterValue = (event.target as HTMLInputElement).value;
        this.dataSource.filter = filterValue.trim().toLowerCase();

        if (this.dataSource.paginator) {
            this.dataSource.paginator.firstPage();
        }
    }

    public filtrarData() {
        const id = this.formulario.get('identificacion')?.value;
        const tipoId = this.formulario.get('tipoId')?.value;
        const email = this.formulario.get('email')?.value;

        if (id) {
            this.usuarioService.getUsuarioById(id).subscribe((res) => {
                if (res.codigoRespuesta == 0) {
                    this.dataUsuarios = res.objetoRespuesta;
                }
            });
        } else if (tipoId) {
            this.usuarioService.getUsuarioByTipoId(tipoId).subscribe((res) => {
                if (res.codigoRespuesta == 0) {
                    this.dataUsuarios = res.objetoRespuesta;
                }
            });
        } else if (email) {
            this.usuarioService.getUsuarioByEmail(email).subscribe((res) => {
                if (res.codigoRespuesta == 0) {
                    this.dataUsuarios = res.objetoRespuesta;
                }
            });
        } else {
            this.getAllUsuarios();
        }
    }

    public consultarUsuario(usuario: any) {
        if (usuario) {
            this.usuarioService.usuarioConsultar.next(usuario);
            this.router.navigate(['/usuarios/actualizar/', usuario.per_identificacion]);
        }
    }

    public inactivarUsuario(usuario: Usuario) {
        //console.log('usuario: ' + usuario);

        console.log(usuario);
        if (usuario.usu_per_identificacion) {
            let objEnviar = {};
            if (usuario.usu_estado === 'Inactivo') {
                objEnviar = {
                    usu_estado: 'Activo',
                };
            } else {
                objEnviar = {
                    usu_estado: 'Inactivo',
                };
            }
            this.usuarioService
                .changeStateUser(+usuario.usu_per_identificacion, objEnviar)
                .subscribe((res) => {
                    //console.log(res);
                    if (res.codigoRespuesta === 0) {
                        this.getAllUsuarios();
                    }
                });
        }
    }
}
