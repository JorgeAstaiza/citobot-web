import { Injectable } from '@angular/core';
import { MatPaginatorIntl } from '@angular/material/paginator';

import { TranslateService } from '@ngx-translate/core';

import { NGXLogger } from 'ngx-logger';

const componentName = 'MatPaginatorIntlService';

@Injectable({
  providedIn: 'root',
})
export class MatPaginationIntlServiceService extends MatPaginatorIntl {
  constructor(
    private translateService: TranslateService,
    private logger: NGXLogger
  ) {
    super();

    this.logger.debug(`${componentName}:: Initializing`);

    // React whenever the language is changed
    this.translateService.onLangChange.subscribe((_event: Event) => {
      this.translateLabels();
    });

    // Initialize the translations once at construction time
    this.translateLabels();
    this.logger.debug(`${componentName}:: Initialized`);
  }

  override getRangeLabel = (
    page: number,
    pageSize: number,
    length: number
  ): string => {
    const of = this.translateService
      ? this.translateService.instant('de')
      : 'of';
    if (length === 0 || pageSize === 0) {
      return '0 ' + of + ' ' + length;
    }
    length = Math.max(length, 0);
    const startIndex =
      page * pageSize > length
        ? (Math.ceil(length / pageSize) - 1) * pageSize
        : page * pageSize;

    const endIndex = Math.min(startIndex + pageSize, length);
    return startIndex + 1 + ' - ' + endIndex + ' ' + of + ' ' + length;
  };

  injectTranslateService(translate: TranslateService): void {
    this.translateService = translate;

    this.translateService.onLangChange.subscribe(() => {
      this.translateLabels();
    });

    this.translateLabels();
  }

  translateLabels(): void {
    this.firstPageLabel = this.translateService.instant('Primera Página');
    this.itemsPerPageLabel = this.translateService.instant('Items por página');
    this.lastPageLabel = this.translateService.instant('Última Página');
    this.nextPageLabel = this.translateService.instant('Siguiente');
    this.previousPageLabel = this.translateService.instant('Anterior');

    this.changes.next(); // Fire a change event to make sure that the labels are refreshed
  }
}
