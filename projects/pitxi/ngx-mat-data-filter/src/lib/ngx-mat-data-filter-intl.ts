import { Injectable, Optional, Provider, SkipSelf } from '@angular/core';
import { Subject } from 'rxjs';
import { FilterComparison } from './FilterComparison';

@Injectable()
export class NgxMatDataFilterIntl {
  readonly changes                                             = new Subject<void>();
  readonly stringFilterPlaceholder                             = 'Text filter';
  readonly selectAll                                           = 'Select all';
  readonly selectNone                                          = 'Select none';
  readonly toggleSelection                                     = 'Toggle selection';
  readonly all                                                 = 'All';
  readonly none                                                = 'None';
  readonly toggle                                              = 'Toggle';
  protected comparisons: { [key in FilterComparison]: string } = {
    'is-one-of'    : 'Is one of',
    'is-not-one-of': 'Is not one of',
    'equal-to'     : 'Is equal to',
    'not-equal-to' : 'Is not equal to',
    'greater-than' : 'Is greater than',
    'lesser-than'  : 'Is lesser than',
    'contains'     : 'Contains',
    'not-contains' : 'Not contains',
    'is-in-range'  : 'Is in range'
  };

  getNumberFiltersPlaceholders(comparison: FilterComparison): string[] {
    switch (comparison) {
      case 'is-in-range':
        return [ 'From number', 'To number' ];
      default:
        return [ 'Number filter' ];
    }
  }

  getDateFiltersPlaceholders(comparison: FilterComparison): string[] {
    switch (comparison) {
      case 'is-in-range':
        return [ 'From date', 'To date' ];
      default:
        return [ 'Date filter' ];
    }
  }

  getComparisonText(comparison: FilterComparison): string {
    return this.comparisons[comparison];
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
