import { InjectionToken, Type } from '@angular/core';
import { FilterSelectorBase } from './filter-selector-base';

export const DATA_FILTER_REGISTRY_CONFIG = new InjectionToken('data-filter-registry-config');

export interface RegistryConfig {
  selectorComponents: { [name: string]: Type<FilterSelectorBase> } | undefined;
}
