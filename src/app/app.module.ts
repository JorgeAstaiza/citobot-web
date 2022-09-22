import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
// Firebase services + environment module
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { AngularFireDatabaseModule } from '@angular/fire/compat/database';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { ReactiveFormsModule } from '@angular/forms';
// Import containers
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { BrowserModule, Title } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { TranslateModule } from '@ngx-translate/core';

import {
    AvatarModule,
    BadgeModule,
    BreadcrumbModule,
    ButtonGroupModule,
    ButtonModule,
    CardModule,
    DropdownModule,
    FooterModule,
    FormModule,
    GridModule,
    HeaderModule,
    ListGroupModule,
    NavModule,
    ProgressModule,
    SharedModule,
    SidebarModule,
    TabsModule,
    UtilitiesModule
} from '@coreui/angular';
import { IconModule, IconSetService } from '@coreui/icons-angular';
import { NgToastModule } from 'ng-angular-popup';
import { ImageCropperModule } from 'ngx-image-cropper';
import { LoggerModule, NgxLoggerLevel } from 'ngx-logger';
import {
    PerfectScrollbarConfigInterface,
    PerfectScrollbarModule, PERFECT_SCROLLBAR_CONFIG
} from 'ngx-perfect-scrollbar';
//camara
import { WebcamModule } from 'ngx-webcam';
import { environment } from '../environments/environment';
// Import routing module
import { AppRoutingModule } from './app-routing.module';
// Import app component
import { NgxMaskModule } from 'ngx-mask';
import { AppComponent } from './app.component';
import { DefaultFooterComponent, DefaultHeaderComponent, DefaultLayoutComponent } from './containers';
import { EpsInterceptor } from './interceptors/eps.interceptor';
import { FilterPipe } from './pipes/filter.pipe';
import { DetalleTamizajeComponent } from './popus/detalle-tamizaje/detalle-tamizaje.component';
import { InstruccionesTamizajeComponent } from './popus/instrucciones-tamizaje/instrucciones-tamizaje.component';
import { AngularMaterialModule } from './shared/angular-material/angular-material.module';
import { AuthService } from './shared/services/auth.service';
import { SnackbarToastService } from './shared/services/snackbar-toast.service';
import { ConfiguracionModule } from './views/configuracion/configuracion.module';
import { NivelesRiesgoModule } from './views/niveles-riesgo/niveles-riesgo.module';

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
    suppressScrollX: true,
};

const APP_CONTAINERS = [
    DefaultFooterComponent,
    DefaultHeaderComponent,
    DefaultLayoutComponent,
];

@NgModule({
    declarations: [
        AppComponent,
        ...APP_CONTAINERS,
        FilterPipe,
        InstruccionesTamizajeComponent,
        DetalleTamizajeComponent,
    ],
    imports: [
        AngularMaterialModule,
        BrowserModule,
        BrowserAnimationsModule,
        AppRoutingModule,
        AvatarModule,
        BreadcrumbModule,
        FooterModule,
        DropdownModule,
        GridModule,
        HeaderModule,
        SidebarModule,
        IconModule,
        PerfectScrollbarModule,
        NavModule,
        ButtonModule,
        FormModule,
        UtilitiesModule,
        ButtonGroupModule,
        ReactiveFormsModule,
        SidebarModule,
        SharedModule,
        TabsModule,
        ListGroupModule,
        ProgressModule,
        BadgeModule,
        ListGroupModule,
        CardModule,
        AngularFireModule.initializeApp(environment.firebase),
        AngularFireAuthModule,
        AngularFirestoreModule,
        AngularFireDatabaseModule,
        HttpClientModule,
        ImageCropperModule,
        NivelesRiesgoModule,
        ConfiguracionModule,
        NgToastModule,
        NgxMaskModule.forRoot({ dropSpecialCharacters: true }), // Al guardar mantendrá la mascara
        TranslateModule.forRoot(),
        LoggerModule.forRoot({
            serverLoggingUrl: '/api/logs',
            level: NgxLoggerLevel.DEBUG,
            serverLogLevel: NgxLoggerLevel.ERROR,
        }),
        WebcamModule
    ],
    providers: [
        AuthService,
        SnackbarToastService,
        {
            provide: LocationStrategy,
            useClass: HashLocationStrategy,
        },
        {
            provide: PERFECT_SCROLLBAR_CONFIG,
            useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG,
        },
        {
            provide: HTTP_INTERCEPTORS,
            useClass: EpsInterceptor,
            multi: true,
        },
        { provide: MAT_DATE_LOCALE, useValue: 'es-CO' }, // Calendarios en español y formato dd/mm/aaaa
        IconSetService,
        Title,
    ],
    bootstrap: [AppComponent],
})
export class AppModule { }
