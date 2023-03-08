import { Injectable, Optional, Provider, SkipSelf } from '@angular/core';
import { FilterComparison } from './FilterComparison';

@Injectable()
export class NgxMatDataFilterIntl {
  stringFilterPlaceholder                                      = 'Text filter';
  numberFilterPlaceholder                                      = 'Number filter';
  dateFilterPlaceholder                                        = 'Date filter';
  fromNumberPlaceholder                                        = 'From number';
  toNumberPlaceholder                                          = 'To number';
  fromDatePlaceholder                                          = 'From date';
  toDatePlaceholder                                            = 'To date';
  selectAll                                                    = 'Select all';
  selectNone                                                   = 'Select none';
  toggleSelection                                              = 'Toggle selection';
  all                                                          = 'All';
  none                                                         = 'None';
  toggle                                                       = 'Toggle';
  protected comparisons: { [key in FilterComparison]: string } = {
    'is-one-of'    : 'Is one of',
    'is-not-one-of': 'Is not one of',
    'equals'       : 'Is equal to',
    'not-equal'    : 'Is not equal to',
    'greater-than' : 'Is greater than',
    'less-than'    : 'Is less than',
    'contains'     : 'Contains',
    'not-contains' : 'Not contains',
    'starts-with'  : 'Starts with',
    'ends-with'    : 'Ends with',
    'is-in-range'  : 'Is in range'
  };

  readonly getNumberFiltersPlaceholders = (comparison: FilterComparison): string[] => {
    switch (comparison) {
      case 'is-in-range':
        return [ this.fromNumberPlaceholder, this.toNumberPlaceholder ];
      default:
        return [ this.numberFilterPlaceholder ];
    }
  };

  readonly getDateFiltersPlaceholders = (comparison: FilterComparison): string[] => {
    switch (comparison) {
      case 'is-in-range':
        return [ this.fromDatePlaceholder, this.toDatePlaceholder ];
      default:
        return [ this.dateFilterPlaceholder ];
    }
  };

  readonly getComparisonText = (comparison: FilterComparison): string => {
    return this.comparisons[comparison];
  };
}

export function NGX_MAT_DATA_FILTER_INTL_PROVIDER_FACTORY(parentIntl: NgxMatDataFilterIntl): NgxMatDataFilterIntl {
  return parentIntl || new NgxMatDataFilterIntl();
}

export const NGX_MAT_DATA_FILTER_INTL_PROVIDER: Provider = {
  provide   : NgxMatDataFilterIntl,
  deps      : [ [ new Optional(), new SkipSelf(), NgxMatDataFilterIntl ] ],
  useFactory: NGX_MAT_DATA_FILTER_INTL_PROVIDER_FACTORY
};
