import { ChangeDetectionStrategy, Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FilterSelectorBase } from '../filter-selector-base';
import { BehaviorSubject, distinctUntilChanged, map, Subject, takeUntil, withLatestFrom } from 'rxjs';
import { DataFilter } from '../data-filter';
import { FILTER_SELECTOR_DATA, FilterSelectorData } from '../filter-selector-data';
import { ComparisonItem } from '../comparison-item';
import { DataFilterComparison } from '../data-filter-comparison';
import { NgxMatDataFilterIntl } from '../ngx-mat-data-filter-intl';
import { FormArray, FormBuilder, FormControl, Validators } from '@angular/forms';
import { ValueListItem } from '../value-list-item';

@Component({
             selector       : 'ngx-mat-value-list-filter-selector',
             templateUrl    : './mat-value-list-filter-selector.component.html',
             styleUrls      : [ './mat-value-list-filter-selector.component.scss' ],
             changeDetection: ChangeDetectionStrategy.OnPush
           })
export class MatValueListFilterSelectorComponent implements OnInit, OnDestroy, FilterSelectorBase {
  readonly availableComparisons: ComparisonItem[] = [
    this.intl.getComparisonItem(DataFilterComparison.IsOneOf),
    this.intl.getComparisonItem(DataFilterComparison.IsNotOneOf)
  ];
  readonly form                                   = this.fBuilder.group({
                                                                          comparison       : new FormControl(this.availableComparisons[0].comparison, {
                                                                            nonNullable: true,
                                                                            validators : [ Validators.required ]
                                                                          }),
                                                                          valueItemControls: this.fBuilder.array<FormControl<boolean>>([])
                                                                        });
  private valueItemsSubject                       = new BehaviorSubject<ValueListItem[]>([]);
  readonly valueItems$                            = this.valueItemsSubject.asObservable();
  private filterChangeSubject                     = new Subject<DataFilter | null>();
  readonly filterChanged$                         = this.filterChangeSubject.asObservable();
  private unsubscribeValueItems: Subject<void> | undefined;
  private unsubscribeControls: Subject<void> | undefined;

  constructor(@Inject(FILTER_SELECTOR_DATA) private data: FilterSelectorData,
              private intl: NgxMatDataFilterIntl,
              private fBuilder: FormBuilder) {
  }

  ngOnInit(): void {
    this.valueItemsSubject.next(this.data.valueListItems ?? []);
    this.subscribeValueItems();
  }

  ngOnDestroy(): void {
    this.unSubscribeValueItems();
    this.unsubscribeFormControls();
  }

  private subscribeFormControls(): void {
    this.unsubscribeControls = new Subject<void>();

    this.form.valueChanges
        .pipe(
          distinctUntilChanged(),
          takeUntil(this.unsubscribeControls!),
          withLatestFrom(this.valueItems$),
          map(([ value, items ]) => {
            const values = items.filter((item, index) => value.valueItemControls![index]).map(item => item.value);

            if (values.length === items.length) {
              return null;
            }

            return {
              comparison: value.comparison,
              values
            } as DataFilter;
          })
        )
        .subscribe(filter => this.filterChangeSubject.next(filter));
  }

  private unsubscribeFormControls(): void {
    this.unsubscribeControls?.next();
    this.unsubscribeControls?.complete();
  }

  private subscribeValueItems(): void {
    this.unsubscribeValueItems = new Subject<void>();

    this.valueItemsSubject
        .pipe(takeUntil(this.unsubscribeValueItems))
        .subscribe(items => this.createControls(items));
  }

  private unSubscribeValueItems(): void {
    this.unsubscribeValueItems?.next();
    this.unsubscribeValueItems?.complete();
  }

  private createControls(items: ValueListItem[]): void {
    this.unsubscribeFormControls();

    const itemControls      = this.form.get('valueItemControls') as FormArray<FormControl<boolean>>;
    const comparisonControl = this.form.get('comparison');

    itemControls.clear();

    items.forEach(item => {
      const checked = this.data.filter?.values.includes(item.value) ?? true;

      itemControls.push(new FormControl(checked, { nonNullable: true, validators: [ Validators.required ] }));
    });

    comparisonControl?.setValue(this.data.filter?.comparison ?? this.availableComparisons[0].comparison);

    this.subscribeFormControls();
  }
}
