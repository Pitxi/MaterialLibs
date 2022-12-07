import { Inject, Injectable, Optional, Type } from '@angular/core';
import { FilterSelectorBase } from './filter-selector-base';
import { DATA_FILTER_REGISTRY_CONFIG, RegistryConfig } from './registry-config';


@Injectable()
export class DataFilterRegistry {
  private _filterConfigs: Map<string, Type<FilterSelectorBase>>;

  constructor(@Optional() @Inject(DATA_FILTER_REGISTRY_CONFIG) config?: RegistryConfig) {
    const components = config?.selectorComponents ?? {};

    this._filterConfigs = new Map<string, Type<FilterSelectorBase>>(Object.entries(components));
  }

  /**
   * Gets a registered type, derived from FilterSelectorBase, corresponding to a filter selector component.
   * @param name the key name used to register the requested type.
   */
  getFilterSelectorComponentType(name: string): Type<FilterSelectorBase> | null {
    return this._filterConfigs.get(name) ?? null;
  }

  /**
   * Registers a type to be used as a filter selector component within the filter directive.
   *
   * @param name The key name used to identify the filter selector component type.
   * @param selectorComponentType The filter selector component type.
   */
  registerFilterSelectorComponentType(name: string, selectorComponentType: Type<FilterSelectorBase>): void {
    this._filterConfigs.set(name, selectorComponentType);
  }
}
