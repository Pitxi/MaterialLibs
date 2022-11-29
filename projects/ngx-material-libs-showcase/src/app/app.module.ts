import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatIconModule } from '@angular/material/icon';
import { ReactiveFormsModule } from '@angular/forms';
import { MatNativeDateModule } from '@angular/material/core';
import { HttpClientModule } from '@angular/common/http';
import { NgxMatDataFilterModule } from '../../../pitxi/ngx-mat-data-filter/src/lib';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import {
  NgxMatDataFilterConfiguration
} from '../../../pitxi/ngx-mat-data-filter/src/lib/ngx-mat-data-filter-configuration';
import { DataFilterConfiguration } from './data-filter-configuration';

@NgModule({
            declarations: [
              AppComponent
            ],
            imports     : [
              BrowserModule,
              AppRoutingModule,
              BrowserAnimationsModule,
              HttpClientModule,
              ReactiveFormsModule,
              MatButtonModule,
              MatIconModule,
              MatNativeDateModule,
              NgxMatDataFilterModule,
              MatTableModule,
              MatPaginatorModule
            ],
            providers   : [
              { provide: NgxMatDataFilterConfiguration, useClass: DataFilterConfiguration }
            ],
            bootstrap   : [ AppComponent ]
          })
export class AppModule {
}
