import { DataFilter } from './data-filter';
import { ValueListItem } from './value-list-item';
import { InjectionToken } from '@angular/core';

export const FILTER_SELECTOR_DATA = new InjectionToken<FilterSelectorData>('filter-selector-data-token');

export interface FilterSelectorData {
  defaultFilter?: DataFilter;
  filter: DataFilter | null;
  valueListItems?: ValueListItem[];
}
