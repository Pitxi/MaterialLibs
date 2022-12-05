import { Injectable } from '@angular/core';
import { FilterSelectorBase } from './filter-selector-base';

@Injectable({ providedIn: 'root' })
export class DataFilterRegistry {
  private _filterConfigs = new Map<string, typeof FilterSelectorBase>();

  /**
   * Gets a registered type, derived from FilterSelectorBase, corresponding to a filter selector component.
   * @param name the key name used to register the requested type.
   */
  getFilterSelectorComponentType(name: string): typeof FilterSelectorBase | null {
    return this._filterConfigs.get(name) ?? null;
  }

  /**
   * Registers a type to be used as a filter selector component within the filter directive.
   *
   * @param name
   * @param selectorComponent
   */
  registerFilterSelectorComponentType(name: string, selectorComponent: typeof FilterSelectorBase): void {
    this._filterConfigs.set(name, selectorComponent);
  }
}
