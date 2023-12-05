import { DataFilter } from './data-filter';
import { InjectionToken } from '@angular/core';
import { ValueListItem } from './value-list-item';
import { FilterInputMask } from './filter-input-mask';

export const FILTER_SELECTOR_DATA = new InjectionToken<FilterSelectorData>('filter-selector-data-token');

export interface FilterSelectorData {
  filter: DataFilter | null;
  defaultFilter?: DataFilter;
  valueListItems: ValueListItem[];
  inputMask: FilterInputMask | null;
  inputReadonly: boolean;
  minValue: number | Date | null;
  maxValue: number | Date | null;
}
