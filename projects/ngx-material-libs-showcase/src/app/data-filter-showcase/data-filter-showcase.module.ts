import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataFilterShowcaseComponent } from './data-filter-showcase.component';
import { DataFilterShowcaseRoutingModule } from './data-filter-showcase-routing.module';
import { MatIconModule } from '@angular/material/icon';
import { ReactiveFormsModule } from '@angular/forms';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatNativeDateModule } from '@angular/material/core';
import { NgxMatDataFilterConfiguration, NgxMatDataFilterModule } from '@pitxi/ngx-mat-data-filter';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { DataFilterConfiguration } from './data-filter-configuration';

@NgModule({
            declarations: [
              DataFilterShowcaseComponent
            ],
            imports     : [
              CommonModule,
              DataFilterShowcaseRoutingModule,
              MatNativeDateModule,
              NgxMatDataFilterModule,
              MatIconModule,
              ReactiveFormsModule,
              MatPaginatorModule,
              MatTableModule,
              MatButtonModule
            ],
            providers   : [
              { provide: NgxMatDataFilterConfiguration, useClass: DataFilterConfiguration },
              // Spanish: { provide: NgxMatDataFilterIntl, useClass: SpanishNgxMatDataFilterIntl }
            ]
          })
export class DataFilterShowcaseModule {
}
