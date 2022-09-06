import { Component } from '@angular/core';
import { FooterComponent } from '@coreui/angular';

@Component({
    selector: 'app-default-footer',
    templateUrl: './default-footer.component.html',
    styleUrls: ['./default-footer.component.scss'],
})
export class DefaultFooterComponent extends FooterComponent {

    public currentYear: Date = new Date();
    public anio: any;

    constructor() {
        super();
    }

    ngOnInit() {
        this.anio = this.currentYear.getFullYear();

    }
}
