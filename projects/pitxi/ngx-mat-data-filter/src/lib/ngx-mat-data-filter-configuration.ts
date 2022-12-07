import { Injectable, Optional, Provider, SkipSelf } from '@angular/core';

type ConfigIconNames = 'selectAll' | 'selectNone' | 'toggleSelection' | 'clearControl';

@Injectable()
export class NgxMatDataFilterConfiguration {
  readonly icons: { [key in ConfigIconNames]?: string } = {};
  readonly showActions: { [key: string]: boolean }      = { 'value-list': true };
  backdropClass: string | string[] | undefined          = 'cdk-overlay-transparent-backdrop';
}

export function NGX_MAT_DATA_FILTER_CONFIGURATION_PROVIDER_FACTORY(parentConfig: NgxMatDataFilterConfiguration): NgxMatDataFilterConfiguration {
  return parentConfig || new NgxMatDataFilterConfiguration();
}

export const NGX_MAT_DATA_FILTER_CONFIGURATION_PROVIDER: Provider = {
  provide   : NgxMatDataFilterConfiguration,
  deps      : [ [ new Optional(), new SkipSelf(), NgxMatDataFilterConfiguration ] ],
  useFactory: NGX_MAT_DATA_FILTER_CONFIGURATION_PROVIDER_FACTORY
};
