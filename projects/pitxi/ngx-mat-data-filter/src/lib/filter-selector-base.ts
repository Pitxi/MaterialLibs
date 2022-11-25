import { DataFilter } from './data-filter';
import { Observable, Subject } from 'rxjs';
import { ComparisonItem } from './comparison-item';

export abstract class FilterSelectorBase {
  readonly abstract availableComparisons: ComparisonItem[];
  readonly abstract filterChanged$: Observable<DataFilter | null>;
  protected unsubscribeControls: Subject<void> | undefined;

  protected abstract subscribeFormControls(): void;

  protected abstract unsubscribeFormControls(): void;
}
