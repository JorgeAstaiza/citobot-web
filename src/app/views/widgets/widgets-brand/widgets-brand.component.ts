import { AfterContentInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, Input } from '@angular/core';
import { PacienteService } from 'src/app/shared/services/paciente.service';
import { TamizajeService } from 'src/app/shared/services/tamizaje.service';

@Component({
    selector: 'app-widgets-brand',
    templateUrl: './widgets-brand.component.html',
    styleUrls: ['./widgets-brand.component.scss'],
    changeDetection: ChangeDetectionStrategy.Default
})
export class WidgetsBrandComponent implements AfterContentInit {

    public totalPacientes: number = 0;
    public totalTamizajes: number = 0;
    public tamizajesSinRiesgo: any[] = [];
    public tamizajesBajoRiesgo: any[] = [];
    public tamizajesAltoRiesgo: any[] = [];

    public chartOptions = {};
    public labels: string[] = [];
    public datasets = {};
    public colors = {};
    public brandData: any[] = [];

    @Input() withCharts?: boolean;
    // @ts-ignore

    constructor(
        private changeDetectorRef: ChangeDetectorRef,
        private pacienteSvc: PacienteService,
        private tamizajeSvc: TamizajeService,
    ) {

        this.obtenerTotalPacientes();

    }

    ngOnInit() {

    }

    // Pacientes
    private obtenerTotalPacientes(): void {

        this.pacienteSvc.getPacientes().subscribe((res) => {
            if (res.objetoRespuesta.length) {

                this.totalPacientes = res.objetoRespuesta.length;

                this.obtenerTotalTamizajes(this.totalPacientes);

            }
        });

    }

    // Tamizajes
    private obtenerTotalTamizajes(totalPacientes: number): void {

        this.tamizajeSvc.getAllTamizajes().subscribe(allTamizajes => {
            console.log('Tamizajes: ', allTamizajes);

            if (allTamizajes.objetoRespuesta.length) {

                this.llenarGraficas(totalPacientes, allTamizajes);
            }
        });
    }

    private llenarGraficas(totalPacientes: number, allTamizajes: any) {

        // Total Tamizajes
        this.totalTamizajes = allTamizajes.objetoRespuesta.length;

        // Pacientes sin riesgo de cáncer
        this.tamizajesSinRiesgo = allTamizajes.objetoRespuesta.filter((tamizaje: any) => tamizaje.tam_niv_id === 1 || tamizaje.tam_niv_id === 18);

        // Pacientes con bajo riesgo de cáncer
        this.tamizajesBajoRiesgo = allTamizajes.objetoRespuesta.filter((tamizaje: any) => tamizaje.tam_niv_id === 2);

        // Pacientes con alto riesgo de cáncer
        this.tamizajesAltoRiesgo = allTamizajes.objetoRespuesta.filter((tamizaje: any) => tamizaje.tam_niv_id === 3);

        // Options
        this.chartOptions = {
            elements: {
                line: {
                    tension: 0.4
                },
                point: {
                    radius: 0,
                    hitRadius: 10,
                    hoverRadius: 4,
                    hoverBorderWidth: 3
                }
            },
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                x: {
                    display: false
                },
                y: {
                    display: false
                }
            }
        };
        this.labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];
        this.datasets = {
            borderWidth: 2,
            fill: true
        };
        this.colors = {
            backgroundColor: 'rgba(255,255,255,.1)',
            borderColor: 'rgba(255,255,255,.55)',
            pointHoverBackgroundColor: '#fff'
        };


        this.brandData = [
            {
                icon: 'cilPeople',
                values: [{ title: 'Pacientes', value: '' }, { title: '', value: totalPacientes }],
                capBg: { '--cui-card-cap-bg': '#3b5998' },
                labels: [...this.labels],
                data: {
                    labels: [...this.labels],
                    datasets: [{ ...this.datasets, data: [65, 59, 84, 84, 51, 55, 40], label: 'Facebook', ...this.colors }]
                }
            },
            {
                icon: 'cil-puzzle',
                values: [{ title: 'Tamizajes', value: '' }, { title: '', value: this.totalTamizajes }],
                capBg: { '--cui-card-cap-bg': '#00aced' },
                data: {
                    labels: [...this.labels],
                    datasets: [{ ...this.datasets, data: [1, 13, 9, 17, 34, 41, 38], label: 'Twitter', ...this.colors }]
                }
            },
            {
                icon: 'cil-bell',
                values: [{ title: 'Sin Riesgo', value: '' }, { title: '', value: this.tamizajesSinRiesgo.length }],
                color: 'success',
                data: {
                    labels: [...this.labels],
                    datasets: [{ ...this.datasets, data: [78, 81, 80, 45, 34, 12, 40], label: 'LinkedIn', ...this.colors }]
                }
            },
            {
                icon: 'cil-bell',
                values: [{ title: 'Bajo Riesgo', value: '' }, { title: '', value: this.tamizajesBajoRiesgo.length }],
                color: 'warning',
                labels: [...this.labels],
                data: {
                    labels: [...this.labels],
                    datasets: [{ ...this.datasets, data: [60, 59, 84, 84, 51, 55, 40], label: 'Facebook', ...this.colors }]
                }
            },

            {
                icon: 'cil-bell',
                values: [{ title: 'Alto Riesgo', value: '' }, { title: '', value: this.tamizajesAltoRiesgo.length }],
                color: 'danger',
                data: {
                    labels: [...this.labels],
                    datasets: [{ ...this.datasets, data: [0, 23, 56, 22, 97, 23, 64], label: 'Events', ...this.colors }]
                }
            }
        ];

    }




    capStyle(value: string) {
        return !!value ? { '--cui-card-cap-bg': value } : {};
    }

    ngAfterContentInit(): void {
        this.changeDetectorRef.detectChanges();
    }
}
