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
export class MatStringFilterSelectorComponent implements FilterSelectorBase, OnInit, OnDestroy {
  readonly availableComparisons: ComparisonItem[]        = [
    this.intl.getComparisonItem(DataFilterComparison.EqualTo),
    this.intl.getComparisonItem(DataFilterComparison.NotEqualTo),
    this.intl.getComparisonItem(DataFilterComparison.Contains)
  ];
  readonly form                                          = this.fBuilder.group({
                                                                                 comparison: new FormControl(this.data.filter?.comparison ?? this.availableComparisons[0].comparison,
                                                                                                             {
                                                                                                               nonNullable: true,
                                                                                                               validators : [ Validators.required ]
                                                                                                             }),
                                                                                 text      : new FormControl<string | null>(this.data.filter?.values[0] ?? null)
                                                                               });
  readonly placeholder                                   = this.intl.stringFilterPlaceholder;
  private filterChangedSubject                           = new Subject<DataFilter | null>();
  readonly filterChanged$: Observable<DataFilter | null> = this.filterChangedSubject.asObservable();
  private unsubscribeControls: Subject<void> | undefined;

  constructor(@Inject(FILTER_SELECTOR_DATA) private data: FilterSelectorData,
              private intl: NgxMatDataFilterIntl,
              private fBuilder: FormBuilder) {
  }

  ngOnInit(): void {
    this.subscribeFormControls();
  }

  ngOnDestroy(): void {
    this.unsubscribeFormControls();
  }

  private subscribeFormControls(): void {
    this.unsubscribeControls = new Subject<void>();

    this.form.valueChanges
        .pipe(
          distinctUntilChanged(),
          takeUntil(this.unsubscribeControls),
          map(value => !!value.text ? { comparison: value.comparison, values: [ value.text ] } as DataFilter : null)
        )
        .subscribe(filter => this.filterChangedSubject.next(filter));
  }

  private unsubscribeFormControls(): void {
    this.unsubscribeControls?.next();
    this.unsubscribeControls?.complete();
  }
}
