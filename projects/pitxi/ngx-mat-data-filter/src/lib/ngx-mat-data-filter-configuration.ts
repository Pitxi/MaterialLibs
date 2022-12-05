import { Injectable, Optional, Provider, SkipSelf } from '@angular/core';
import { DataFilterRegistry } from '@pitxi/ngx-cdk-data-filter';
import { MatStringFilterSelectorComponent } from './mat-string-filter-selector';
import { MatNumberFilterSelectorComponent } from './mat-number-filter-selector';
import { MatDateFilterSelectorComponent } from './mat-date-filter-selector';
import { MatValueListFilterSelectorComponent } from './mat-value-list-filter-selector';

type ConfigIconNames = 'selectAll' | 'selectNone' | 'toggleSelection' | 'clearControl';

@Injectable()
export class NgxMatDataFilterConfiguration {
  readonly icons: { [key in ConfigIconNames]?: string } = {};
  readonly showActions: { [key: string]: boolean }      = { 'value-list': true };
  backdropClass: string | string[] | undefined          = 'cdk-overlay-transparent-backdrop';

  constructor(private registry: DataFilterRegistry) {
    registry.registerFilterSelectorComponentType('string', MatStringFilterSelectorComponent);
    registry.registerFilterSelectorComponentType('number', MatNumberFilterSelectorComponent);
    registry.registerFilterSelectorComponentType('date', MatDateFilterSelectorComponent);
    registry.registerFilterSelectorComponentType('value-list', MatValueListFilterSelectorComponent);
  }
}

export function NGX_MAT_DATA_FILTER_CONFIGURATION_PROVIDER_FACTORY(parentConfig: NgxMatDataFilterConfiguration, registry: DataFilterRegistry): NgxMatDataFilterConfiguration {
  return parentConfig || new NgxMatDataFilterConfiguration(registry);
}

export const NGX_MAT_DATA_FILTER_CONFIGURATION_PROVIDER: Provider = {
  provide   : NgxMatDataFilterConfiguration,
  deps      : [ [ new Optional(), new SkipSelf(), NgxMatDataFilterConfiguration ], DataFilterRegistry ],
  useFactory: NGX_MAT_DATA_FILTER_CONFIGURATION_PROVIDER_FACTORY
};
