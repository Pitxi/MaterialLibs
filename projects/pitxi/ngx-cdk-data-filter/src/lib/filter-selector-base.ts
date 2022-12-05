import { Observable } from 'rxjs';
import { DataFilter } from './data-filter';
import { FilterSelectorData } from './filter-selector-data';

/**
 * Implemented by FilterSelector Components
 */
export abstract class FilterSelectorBase {
  readonly abstract comparisons: Map<string, string>;
  readonly abstract filterChanged$: Observable<DataFilter | null>;
  protected abstract data: FilterSelectorData;

  abstract get isEmpty(): boolean;
}
