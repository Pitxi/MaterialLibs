import { Observable } from 'rxjs';
import { DataFilter } from './data-filter';
import { FilterSelectorData } from './filter-selector-data';

/**
 * Base class extended by filter selector components.
 */
export abstract class FilterSelectorBase {
  readonly abstract comparisons: Map<string, string>;
  readonly abstract filterChanged$: Observable<DataFilter | null>;
  protected abstract data: FilterSelectorData;
}
