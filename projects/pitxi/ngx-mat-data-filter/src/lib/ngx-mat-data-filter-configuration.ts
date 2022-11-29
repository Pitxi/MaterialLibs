import { Injectable, Optional, Provider, SkipSelf } from '@angular/core';
import { DataFilterType } from './data-filter-type';

@Injectable()
export class NgxMatDataFilterConfiguration {
  readonly icons: { [key in 'selectAll' | 'selectNone' | 'toggleSelection']?: string } = {};
  readonly showActions: { [key in DataFilterType]?: boolean }                          = { 'value-list': true };
}

export function NGX_MAT_DATA_FILTER_CONFIGURATION_PROVIDER_FACTORY(parentIntl: NgxMatDataFilterConfiguration): NgxMatDataFilterConfiguration {
  return parentIntl || new NgxMatDataFilterConfiguration();
}

export const NGX_MAT_DATA_FILTER_CONFIGURATION_PROVIDER: Provider = {
  provide   : NgxMatDataFilterConfiguration,
  deps      : [ [ new Optional(), new SkipSelf(), NgxMatDataFilterConfiguration ] ],
  useFactory: NGX_MAT_DATA_FILTER_CONFIGURATION_PROVIDER_FACTORY
};
