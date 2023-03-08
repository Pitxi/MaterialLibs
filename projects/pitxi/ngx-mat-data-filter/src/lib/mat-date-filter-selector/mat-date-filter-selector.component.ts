import { ChangeDetectionStrategy, Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { NgxMatDataFilterIntl } from '../ngx-mat-data-filter-intl';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { BehaviorSubject, distinctUntilChanged, map, Subject, takeUntil, tap } from 'rxjs';
import { NgxMatDataFilterConfiguration } from '../ngx-mat-data-filter-configuration';
import { DataFilter, FILTER_SELECTOR_DATA, FilterSelectorBase, FilterSelectorData } from '@pitxi/ngx-cdk-data-filter';
import { FilterComparison } from '../FilterComparison';

@Component({
             selector       : 'ngx-mat-date-filter-selector',
             templateUrl    : './mat-date-filter-selector.component.html',
             styleUrls      : [ './mat-date-filter-selector.component.scss' ],
             changeDetection: ChangeDetectionStrategy.OnPush
           })
export class MatDateFilterSelectorComponent
  extends FilterSelectorBase
  implements OnInit, OnDestroy {
  readonly comparisons              = new Map<FilterComparison, string>([
                                                                          [ 'equals', this.intl.getComparisonText('equals') ],
                                                                          [ 'not-equal', this.intl.getComparisonText('not-equal') ],
                                                                          [ 'greater-than', this.intl.getComparisonText('greater-than') ],
                                                                          [ 'less-than', this.intl.getComparisonText('less-than') ],
                                                                          [ 'is-in-range', this.intl.getComparisonText('is-in-range') ]
                                                                        ]);
  readonly clearControlIcon         = this.config.icons.clearControl;
  private defaultFilter: DataFilter = this.data.defaultFilter ??
    {
      comparisonName: 'equals',
      values        : [ null, null ]
    };
  readonly form                     = this.fBuilder.group({
                                                            comparisonName: new FormControl<string>(
                                                              this.data.filter?.comparisonName ??
                                                              this.defaultFilter.comparisonName,
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
  private placeholdersSubject       = new BehaviorSubject<string[]>(this.intl.getDateFiltersPlaceholders(this.form.value.comparisonName as FilterComparison));
  readonly placeHolders$            = this.placeholdersSubject.asObservable();
  private filterChangedSubject      = new Subject<DataFilter | null>();
  readonly filterChanged$           = this.filterChangedSubject.asObservable();
  private unsubscribeControls: Subject<void> | undefined;

  constructor(private fBuilder: FormBuilder,
              private intl: NgxMatDataFilterIntl,
              private config: NgxMatDataFilterConfiguration,
              @Inject(FILTER_SELECTOR_DATA) protected data: FilterSelectorData) {
    super();
  }

  ngOnInit(): void {
    this.subscribeFormControls();
  }

  ngOnDestroy(): void {
    this.unsubscribeFormControls();
  }

  clearControls(): void {
    this.form.patchValue({ date1: null, date2: null });
  }

  protected subscribeFormControls(): void {
    this.unsubscribeControls = new Subject<void>();

    this.form.valueChanges
        .pipe(
          distinctUntilChanged(),
          takeUntil(this.unsubscribeControls),
          tap(({ comparisonName }) => this.placeholdersSubject.next(this.intl.getDateFiltersPlaceholders(comparisonName as FilterComparison))),
          map(value => this.getFilter(value))
        )
        .subscribe(filter => this.filterChangedSubject.next(filter));
  }

  protected unsubscribeFormControls(): void {
    this.unsubscribeControls?.next();
    this.unsubscribeControls?.complete();
  }

  private getFilter(value: Partial<{ comparisonName: string; date1: Date | null; date2: Date | null; }>): DataFilter | null {
    if (value.comparisonName === this.defaultFilter.comparisonName &&
      value.date1 == this.defaultFilter.values[0] &&
      value.date2 == this.defaultFilter.values[1]) {
      return null;
    }

    const values = [];

    if (!!value.date1) {
      values.push(value.date1);

      if (!!value.date2) {
        values.push(value.date2);
      }
    }

    return {
      comparisonName: value.comparisonName!,
      values
    };
  }
}
