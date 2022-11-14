import { ChangeDetectionStrategy, Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FilterSelectorBase } from '../filter-selector-base';
import { DataFilter } from '../data-filter';
import { BehaviorSubject, distinctUntilChanged, filter, map, Subject, takeUntil, tap } from 'rxjs';
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
  readonly availableComparisons = [
    this.intl.getComparisonItem(DataFilterComparison.EqualTo),
    this.intl.getComparisonItem(DataFilterComparison.NotEqualTo),
    this.intl.getComparisonItem(DataFilterComparison.GreaterThan),
    this.intl.getComparisonItem(DataFilterComparison.LesserThan),
    this.intl.getComparisonItem(DataFilterComparison.IsInRange)
  ];
  readonly form                 = this.fBuilder.group({
                                                        comparison: new FormControl<DataFilterComparison>(
                                                          this.data.filter?.comparison ?? this.availableComparisons[0].comparison,
                                                          {
                                                            nonNullable: true,
                                                            validators : [ Validators.required ]
                                                          }
                                                        ),
                                                        number1   : new FormControl<number | null>(this.data.filter?.values[0] ?? null),
                                                        number2   : new FormControl<number | null>(this.data.filter?.values[1] ?? null)
                                                      });
  private placeholdersSubject   = new BehaviorSubject<string[]>(this.intl.getNumberFiltersPlaceholders(this.form.value.comparison!));
  readonly placeHolders$        = this.placeholdersSubject.asObservable();
  private filterChangedSubject  = new Subject<DataFilter | null>;
  readonly filterChanged$       = this.filterChangedSubject.asObservable();

  constructor(private fBuilder: FormBuilder,
              private intl: NgxMatDataFilterIntl,
              @Inject(FILTER_SELECTOR_DATA) private data: FilterSelectorData) {
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
          tap(({ comparison }) => {
            this.placeholdersSubject.next(
              this.intl.getNumberFiltersPlaceholders(comparison ?? this.availableComparisons[0].comparison)
            );
          }),
          map(value => this.getFilter(value))
        )
        .subscribe(filter => {
          this.filterChangedSubject.next(filter);
        });
  }

  protected unsubscribeFormControls(): void {
    this.unsubscribeControls?.next();
    this.unsubscribeControls?.complete();
  }

  private getFilter(value: Partial<{ comparison: DataFilterComparison; number1: number | null; number2: number | null; }>)
    : DataFilter | null {
    switch (value.comparison) {
      case undefined:
      case null:
        return null;
      case DataFilterComparison.IsInRange:
        if (value.number1 == null && value.number2 == null) {
          return null;
        }
        break;
      default:
        if (value.number1 == null) {
          return null;
        }
        break;
    }

    return { comparison: value.comparison, values: [ value.number1, value.number2 ] };
  }
}
