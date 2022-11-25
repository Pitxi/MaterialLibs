import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDataFilterDirective } from './mat-data-filter.directive';
import { MatValueListFilterSelectorComponent } from './mat-value-list-filter-selector';
import { Overlay } from '@angular/cdk/overlay';
import { MatCardModule } from '@angular/material/card';
import { NGX_MAT_DATA_FILTER_INTL_PROVIDER } from './ngx-mat-data-filter-intl';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatStringFilterSelectorComponent } from './mat-string-filter-selector';
import { MatInputModule } from '@angular/material/input';
import { MatNumberFilterSelectorComponent } from './mat-number-filter-selector';
import { MatDateFilterSelectorComponent } from './mat-date-filter-selector/mat-date-filter-selector.component';
import { MatDatepickerModule } from '@angular/material/datepicker';

@NgModule({
            declarations: [
              MatDataFilterDirective,
              MatValueListFilterSelectorComponent,
              MatStringFilterSelectorComponent,
              MatNumberFilterSelectorComponent,
              MatDateFilterSelectorComponent
            ],
              imports: [
                  CommonModule,
                  ReactiveFormsModule,
                  MatCardModule,
                  MatSelectModule,
                  MatCheckboxModule,
                  MatInputModule,
                  MatDatepickerModule
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
              NGX_MAT_DATA_FILTER_INTL_PROVIDER
            ]
          })
export class NgxMatDataFilterModule {
}
