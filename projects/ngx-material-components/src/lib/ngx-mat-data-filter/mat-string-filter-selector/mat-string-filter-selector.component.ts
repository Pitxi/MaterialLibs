import { ChangeDetectionStrategy, Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FilterSelectorBase } from '../filter-selector-base';
import { DataFilter } from '../data-filter';
import { distinctUntilChanged, map, Observable, Subject, takeUntil } from 'rxjs';
import { FILTER_SELECTOR_DATA, FilterSelectorData } from '../filter-selector-data';
import { NgxMatDataFilterIntl } from '../ngx-mat-data-filter-intl';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { ComparisonItem } from '../comparison-item';
import { DataFilterComparison } from '../data-filter-comparison';

@Component({
             selector       : 'ngx-mat-string-filter-selector',
             templateUrl    : './mat-string-filter-selector.component.html',
             styleUrls      : [ './mat-string-filter-selector.component.scss' ],
             changeDetection: ChangeDetectionStrategy.OnPush
           })
export class MatStringFilterSelectorComponent
  extends FilterSelectorBase
  implements OnInit, OnDestroy {
  readonly availableComparisons: ComparisonItem[]        = [
    this.intl.getComparisonItem(DataFilterComparison.EqualTo),
    this.intl.getComparisonItem(DataFilterComparison.NotEqualTo),
    this.intl.getComparisonItem(DataFilterComparison.Contains)
  ];
  readonly placeholder                                   = this.intl.stringFilterPlaceholder;
  private defaultFilter: DataFilter                      = this.data.defaultFilter ??
    {
      comparison: this.availableComparisons[0].comparison,
      values    : [ null ]
    };
  readonly form                                          = this.fBuilder.group({
                                                                                 comparison: new FormControl<DataFilterComparison>(
                                                                                   this.data.filter?.comparison ??
                                                                                   this.defaultFilter.comparison,
                                                                                   {
                                                                                     nonNullable: true,
                                                                                     validators : [ Validators.required ]
                                                                                   }),
                                                                                 text      : new FormControl<string | null>(
                                                                                   this.data.filter?.values[0] ??
                                                                                   this.defaultFilter.values[0]
                                                                                 )
                                                                               });
  private filterChangedSubject                           = new Subject<DataFilter | null>();
  readonly filterChanged$: Observable<DataFilter | null> = this.filterChangedSubject.asObservable();

  constructor(@Inject(FILTER_SELECTOR_DATA) private data: FilterSelectorData,
              private intl: NgxMatDataFilterIntl,
              private fBuilder: FormBuilder) {
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
          map(value => {
            if (value.comparison === this.defaultFilter.comparison &&
              value.text == this.defaultFilter.values[0]) {
              return null;
            }

            return { comparison: value.comparison, values: [ value.text ] } as DataFilter;
          })
        )
        .subscribe(filter => this.filterChangedSubject.next(filter));
  }

  protected unsubscribeFormControls(): void {
    this.unsubscribeControls?.next();
    this.unsubscribeControls?.complete();
  }
}
