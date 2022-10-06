import { DataFilter } from './data-filter';
import { Observable } from 'rxjs';

export interface FilterSelectorBase {
  readonly filterChanged$: Observable<DataFilter | null>;
}
