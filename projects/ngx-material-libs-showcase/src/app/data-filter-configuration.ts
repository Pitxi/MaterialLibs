import { Injectable } from '@angular/core';
import {
  NgxMatDataFilterConfiguration
} from '../../../pitxi/ngx-mat-data-filter/src/lib/ngx-mat-data-filter-configuration';

@Injectable()
export class DataFilterConfiguration extends NgxMatDataFilterConfiguration {
  override icons = { 'selectAll': 'select_all', 'selectNone': 'check_box_outline_blank', 'toggleSelection': 'indeterminate_check_box' }
}
