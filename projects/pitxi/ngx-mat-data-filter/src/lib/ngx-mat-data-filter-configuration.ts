import { Injectable, Optional, Provider, SkipSelf } from '@angular/core';
import { DataFilterType } from './data-filter-type';

type ConfigIconNames = 'selectAll' | 'selectNone' | 'toggleSelection' | 'clearControl';

@Injectable()
export class NgxMatDataFilterConfiguration {
  readonly icons: { [key in ConfigIconNames]?: string }       = {};
  readonly showActions: { [key in DataFilterType]?: boolean } = { 'value-list': true };
  backdropClass: string | string[] | undefined = 'cdk-overlay-transparent-backdrop';
}

export function NGX_MAT_DATA_FILTER_CONFIGURATION_PROVIDER_FACTORY(parentIntl: NgxMatDataFilterConfiguration): NgxMatDataFilterConfiguration {
  return parentIntl || new NgxMatDataFilterConfiguration();
}

export const NGX_MAT_DATA_FILTER_CONFIGURATION_PROVIDER: Provider = {
  provide   : NgxMatDataFilterConfiguration,
  deps      : [ [ new Optional(), new SkipSelf(), NgxMatDataFilterConfiguration ] ],
  useFactory: NGX_MAT_DATA_FILTER_CONFIGURATION_PROVIDER_FACTORY
};
