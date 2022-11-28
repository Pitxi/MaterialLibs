import { Injectable, Optional, Provider, SkipSelf } from '@angular/core';
import { DataFilterComparison } from './data-filter-comparison';
import { Subject } from 'rxjs';
import { ComparisonItem } from './comparison-item';

@Injectable({ providedIn: 'root' })
export class NgxMatDataFilterIntl {
  readonly changes = new Subject<void>();
  readonly stringFilterPlaceholder = 'Text filter';
  readonly selectAll               = 'Select all';
  readonly selectNone              = 'Select none';
  readonly toggleSelection         = 'Toggle selection';
  protected comparisons: { [key in DataFilterComparison]: string } = {
    [DataFilterComparison.IsOneOf]    : 'Is one of',
    [DataFilterComparison.IsNotOneOf] : 'Is not one of',
    [DataFilterComparison.EqualTo]    : 'Is equal to',
    [DataFilterComparison.NotEqualTo] : 'Is not equal to',
    [DataFilterComparison.GreaterThan]: 'Is greater than',
    [DataFilterComparison.LesserThan] : 'Is lesser than',
    [DataFilterComparison.Contains]   : 'Contains',
    [DataFilterComparison.NotContains]: 'Not contains',
    [DataFilterComparison.IsInRange]  : 'Is in range'
  };

  getNumberFiltersPlaceholders(comparison: DataFilterComparison): string[] {
    switch (comparison) {
      case DataFilterComparison.IsInRange:
        return [ 'From number', 'To number' ];
      default:
        return [ 'Number filter' ];
    }
  }

  getDateFiltersPlaceholders(comparison: DataFilterComparison): string[] {
    switch (comparison) {
      case DataFilterComparison.IsInRange:
        return [ 'From date', 'To date' ];
      default:
        return [ 'Date filter' ];
    }
  }

  getComparisonItem(comparison: DataFilterComparison): ComparisonItem {
    return { comparison, description: this.comparisons[comparison] };
  }
}

export function NGX_MAT_DATA_FILTER_INTL_PROVIDER_FACTORY(parentIntl: NgxMatDataFilterIntl): NgxMatDataFilterIntl {
  return parentIntl || new NgxMatDataFilterIntl();
}

export const NGX_MAT_DATA_FILTER_INTL_PROVIDER: Provider = {
  provide   : NgxMatDataFilterIntl,
  deps      : [ [ new Optional(), new SkipSelf(), NgxMatDataFilterIntl ] ],
  useFactory: NGX_MAT_DATA_FILTER_INTL_PROVIDER_FACTORY
};
