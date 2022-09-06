import { HttpEvent, HttpHandler, HttpHeaders, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { Observable } from 'rxjs';

import { AuthService } from '../shared/services/auth.service';
import { EpsService } from '../shared/services/eps.service';

@Injectable()
export class EpsInterceptor implements HttpInterceptor {
  constructor(
    private router: Router,
    private epsService: EpsService,
    private authService: AuthService
  ) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    const token = this.authService.getToken();
    //console.log(token);

    const clonedReq = request.clone({
      headers: new HttpHeaders({
        'Content-Type': 'application/json; charset=utf-8',
        Accept: 'application/json',
        Authorization: `Bearer ${this.authService.getToken()}`,
      }),
    });
    return next.handle(clonedReq);
  }
}
