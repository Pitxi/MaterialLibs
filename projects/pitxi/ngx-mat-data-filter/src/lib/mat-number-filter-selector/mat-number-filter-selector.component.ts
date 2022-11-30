import { ChangeDetectionStrategy, Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FilterSelectorBase } from '../filter-selector-base';
import { DataFilter } from '../data-filter';
import { BehaviorSubject, distinctUntilChanged, map, Subject, takeUntil, tap } from 'rxjs';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { NgxMatDataFilterIntl } from '../ngx-mat-data-filter-intl';
import { DataFilterComparison } from '../data-filter-comparison';
import { FILTER_SELECTOR_DATA, FilterSelectorData } from '../filter-selector-data';

@Component({
             selector       : 'ngx-mat-number-filter-selector',
             templateUrl    : './mat-number-filter-selector.component.html',
             styleUrls      : [ './mat-number-filter-selector.component.scss' ],
             changeDetection: ChangeDetectionStrategy.OnPush
           })
export class MatNumberFilterSelectorComponent
  extends FilterSelectorBase
  implements OnInit, OnDestroy {
  readonly availableComparisons     = [
    this.intl.getComparisonItem(DataFilterComparison.EqualTo),
    this.intl.getComparisonItem(DataFilterComparison.NotEqualTo),
    this.intl.getComparisonItem(DataFilterComparison.GreaterThan),
    this.intl.getComparisonItem(DataFilterComparison.LesserThan),
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
                                                            number1   : new FormControl<number | null>(this.data.filter?.values[0] ?? this.defaultFilter.values[0]),
                                                            number2   : new FormControl<number | null>(this.data.filter?.values[1] ?? this.defaultFilter.values[0])
                                                          });
  private placeholdersSubject       = new BehaviorSubject<string[]>(this.intl.getNumberFiltersPlaceholders(this.form.value.comparison!));
  readonly placeHolders$            = this.placeholdersSubject.asObservable();
  private filterChangedSubject      = new Subject<DataFilter | null>;
  readonly filterChanged$           = this.filterChangedSubject.asObservable();

  constructor(private fBuilder: FormBuilder,
              private intl: NgxMatDataFilterIntl,
              @Inject(FILTER_SELECTOR_DATA) private data: FilterSelectorData) {
    super();
  }

  clearControl(controlName: string): void {
    this.form.get(controlName)?.reset();
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
          tap(({ comparison }) => this.placeholdersSubject.next(this.intl.getNumberFiltersPlaceholders(comparison!))),
          map(value => this.getFilter(value))
        )
        .subscribe(filter => this.filterChangedSubject.next(filter));
  }

  protected unsubscribeFormControls(): void {
    this.unsubscribeControls?.next();
    this.unsubscribeControls?.complete();
  }

  private getFilter(value: Partial<{ comparison: DataFilterComparison; number1: number | null; number2: number | null; }>)
    : DataFilter | null {

    if (value.comparison === this.defaultFilter.comparison &&
      value.number1 == this.defaultFilter.values[0] &&
      value.number2 == this.defaultFilter.values[1]
    ) {
      return null;
    }

    const values = [];

    if (value.number1 != null) {
      values.push(value.number1);

      if (value.number2 != null) {
        values.push(value.number2);
      }
    }

    return {
      comparison: value.comparison ?? this.defaultFilter.comparison,
      values
    };
  }
}
