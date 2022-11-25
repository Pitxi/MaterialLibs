import { DataFilterComparison } from './data-filter-comparison';

export interface DataFilter {
  comparison: DataFilterComparison;
  values: any[];
}
