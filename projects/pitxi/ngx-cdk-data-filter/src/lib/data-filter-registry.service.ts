import { Injectable, Type } from '@angular/core';
import { FilterSelectorBase } from './filter-selector-base';

@Injectable({ providedIn: 'root' })
export class DataFilterRegistry {
  private _filterConfigs = new Map<string, Type<FilterSelectorBase>>();

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
   * @param name
   * @param selectorComponent
   */
  registerFilterSelectorComponentType(name: string, selectorComponent: Type<FilterSelectorBase>): void {
    this._filterConfigs.set(name, selectorComponent);
  }
}
