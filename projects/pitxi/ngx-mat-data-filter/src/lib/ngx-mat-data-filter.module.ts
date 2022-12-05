import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDataFilterDirective } from './mat-data-filter.directive';
import { MatValueListFilterSelectorComponent } from './mat-value-list-filter-selector';
import { Overlay } from '@angular/cdk/overlay';
import { NGX_MAT_DATA_FILTER_INTL_PROVIDER } from './ngx-mat-data-filter-intl';
import { ReactiveFormsModule } from '@angular/forms';
import { MatStringFilterSelectorComponent } from './mat-string-filter-selector';
import { MatNumberFilterSelectorComponent } from './mat-number-filter-selector';
import { MatDateFilterSelectorComponent } from './mat-date-filter-selector';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NgxCdkDataFilterModule } from '@pitxi/ngx-cdk-data-filter';
import { NGX_MAT_DATA_FILTER_CONFIGURATION_PROVIDER } from './ngx-mat-data-filter-configuration';

@NgModule({
            declarations: [
              MatDataFilterDirective,
              MatValueListFilterSelectorComponent,
              MatStringFilterSelectorComponent,
              MatNumberFilterSelectorComponent,
              MatDateFilterSelectorComponent
            ],
            imports     : [
              CommonModule,
              ReactiveFormsModule,
              NgxCdkDataFilterModule,
              MatCardModule,
              MatSelectModule,
              MatCheckboxModule,
              MatInputModule,
              MatDatepickerModule,
              MatButtonModule,
              MatIconModule,
              MatDividerModule,
              MatTooltipModule
            ],
            exports     : [
              MatDataFilterDirective,
              MatValueListFilterSelectorComponent,
              MatStringFilterSelectorComponent,
              MatNumberFilterSelectorComponent,
              MatDateFilterSelectorComponent
            ],
            providers   : [
              Overlay,
              NGX_MAT_DATA_FILTER_INTL_PROVIDER,
              NGX_MAT_DATA_FILTER_CONFIGURATION_PROVIDER
            ]
          })
export class NgxMatDataFilterModule {
}
