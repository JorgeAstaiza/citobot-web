import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';

import { Title } from '@angular/platform-browser';
import { IconSetService } from '@coreui/icons-angular';
import { iconSubset } from './icons/icon-subset';

@Component({
    // tslint:disable-next-line:component-selector
    selector: 'body',
    template: '<router-outlet></router-outlet> <lib-ng-toast></lib-ng-toast>',
})
export class AppComponent implements OnInit {
    title = 'Citobot +';

    constructor(
        private router: Router,
        private titleService: Title,
        private iconSetService: IconSetService
    ) {
        titleService.setTitle(this.title);
        // iconSet singleton
        iconSetService.icons = { ...iconSubset };
    }

    ngOnInit(): void {
        this.router.events.subscribe((evt) => {
            if (!(evt instanceof NavigationEnd)) {
                return;
            }
        });
    }
}
