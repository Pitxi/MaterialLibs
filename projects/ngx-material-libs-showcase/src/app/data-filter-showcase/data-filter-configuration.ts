import { Injectable } from '@angular/core';
import {
  NgxMatDataFilterConfiguration
} from '../../../../pitxi/ngx-mat-data-filter/src/lib/ngx-mat-data-filter-configuration';
import { DataFilterRegistry } from '../../../../pitxi/ngx-mat-data-filter/src/lib';

@Injectable()
export class DataFilterConfiguration extends NgxMatDataFilterConfiguration {
  constructor(registry: DataFilterRegistry) {
    super(registry);
    this.icons.selectAll       = 'select_all';
    this.icons.selectNone      = 'check_box_outline_blank';
    this.icons.toggleSelection = 'indeterminate_check_box';
    this.icons.clearControl    = 'backspace';
  }
}
