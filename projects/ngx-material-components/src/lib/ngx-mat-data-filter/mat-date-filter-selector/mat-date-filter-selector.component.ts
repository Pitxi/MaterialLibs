import { ChangeDetectionStrategy, Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FilterSelectorBase } from '../filter-selector-base';
import { FILTER_SELECTOR_DATA, FilterSelectorData } from '../filter-selector-data';
import { NgxMatDataFilterIntl } from '../ngx-mat-data-filter-intl';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { DataFilterComparison } from '../data-filter-comparison';
import { BehaviorSubject, distinctUntilChanged, map, Subject, takeUntil, tap } from 'rxjs';
import { DataFilter } from '../data-filter';

@Component({
             selector       : 'ngx-mat-date-filter-selector',
             templateUrl    : './mat-date-filter-selector.component.html',
             styleUrls      : [ './mat-date-filter-selector.component.scss' ],
             changeDetection: ChangeDetectionStrategy.OnPush
           })
export class MatDateFilterSelectorComponent
  extends FilterSelectorBase
  implements OnInit, OnDestroy {

  readonly availableComparisons     = [
    this.intl.getComparisonItem(DataFilterComparison.EqualTo),
    this.intl.getComparisonItem(DataFilterComparison.NotEqualTo),
    this.intl.getComparisonItem(DataFilterComparison.LesserThan),
    this.intl.getComparisonItem(DataFilterComparison.GreaterThan),
    this.intl.getComparisonItem(DataFilterComparison.IsInRange)
  ];
  private defaultFilter: DataFilter = this.data.defaultFilter ??
    {
      comparison: this.availableComparisons[0].comparison,
      values    : [ null, null ]
    };
  readonly form                     = this.fBuilder.group({
                                                            comparison: new FormControl<DataFilterComparison>(
                                                              this.data.filter?.comparison ??
                                                              this.defaultFilter.comparison,
                                                              {
                                                                nonNullable: true,
                                                                validators : [ Validators.required ]
                                                              }
                                                            ),
                                                            date1     : new FormControl<Date | null>(
                                                              this.data.filter?.values[0] ??
                                                              this.defaultFilter?.values[0]
                                                            ),
                                                            date2     : new FormControl<Date | null>(
                                                              this.data.filter?.values[1] ??
                                                              this.defaultFilter?.values[1]
                                                            ),
                                                          });
  private placeholdersSubject       = new BehaviorSubject<string[]>(this.intl.getDateFiltersPlaceholders(this.form.value.comparison!));
  readonly placeHolders$            = this.placeholdersSubject.asObservable();
  private filterChangedSubject      = new Subject<DataFilter | null>();
  readonly filterChanged$           = this.filterChangedSubject.asObservable();

  constructor(private fBuilder: FormBuilder,
              private intl: NgxMatDataFilterIntl,
              @Inject(FILTER_SELECTOR_DATA) private data: FilterSelectorData,) {
    super();
  }

  ngOnInit(): void {
    this.subscribeFormControls();
  }

  ngOnDestroy(): void {
    this.unsubscribeFormControls();
  }

  protected subscribeFormControls(): void {
    this.unsubscribeControls = new Subject<void>();

    this.form.valueChanges
        .pipe(
          distinctUntilChanged(),
          takeUntil(this.unsubscribeControls),
          tap(({ comparison }) => this.placeholdersSubject.next(this.intl.getDateFiltersPlaceholders(comparison!))),
          map(value => this.getFilter(value))
        )
        .subscribe(filter => this.filterChangedSubject.next(filter));
  }

  protected unsubscribeFormControls(): void {
    this.unsubscribeControls?.next();
    this.unsubscribeControls?.complete();
  }

  private getFilter(value: Partial<{ comparison: DataFilterComparison; date1: Date | null; date2: Date | null; }>): DataFilter | null {
    if (value.comparison === this.defaultFilter.comparison &&
      value.date1 == this.defaultFilter.values[0] &&
      value.date2 == this.defaultFilter.values[1]) {
      return null;
    }

    return {
      comparison: value?.comparison ?? this.defaultFilter.comparison,
      values    : [
        value.date1,
        value.date2
      ]
    };
  }
}
