import { DataFilter } from './data-filter';
import { InjectionToken } from '@angular/core';
import { ValueListItem } from './value-list-item';

export const FILTER_SELECTOR_DATA = new InjectionToken<FilterSelectorData>('filter-selector-data-token');

export interface FilterSelectorData {
  filter: DataFilter | null;
  defaultFilter?: DataFilter;
  valueListItems?: ValueListItem[];
}
